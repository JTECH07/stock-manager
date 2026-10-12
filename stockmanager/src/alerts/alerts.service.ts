import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async checkAlerts(productId?: number) {
    return this.getLowStockItems(5, productId);
  }

  async getLowStockItems(threshold: number = 5, productId?: number) {
    const t = Number(threshold) || 5;
    const where: any = {
      quantity: LessThanOrEqual(t),
    };
    if (productId) {
      where.id = Number(productId);
    }

    const lowStockProducts = await this.productRepository.find({
      where,
      order: { quantity: 'ASC' },
      relations: { category: true },
    });

    return lowStockProducts.map((p) => ({
      productId: p.id,
      productName: p.name,
      currentQuantity: p.quantity,
      threshold: t,
      categoryName: p.category?.name || 'Sans catégorie',
      message:
        p.quantity === 0
          ? `Rupture de stock pour "${p.name}" (quantité: 0)`
          : `Stock faible pour "${p.name}" (${p.quantity} restant(s), seuil: ${t})`,
    }));
  }
}