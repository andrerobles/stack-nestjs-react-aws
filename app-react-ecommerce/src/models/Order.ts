import { ProductSchema } from "./Product";

export type ProductName = string;

export interface Order {
	id: string;
	date: Date;
	products: string;
	total: number;
}

export interface OrderSchema {
	_id: string;
	date: Date;
	productIds: ProductSchema[];
	total: number;
}
