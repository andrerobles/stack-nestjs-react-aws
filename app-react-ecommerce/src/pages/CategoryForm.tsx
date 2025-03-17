// src/components/category/CategoryForm.tsx
import React from "react";
import { TextField, Grid } from "@mui/material";
import { Category } from "../models/Category";
import GenericForm from "../components/GenericForm";

interface CategoryFormProps {
	open: boolean;
	category: Category | null;
	onClose: () => void;
	onSubmit: (category: Category) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
	open,
	category,
	onClose,
	onSubmit,
}) => {
	const getEmptyCategory = (): Category => ({
		id: 0,
		name: "",
	});

	const renderCategoryFields = (
		formData: Category,
		handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	) => (
		<Grid item xs={12}>
			<TextField
				name="name"
				label="Category Name"
				value={formData.name}
				onChange={handleChange}
				fullWidth
				required
				// Comentário em português: Nome da categoria
			/>
		</Grid>
	);

	return (
		<GenericForm<Category>
			open={open}
			title="Category"
			item={category}
			onClose={onClose}
			onSubmit={onSubmit}
			renderFields={renderCategoryFields}
			getEmptyItem={getEmptyCategory}
		/>
	);
};

export default CategoryForm;
