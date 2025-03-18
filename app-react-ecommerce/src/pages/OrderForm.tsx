import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Grid,
	Typography,
	Chip,
	Box,
} from "@mui/material";
import { Order } from "../models/Order";

interface OrderFormProps {
	open: boolean;
	item: Order | null;
	onClose: () => void;
	onSubmit: (order: Order) => Promise<void>;
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
		products: "", // Agora é uma string
		total: 0,
	});

	const [newProduct, setNewProduct] = useState("");
	// Array temporário para gerenciar os produtos na interface
	const [productList, setProductList] = useState<string[]>([]);

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

	const handleAddProduct = () => {
		if (newProduct.trim()) {
			// Adiciona ao array temporário
			const updatedProducts = [...productList, newProduct.trim()];
			setProductList(updatedProducts);

			// Atualiza o formData com a string de produtos separados por vírgula
			setFormData({
				...formData,
				products: updatedProducts.join(", "),
			});

			setNewProduct("");
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
								// Comentário em português: Data do pedido
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="h6">Products</Typography>
						</Grid>
						<Grid item xs={8}>
							<TextField
								label="Product Name"
								value={newProduct}
								onChange={(e) => setNewProduct(e.target.value)}
								fullWidth
							/>
						</Grid>
						<Grid item xs={4}>
							<Button
								variant="contained"
								color="primary"
								onClick={handleAddProduct}
								fullWidth
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
						<Grid item xs={12} sx={{ mt: 2 }}>
							<TextField
								name="total"
								label="Total"
								type="number"
								value={formData.total}
								onChange={handleChange}
								fullWidth
								inputProps={{ min: 0, step: 0.01 }}
								// Comentário em português: Total do pedido
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
