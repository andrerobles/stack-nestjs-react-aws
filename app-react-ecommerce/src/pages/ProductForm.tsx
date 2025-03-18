import React from "react";
import { TextField, Grid } from "@mui/material";
import { Product } from "../models/Product";
import GenericForm from "../components/GenericForm";

interface ProductFormProps {
	open: boolean;
	item: Product | null;
	onClose: () => void;
	onSubmit: (product: Product) => Promise<void>;
}

const ProductForm: React.FC<ProductFormProps> = ({
	open,
	item,
	onClose,
	onSubmit,
}) => {
	const getEmptyProduct = (): Product => ({
		id: "",
		name: "",
		description: "",
		price: 0,
		categories: "",
		imageUrl: "",
	});

	const renderProductFields = (
		formData: Product,
		handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	) => (
		<>
			<Grid item xs={12}>
				<TextField
					name="name"
					label="Name"
					value={formData.name}
					onChange={handleChange}
					fullWidth
					required
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					name="description"
					label="Description"
					value={formData.description}
					onChange={handleChange}
					fullWidth
					multiline
					rows={3}
					required
				/>
			</Grid>
			<Grid item xs={6}>
				<TextField
					name="price"
					label="Price"
					type="number"
					value={formData.price}
					onChange={handleChange}
					fullWidth
					required
					inputProps={{ min: 0, step: 1 }}
				/>
			</Grid>
			<Grid item xs={6}>
				<TextField
					name="categoryName"
					label="Category"
					value={formData.categories}
					onChange={handleChange}
					fullWidth
					required
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					name="imageUrl"
					label="Image URL"
					value={formData.imageUrl}
					onChange={handleChange}
					fullWidth
				/>
			</Grid>
		</>
	);

	return (
		<GenericForm<Product>
			open={open}
			title="Product"
			item={item}
			onClose={onClose}
			onSubmit={onSubmit}
			renderFields={renderProductFields}
			getEmptyItem={getEmptyProduct}
		/>
	);
};

export default ProductForm;
