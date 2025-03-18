import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Category } from 'src/modules/categories/schemas/category.schema/category.schema';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }] })
  categoryIds: Category[];

  @Prop()
  imageUrl: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
