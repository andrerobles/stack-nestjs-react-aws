export interface Category {
	id: string;
	name: string;
}

export interface CategoryResponse {
	_id: string;
	name: string;
}

export const convertCategoriesToString = (
	categories: CategoryResponse[]
): string => {
	return categories.map((category) => category.name).join(", ");
};
