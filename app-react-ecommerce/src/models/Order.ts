export type ProductName = string;

export interface Order {
	id: number;
	date: Date;
	products: ProductName[];
	total: number;
}
