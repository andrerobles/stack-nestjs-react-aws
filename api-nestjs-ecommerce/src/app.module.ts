import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:password@localhost:27017/ecommerce?authSource=admin',
    ),
    ProductsModule,
    CategoriesModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
