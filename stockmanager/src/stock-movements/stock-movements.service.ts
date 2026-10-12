import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { Product } from '../products/entities/product.entity';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';

@Injectable()
export class StockMovementsService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly movementRepository: Repository<StockMovement>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createStockMovementDto: CreateStockMovementDto) {
    const { productId, type, quantity } = createStockMovementDto;
    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      throw new BadRequestException('La quantité doit être supérieure à 0');
    }

    const product = await this.productRepository.findOne({
      where: { id: Number(productId) },
    });

    if (!product) {
      throw new NotFoundException(`Produit avec l'ID ${productId} non trouvé`);
    }

    if (type === 'OUT' && product.quantity < qty) {
      throw new BadRequestException(
        `Stock insuffisant. Stock actuel : ${product.quantity}, demandé : ${qty}`,
      );
    }

    // Mise à jour de la quantité du produit
    if (type === 'IN') {
      product.quantity += qty;
    } else if (type === 'OUT') {
      product.quantity -= qty;
    }

    await this.productRepository.save(product);

    // Création du mouvement
    const movement = this.movementRepository.create({
      productId: product.id,
      type,
      quantity: qty,
    });

    const savedMovement = await this.movementRepository.save(movement);
    return {
      ...savedMovement,
      product: {
        id: product.id,
        name: product.name,
        newQuantity: product.quantity,
      },
    };
  }

  async findAll(productId?: number) {
    const where: any = {};
    if (productId) {
      where.productId = Number(productId);
    }

    return this.movementRepository.find({
      where,
      order: { date: 'DESC' },
      relations: { product: true },
    });
  }
}