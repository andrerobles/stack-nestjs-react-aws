// src/services/CategoryService.ts
import { mockCategories } from "../assets/mocks/CategoryMock";
import { Category } from "../models/Category";

export const CategoryService = {
	getAll: (): Promise<Category[]> => {
		return Promise.resolve(mockCategories);
	},

	getById: (id: number): Promise<Category | undefined> => {
		const category = mockCategories.find((c) => c.id === id);
		return Promise.resolve(category);
	},

	create: (category: Omit<Category, "id">): Promise<Category> => {
		// Simulando geração de ID
		const newId = Math.max(...mockCategories.map((c) => c.id)) + 1;
		const newCategory = { ...category, id: newId };
		mockCategories.push(newCategory);
		return Promise.resolve(newCategory);
	},

	update: (category: Category): Promise<Category> => {
		const index = mockCategories.findIndex((c) => c.id === category.id);
		if (index !== -1) {
			mockCategories[index] = category;
			return Promise.resolve(category);
		}
		return Promise.reject(new Error("Category not found"));
	},

	delete: (id: number): Promise<boolean> => {
		const index = mockCategories.findIndex((c) => c.id === id);
		if (index !== -1) {
			mockCategories.splice(index, 1);
			return Promise.resolve(true);
		}
		return Promise.reject(new Error("Category not found"));
	},
};
