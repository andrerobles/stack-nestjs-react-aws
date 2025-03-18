import { CategorySchema } from "./Category";

export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	categories: string;
	imageUrl: string;
}

export interface ProductSchema {
	_id: string;
	name: string;
	description: string;
	price: number;
	categoryIds: CategorySchema[];
	imageUrl: string;
}
