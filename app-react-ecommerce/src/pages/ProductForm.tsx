import React, { useEffect, useState } from "react";
import {
	TextField,
	Grid,
	CircularProgress,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Box,
	Typography,
	Chip,
	SelectChangeEvent,
} from "@mui/material";
import { Product } from "../models/Product";
import GenericForm from "../components/GenericForm";
import { ProductService } from "../services/ProductService";
import { CategoryService } from "../services/CategoryService";
import { Category } from "../models/Category";

interface ProductFormProps {
	open: boolean;
	itemId: string | null;
	onClose: () => void;
	onSubmit: (product: Product) => Promise<void>;
}

interface CategorySelection {
	id: string;
	name: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
	open,
	itemId,
	onClose,
	onSubmit,
}) => {
	const [loading, setLoading] = useState(false);
	const [item, setItem] = useState<Product | null>(null);

	// Simplify state management by using a single state for selected categories
	const [selectedCategories, setSelectedCategories] = useState<
		CategorySelection[]
	>([]);
	const [availableCategories, setAvailableCategories] = useState<Category[]>(
		[]
	);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
	const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);

	// Fetch item when itemId changes
	useEffect(() => {
		const fetchItem = async () => {
			if (itemId) {
				setLoading(true);
				try {
					const fetchedItem = await ProductService.getById(itemId);
					if (fetchedItem) {
						setItem(fetchedItem);

						// Parse categories from fetched item
						if (fetchedItem.categoryList && fetchedItem.categoryText) {
							const categoryIds = fetchedItem.categoryList;
							const categoryNames = fetchedItem.categoryText.split(", ");

							// Create array of category selections
							const categories: CategorySelection[] = [];
							for (
								let i = 0;
								i < Math.min(categoryIds.length, categoryNames.length);
								i++
							) {
								categories.push({
									id: categoryIds[i],
									name: categoryNames[i],
								});
							}

							setSelectedCategories(categories);
						} else {
							setSelectedCategories([]);
						}
					}
				} catch (error) {
					console.error("Error fetching product:", error);
				} finally {
					setLoading(false);
				}
			} else {
				setItem(null);
				setSelectedCategories([]);
			}
		};

		if (open) {
			fetchItem();
		}
	}, [itemId, open]);

	// Load available categories
	useEffect(() => {
		const loadCategories = async () => {
			setCategoriesLoading(true);
			try {
				const categories = await CategoryService.getAll();
				if (categories) {
					setAvailableCategories(categories);
				}
			} catch (error) {
				console.error("Failed to load categories:", error);
			} finally {
				setCategoriesLoading(false);
			}
		};

		if (open) {
			loadCategories();
		}
	}, [open]);

	const handleCategoryChange = (e: SelectChangeEvent<string>) => {
		setSelectedCategoryId(e.target.value as string);
	};

	const handleAddCategory = () => {
		if (selectedCategoryId) {
			const categoryToAdd = availableCategories.find(
				(c) => c.id === selectedCategoryId
			);

			if (
				categoryToAdd &&
				!selectedCategories.some((c) => c.id === categoryToAdd.id)
			) {
				const newCategory: CategorySelection = {
					id: categoryToAdd.id,
					name: categoryToAdd.name,
				};

				setSelectedCategories((prev) => [...prev, newCategory]);
				setSelectedCategoryId("");
			}
		}
	};

	const handleRemoveCategory = (index: number) => {
		setSelectedCategories((prev) => {
			const updated = [...prev];
			updated.splice(index, 1);
			return updated;
		});
	};

	const getEmptyProduct = (): Product => ({
		id: "",
		name: "",
		description: "",
		price: 0,
		categoryText: "",
		categoryList: [],
		imageUrl: "",
	});

	const handleSubmit = (product: Product) => {
		// Ensure we're submitting with the latest category data
		const updatedProduct = {
			...product,
			categoryText: selectedCategories.map((c) => c.name).join(", "),
			categoryList: selectedCategories.map((c) => c.id),
		};

		return onSubmit(updatedProduct);
	};

	const renderProductFields = (
		formData: Product,
		handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
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
							onChange={handleInputChange}
							fullWidth
							required
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="description"
							label="Description"
							value={formData.description}
							onChange={handleInputChange}
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
							onChange={handleInputChange}
							fullWidth
							required
							inputProps={{ min: 0, step: 1 }}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">Categories</Typography>
					</Grid>
					<Grid item xs={8}>
						<FormControl fullWidth>
							<InputLabel id="category-select-label">
								Select Category
							</InputLabel>
							<Select
								labelId="category-select-label"
								id="category-select"
								value={selectedCategoryId}
								onChange={handleCategoryChange}
								label="Select Category"
								disabled={categoriesLoading}
							>
								{availableCategories.map((category) => (
									<MenuItem key={category.id} value={category.id}>
										{category.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={4}>
						<Button
							variant="contained"
							color="primary"
							onClick={handleAddCategory}
							fullWidth
							disabled={!selectedCategoryId || categoriesLoading}
						>
							Add Category
						</Button>
					</Grid>
					<Grid item xs={12}>
						{selectedCategories.length > 0 ? (
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
								{selectedCategories.map((category, index) => (
									<Chip
										key={index}
										label={category.name}
										onDelete={() => handleRemoveCategory(index)}
										color="primary"
										variant="outlined"
									/>
								))}
							</Box>
						) : (
							<Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
								No categories added yet
							</Typography>
						)}
					</Grid>
					<Grid item xs={12}>
						<TextField
							name="imageUrl"
							label="Image URL"
							value={formData.imageUrl}
							onChange={handleInputChange}
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
			onSubmit={handleSubmit}
			renderFields={renderProductFields}
			getEmptyItem={getEmptyProduct}
			loading={loading}
		/>
	);
};

export default ProductForm;
