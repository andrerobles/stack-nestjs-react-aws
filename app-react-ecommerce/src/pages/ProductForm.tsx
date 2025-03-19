import React, { useEffect, useState } from "react";
import { TextField, Grid, CircularProgress } from "@mui/material";
import { Product } from "../models/Product";
import GenericForm from "../components/GenericForm";
import { ProductService } from "../services/ProductService";

interface ProductFormProps {
	open: boolean;
	itemId: string | null; // Changed from item: Product | null
	onClose: () => void;
	onSubmit: (product: Product) => Promise<void>;
}

const ProductForm: React.FC<ProductFormProps> = ({
	open,
	itemId,
	onClose,
	onSubmit,
}) => {
	const [loading, setLoading] = useState(false);
	const [item, setItem] = useState<Product | null>(null);

	// Fetch item when itemId changes
	useEffect(() => {
		const fetchItem = async () => {
			if (itemId) {
				setLoading(true);
				try {
					const fetchedItem = await ProductService.getById(itemId);
					setItem(fetchedItem);
				} catch (error) {
					console.error("Error fetching product:", error);
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
			{loading ? (
				<Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
					<CircularProgress />
				</Grid>
			) : (
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
			)}
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
			loading={loading}
		/>
	);
};

export default ProductForm;
