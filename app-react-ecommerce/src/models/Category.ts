export interface Category {
	id: string;
	name: string;
}

export interface CategorySchema {
	_id: string;
	name: string;
}

export const convertCategoriesToString = (
	categories: CategorySchema[]
): string => {
	return categories.map((category) => category.name).join(", ");
};
