import React from "react";
import { TextField, Grid } from "@mui/material";
import { Category } from "../models/Category";
import GenericForm from "../components/GenericForm";

interface CategoryFormProps {
	open: boolean;
	item: Category | null;
	onClose: () => void;
	onSubmit: (category: Category) => Promise<void>;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
	open,
	item,
	onClose,
	onSubmit,
}) => {
	const getEmptyCategory = (): Category => ({
		id: "",
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
			/>
		</Grid>
	);

	return (
		<GenericForm<Category>
			open={open}
			title="Category"
			item={item}
			onClose={onClose}
			onSubmit={onSubmit}
			renderFields={renderCategoryFields}
			getEmptyItem={getEmptyCategory}
		/>
	);
};

export default CategoryForm;
