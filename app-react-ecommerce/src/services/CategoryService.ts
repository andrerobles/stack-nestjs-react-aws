import axios from "axios";
import { Category, CategorySchema } from "../models/Category";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:3000";

const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const CategoryService = {
	// Exemplo de como o método getAll deve estar formatando os dados
	getAll: async (): Promise<Category[] | undefined> => {
		try {
			const response = await api.get("/categories");

			if (response.data) {
				const categoriesResponse: CategorySchema[] = response.data;
				// Adapta retorno para o padrão
				return categoriesResponse.map((category: CategorySchema) => ({
					id: category._id,
					name: category.name,
				}));
			}
		} catch (error) {
			console.error("Failed to fetch categories:", error);
			throw error;
		}
	},

	// O método getById também deve formatar o resultado
	getById: async (id: string): Promise<Category | undefined> => {
		try {
			const response = await api.get(`/categories/${id}`);
			if (response.data) {
				return {
					id: response.data._id,
					name: response.data.name,
				};
			}
			return undefined;
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 404) {
				return undefined;
			}
			console.error(`Failed to fetch category with id ${id}:`, error);
			throw error;
		}
	},

	// O método create deve enviar apenas o name e formatar o resultado
	create: async (
		category: Omit<Category, "id">
	): Promise<Category | undefined> => {
		try {
			const response = await api.post("/categories", { name: category.name });
			if (response.data) {
				const category: CategorySchema = response.data;
				return {
					id: category._id,
					name: category.name,
				};
			}
			return undefined;
		} catch (error) {
			console.error("Failed to create category:", error);
			throw error;
		}
	},

	// O método update deve enviar apenas o name e formatar o resultado
	update: async (
		id: string,
		category: Partial<Category>
	): Promise<Category> => {
		try {
			const response = await api.patch(`/categories/${id}`, {
				name: category.name,
			});
			return {
				id: response.data._id,
				name: response.data.name,
			};
		} catch (error) {
			console.error(`Failed to update category with id ${id}:`, error);
			throw error;
		}
	},

	delete: async (id: string): Promise<boolean> => {
		try {
			await api.delete(`/categories/${id}`);
			return true;
		} catch (error) {
			console.error(`Failed to delete category with id ${id}:`, error);
			throw error;
		}
	},
};
