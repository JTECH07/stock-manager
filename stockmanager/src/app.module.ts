import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { AlertsModule } from './alerts/alerts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { Product } from './products/entities/product.entity';
import { Category } from './categories/entities/category.entity';
import { StockMovement } from './stock-movements/entities/stock-movement.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'stockmanager.sqlite',
      entities: [Product, Category, StockMovement, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product, Category, StockMovement, User]),
    UsersModule,
    AuthModule,
    ProductsModule,
    CategoriesModule,
    StockMovementsModule,
    AlertsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}