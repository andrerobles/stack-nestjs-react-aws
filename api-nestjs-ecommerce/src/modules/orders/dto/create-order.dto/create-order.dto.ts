import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  productIds: string[];

  @IsNumber()
  @IsNotEmpty()
  total: number;

  @IsOptional()
  date: Date;
}
