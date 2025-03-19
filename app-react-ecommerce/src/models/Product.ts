import { CategoryResponse } from "./Category";

export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	categories: string;
	imageUrl: string;
}

export interface ProductResponse {
	_id: string;
	name: string;
	description: string;
	price: number;
	categoryIds: CategoryResponse[];
	imageUrl: string;
}

export const convertProductsToString = (
	products: ProductResponse[]
): string => {
	return products.map((product) => product.name).join(", ");
};
