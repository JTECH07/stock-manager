import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(page: number = 1, limit: number = 10, categoryId?: number, search?: string) {
    const p = Math.max(1, Number(page) || 1);
    const l = Math.max(1, Number(limit) || 10);
    const skip = (p - 1) * l;

    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (search?.trim()) {
      where.name = Like(`%${search.trim()}%`);
    }

    const [data, total] = await this.productRepository.findAndCount({
      where,
      skip,
      take: l,
      order: { id: 'ASC' },
      relations: { category: true },
    });

    return {
      data,
      total,
      totalPages: Math.ceil(total / l) || 1,
      currentPage: p,
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { category: true, movements: true },
    });
    if (!product) {
      throw new NotFoundException(`Produit avec l'ID ${id} non trouvé`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create({
      ...createProductDto,
      price: createProductDto.price ? Number(createProductDto.price) : 0,
      quantity: createProductDto.quantity ? Number(createProductDto.quantity) : 0,
      categoryId: createProductDto.categoryId ? Number(createProductDto.categoryId) : undefined,
    });
    const saved = await this.productRepository.save(product);
    return this.findOne(saved.id);
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    if (updateProductDto.name !== undefined) product.name = updateProductDto.name;
    if (updateProductDto.description !== undefined) product.description = updateProductDto.description;
    if (updateProductDto.price !== undefined) product.price = Number(updateProductDto.price);
    if (updateProductDto.quantity !== undefined) product.quantity = Number(updateProductDto.quantity);
    if (updateProductDto.categoryId !== undefined) {
      product.categoryId = updateProductDto.categoryId ? Number(updateProductDto.categoryId) : undefined;
    }

    await this.productRepository.save(product);
    return this.findOne(id);
  }

  async remove(id: number): Promise<{ success: boolean; id: number }> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { success: true, id };
  }
}
