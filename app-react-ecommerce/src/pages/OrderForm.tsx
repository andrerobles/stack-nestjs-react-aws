import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Grid,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Chip,
	Box,
	Typography,
} from "@mui/material";
import { Order } from "../models/Order";
import { ProductService } from "../services/ProductService";
import { Product } from "../models/Product";

interface OrderFormProps {
	open: boolean;
	item: Order | null;
	onClose: () => void;
	onSubmit: (order: Order, id?: string) => Promise<void>;
}

const OrderForm: React.FC<OrderFormProps> = ({
	open,
	item,
	onClose,
	onSubmit,
}) => {
	const [formData, setFormData] = useState<Order>({
		id: "",
		date: new Date(),
		products: "",
		total: 0,
	});

	const [selectedProductId, setSelectedProductId] = useState<string>("");
	const [productList, setProductList] = useState<string[]>([]);
	const [availableProducts, setAvailableProducts] = useState<
		Product[] | undefined
	>(undefined);
	const [loading, setLoading] = useState<boolean>(false);

	// Carregar produtos disponíveis
	useEffect(() => {
		const loadProducts = async () => {
			setLoading(true);
			try {
				const products = await ProductService.getAll();
				setAvailableProducts(products);
			} catch (error) {
				console.error("Failed to load products:", error);
			} finally {
				setLoading(false);
			}
		};

		if (open) {
			loadProducts();
		}
	}, [open]);

	// Carregar dados do pedido quando o item mudar
	useEffect(() => {
		if (item) {
			setFormData(item);
			// Se products for uma string, convertemos para array para exibição
			setProductList(item.products ? item.products.split(", ") : []);
		} else {
			setFormData({
				id: "",
				date: new Date(),
				products: "",
				total: 0,
			});
			setProductList([]);
		}
	}, [item]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = e.target;

		if (name === "date") {
			setFormData({
				...formData,
				date: new Date(value),
			});
		} else {
			setFormData({
				...formData,
				[name]: type === "number" ? parseFloat(value) : value,
			});
		}
	};

	const handleProductChange = (e: React.ChangeEvent<{ value: unknown }>) => {
		setSelectedProductId(e.target.value as string);
	};

	const handleAddProduct = () => {
		if (selectedProductId) {
			const selectedProduct = availableProducts?.find(
				(p) => p.id === selectedProductId
			);

			if (selectedProduct) {
				// Adiciona ao array temporário
				const updatedProducts = [...productList, selectedProduct.name];
				setProductList(updatedProducts);

				// Atualiza o formData com a string de produtos separados por vírgula
				setFormData({
					...formData,
					products: updatedProducts.join(", "),
				});

				setSelectedProductId("");
			}
		}
	};

	const handleRemoveProduct = (index: number) => {
		// Remove do array temporário
		const updatedProducts = [...productList];
		updatedProducts.splice(index, 1);
		setProductList(updatedProducts);

		// Atualiza o formData com a string atualizada
		setFormData({
			...formData,
			products: updatedProducts.join(", "),
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>{item ? "Edit Order" : "Add New Order"}</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								name="date"
								label="Order Date"
								type="date"
								value={
									formData.date instanceof Date
										? formData.date.toISOString().split("T")[0]
										: new Date(formData.date).toISOString().split("T")[0]
								}
								onChange={handleChange}
								fullWidth
								InputLabelProps={{
									shrink: true,
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h6">Products</Typography>
						</Grid>
						<Grid item xs={8}>
							<FormControl fullWidth>
								<InputLabel id="product-select-label">
									Select Product
								</InputLabel>
								<Select
									labelId="product-select-label"
									id="product-select"
									value={selectedProductId}
									onChange={handleProductChange}
									label="Select Product"
									disabled={loading}
								>
									{availableProducts?.map((product) => (
										<MenuItem key={product.id} value={product.id}>
											{product.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={4}>
							<Button
								variant="contained"
								color="primary"
								onClick={handleAddProduct}
								fullWidth
								disabled={!selectedProductId || loading}
							>
								Add Product
							</Button>
						</Grid>
						<Grid item xs={12}>
							{productList.length > 0 ? (
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
									{productList.map((product, index) => (
										<Chip
											key={index}
											label={product}
											onDelete={() => handleRemoveProduct(index)}
											color="primary"
											variant="outlined"
										/>
									))}
								</Box>
							) : (
								<Typography
									variant="body2"
									color="textSecondary"
									sx={{ mt: 2 }}
								>
									No products added yet
								</Typography>
							)}
						</Grid>
						<Grid item xs={12}>
							<TextField
								name="total"
								label="Total"
								type="number"
								value={formData.total}
								onChange={handleChange}
								fullWidth
								inputProps={{ min: 0, step: 0.01 }}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="primary">
						Cancel
					</Button>
					<Button
						type="submit"
						color="primary"
						variant="contained"
						disabled={productList.length === 0 || formData.total <= 0}
					>
						{item ? "Update" : "Create"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default OrderForm;
