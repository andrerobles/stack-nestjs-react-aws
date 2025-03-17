import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('productIds').exec();
  }

  async findOne(id: string): Promise<Order> {
    return this.orderModel.findById(id).populate('productIds').exec();
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    return this.orderModel
      .findByIdAndUpdate(id, updateOrderDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Order> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
