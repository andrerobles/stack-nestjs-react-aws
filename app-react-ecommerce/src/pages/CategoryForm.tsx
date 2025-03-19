import React, { useEffect, useState } from "react";
import { TextField, Grid, CircularProgress } from "@mui/material";
import { Category } from "../models/Category";
import GenericForm from "../components/GenericForm";
import { CategoryService } from "../services/CategoryService";

interface CategoryFormProps {
	open: boolean;
	itemId: string | null; // Changed from item: Category | null
	onClose: () => void;
	onSubmit: (category: Category) => Promise<void>;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
	open,
	itemId,
	onClose,
	onSubmit,
}) => {
	const [loading, setLoading] = useState(false);
	const [item, setItem] = useState<Category | undefined>();

	// Fetch item when itemId changes
	useEffect(() => {
		const fetchItem = async () => {
			if (itemId) {
				setLoading(true);
				try {
					const fetchedItem = await CategoryService.getById(itemId);
					setItem(fetchedItem);
				} catch (error) {
					console.error("Error fetching category:", error);
				} finally {
					setLoading(false);
				}
			} else {
				setItem(null);
			}
		};

		if (open) {
			fetchItem();
		}
	}, [itemId, open]);

	const getEmptyCategory = (): Category => ({
		id: "",
		name: "",
	});

	const renderCategoryFields = (
		formData: Category,
		handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	) => (
		<Grid item xs={12}>
			{loading ? (
				<CircularProgress />
			) : (
				<TextField
					name="name"
					label="Category Name"
					value={formData.name}
					onChange={handleChange}
					fullWidth
					required
				/>
			)}
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
			loading={loading}
		/>
	);
};

export default CategoryForm;
