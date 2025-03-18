import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Product } from 'src/modules/products/schemas/product.schema/product.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
  _id?: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  productIds: Product[];

  @Prop({ required: true })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
