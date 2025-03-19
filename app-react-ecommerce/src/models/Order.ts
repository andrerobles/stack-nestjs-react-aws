import { ProductResponse } from "./Product";

export type ProductName = string;

export interface Order {
	id: string;
	date: Date;
	products: string;
	total: number;
}

export interface OrderResponse {
	_id: string;
	date: Date;
	productIds: ProductResponse[];
	total: number;
}
