import axios from "axios";
import { Product, ProductResponse } from "../models/Product";
import { convertCategoriesToString } from "../models/Category";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:3000";

const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const ProductService = {
	getAll: async (): Promise<Product[] | undefined> => {
		try {
			const response = await api.get("/products");

			if (response.data) {
				const productsResponse: ProductResponse[] = response.data;
				// Adapta retorno para o padrão
				return productsResponse.map((product: ProductResponse) => ({
					id: product._id,
					name: product.name,
					description: product.description,
					price: product.price,
					categories: convertCategoriesToString(product.categoryIds),
					imageUrl: product.imageUrl,
				}));
			}
		} catch (error) {
			console.error("Failed to fetch products:", error);
			throw error;
		}
	},

	// O método getById também deve formatar o resultado
	getById: async (id: string): Promise<Product | undefined> => {
		try {
			const response = await api.get(`/products/${id}`);
			if (response.data) {
				if (response.data) {
					const productResponse: ProductResponse = response.data;
					return {
						id: productResponse._id,
						name: productResponse.name,
						price: productResponse.price,
						description: productResponse.description,
						categories: convertCategoriesToString(productResponse.categoryIds),
						imageUrl: productResponse.imageUrl,
					};
				}
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 404) {
				return undefined;
			}
			console.error(`Failed to fetch product with id ${id}:`, error);
			throw error;
		}
	},

	// O método create deve enviar apenas o name e formatar o resultado
	create: async (
		product: Omit<Product, "id">
	): Promise<Product | undefined> => {
		try {
			const response = await api.post("/products", {
				name: product.name,
				description: product.description,
				price: product.price,
				categoryIds: product.categories,
				imageUrl: product.imageUrl,
			});
			if (response.data) {
				const productResponse: ProductResponse = response.data;
				return {
					id: productResponse._id,
					name: productResponse.name,
					description: productResponse.description,
					price: productResponse.price,
					categories: convertCategoriesToString(productResponse.categoryIds),
					imageUrl: productResponse.imageUrl,
				};
			}
		} catch (error) {
			console.error("Failed to create product:", error);
			throw error;
		}
	},

	update: async (
		id: string,
		product: Partial<ProductResponse>
	): Promise<Product | undefined> => {
		try {
			const response = await api.patch(`/products/${id}`, {
				name: product.name,
				description: product.description,
				price: product.price,
				categoryIds: product.categoryIds,
				imageUrl: product.imageUrl,
			});

			if (response.data) {
				const productResponse: ProductResponse = response.data;
				return {
					id: productResponse._id,
					name: productResponse.name,
					description: productResponse.description,
					price: productResponse.price,
					categories: convertCategoriesToString(productResponse.categoryIds),
					imageUrl: productResponse.imageUrl,
				};
			}
		} catch (error) {
			console.error(`Failed to update product with id ${id}:`, error);
			throw error;
		}
	},

	delete: async (id: string): Promise<boolean> => {
		try {
			await api.delete(`/products/${id}`);
			return true;
		} catch (error) {
			console.error(`Failed to delete product with id ${id}:`, error);
			throw error;
		}
	},
};
