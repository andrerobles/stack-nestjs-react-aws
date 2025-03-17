import { mockProducts } from "../assets/mocks/ProductMock";
import { Product } from "../models/Product";

export const ProductService = {
	getAll: (): Promise<Product[]> => {
		return Promise.resolve(mockProducts);
	},

	getById: (id: number): Promise<Product | undefined> => {
		const product = mockProducts.find((p) => p.id === id);
		return Promise.resolve(product);
	},

	create: (product: Omit<Product, "id">): Promise<Product> => {
		// Simulando geração de ID
		const newId = Math.max(...mockProducts.map((p) => p.id)) + 1;
		const newProduct = { ...product, id: newId };
		mockProducts.push(newProduct);
		return Promise.resolve(newProduct);
	},

	update: (product: Product): Promise<Product> => {
		const index = mockProducts.findIndex((p) => p.id === product.id);
		if (index !== -1) {
			mockProducts[index] = product;
			return Promise.resolve(product);
		}
		return Promise.reject(new Error("Product not found"));
	},

	delete: (id: number): Promise<boolean> => {
		const index = mockProducts.findIndex((p) => p.id === id);
		if (index !== -1) {
			mockProducts.splice(index, 1);
			return Promise.resolve(true);
		}
		return Promise.reject(new Error("Product not found"));
	},
};
