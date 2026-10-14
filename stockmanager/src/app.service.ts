import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { StockMovement } from './stock-movements/entities/stock-movement.entity';
import { User, UserRole } from './users/entities/user.entity';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(StockMovement)
    private readonly movementRepository: Repository<StockMovement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
  ) {}

  getHello(): string {
    return 'Welcome to Stock Manager API!';
  }

  async onApplicationBootstrap() {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ role: UserRole.MAGASINIER })
      .where('role = :legacyRole', { legacyRole: 'USER' })
      .execute();

    const legacyUser = await this.userRepository.findOne({
      where: { email: 'user@stockmanager.com' },
    });
    const magasinierUser = await this.userRepository.findOne({
      where: { email: 'magasinier@stockmanager.com' },
    });
    if (legacyUser && !magasinierUser) {
      legacyUser.email = 'magasinier@stockmanager.com';
      legacyUser.name = 'Magasinier Principal';
      legacyUser.role = UserRole.MAGASINIER;
      await this.userRepository.save(legacyUser);
    }

    // 1. Initialisation des utilisateurs de test
    const usersCount = await this.userRepository.count();
    if (usersCount === 0) {
      console.log('Seeding initial users (admin, manager, magasinier)...');

      await this.usersService.create({
        email: 'admin@stockmanager.com',
        name: 'Administrateur Principal',
        password: 'admin123',
        role: UserRole.ADMIN,
      });

      await this.usersService.create({
        email: 'manager@stockmanager.com',
        name: 'Responsable des Stocks',
        password: 'manager123',
        role: UserRole.MANAGER,
      });

      await this.usersService.create({
        email: 'magasinier@stockmanager.com',
        name: 'Magasinier Principal',
        password: 'magasinier123',
        role: UserRole.MAGASINIER,
      });

      console.log('Users seeded: admin, manager, magasinier created!');
    }

    // 2. Initialisation des catégories et produits
    const categoriesCount = await this.categoryRepository.count();
    if (categoriesCount === 0) {
      console.log('Seeding initial categories and products into SQLite...');

      const catInfo = await this.categoryRepository.save({
        name: 'Informatique',
        description: 'Matériel et accessoires informatiques',
      });
      const catBureau = await this.categoryRepository.save({
        name: 'Bureautique',
        description: 'Fournitures de bureau et papeterie',
      });
      const catMobilier = await this.categoryRepository.save({
        name: 'Mobilier',
        description: 'Chaises, bureaux et rangements',
      });

      const p1 = await this.productRepository.save({
        name: 'Ordinateur Portable Pro 15',
        description: 'Intel i7, 16Go RAM, SSD 512Go',
        price: 980.0,
        quantity: 12,
        categoryId: catInfo.id,
      });

      const p2 = await this.productRepository.save({
        name: 'Clavier Mécanique',
        description: 'Switches rouges, rétro-éclairé',
        price: 75.0,
        quantity: 3, // Alerte stock bas
        categoryId: catInfo.id,
      });

      const p3 = await this.productRepository.save({
        name: 'Souris Sans Fil Ergonomique',
        description: 'Capteur haute précision 4000 DPI',
        price: 35.5,
        quantity: 2, // Alerte stock bas
        categoryId: catInfo.id,
      });

      const p4 = await this.productRepository.save({
        name: 'Fauteuil Ergonomique Pro',
        description: 'Support lombaire réglable',
        price: 240.0,
        quantity: 7,
        categoryId: catMobilier.id,
      });

      const p5 = await this.productRepository.save({
        name: 'Ramette Papier A4 80g (x5)',
        description: 'Papier blanc extra pour imprimante',
        price: 24.9,
        quantity: 25,
        categoryId: catBureau.id,
      });

      // Mouvements initiaux
      await this.movementRepository.save([
        { productId: p1.id, type: 'IN', quantity: 15 },
        { productId: p1.id, type: 'OUT', quantity: 3 },
        { productId: p2.id, type: 'IN', quantity: 5 },
        { productId: p2.id, type: 'OUT', quantity: 2 },
        { productId: p3.id, type: 'IN', quantity: 4 },
        { productId: p3.id, type: 'OUT', quantity: 2 },
      ]);

      console.log('Categories, products and movements seeded!');
    }
  }
}
