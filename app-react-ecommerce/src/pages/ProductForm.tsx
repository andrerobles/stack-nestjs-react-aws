import React from "react";
import { TextField, Grid } from "@mui/material";
import { Product } from "../models/Product";
import GenericForm from "../components/GenericForm";

interface ProductFormProps {
	open: boolean;
	product: Product | null;
	onClose: () => void;
	onSubmit: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
	open,
	product,
	onClose,
	onSubmit,
}) => {
	const getEmptyProduct = (): Product => ({
		id: 0,
		name: "",
		description: "",
		price: 0,
		categoryName: "",
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
					// Comentário em português: Campo para nome do produto
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
					// Comentário em português: Descrição detalhada do produto
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
					inputProps={{ min: 0, step: 0.01 }}
					// Comentário em português: Preço do produto
				/>
			</Grid>
			<Grid item xs={6}>
				<TextField
					name="categoryName"
					label="Category"
					value={formData.categoryName}
					onChange={handleChange}
					fullWidth
					required
					// Comentário em português: Categoria do produto
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					name="imageUrl"
					label="Image URL"
					value={formData.imageUrl}
					onChange={handleChange}
					fullWidth
					// Comentário em português: URL da imagem do produto
				/>
			</Grid>
		</>
	);

	return (
		<GenericForm<Product>
			open={open}
			title="Product"
			item={product}
			onClose={onClose}
			onSubmit={onSubmit}
			renderFields={renderProductFields}
			getEmptyItem={getEmptyProduct}
		/>
	);
};

export default ProductForm;
