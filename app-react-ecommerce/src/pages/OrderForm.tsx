// src/components/order/OrderForm.tsx
import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Grid,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Typography,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
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
		id: 0,
		date: new Date(),
		products: [],
		total: 0,
	});

	const [newProduct, setNewProduct] = useState("");

	useEffect(() => {
		if (item) {
			setFormData(item);
		} else {
			setFormData({
				id: 0,
				date: new Date(),
				products: [],
				total: 0,
			});
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
			setFormData({
				...formData,
				products: [...formData.products, newProduct.trim()],
			});
			setNewProduct("");
		}
	};

	const handleRemoveProduct = (index: number) => {
		const updatedProducts = [...formData.products];
		updatedProducts.splice(index, 1);
		setFormData({
			...formData,
			products: updatedProducts,
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
								// Comentário em português: Nome do produto
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
							<List>
								{formData.products.map((product, index) => (
									<ListItem key={index}>
										<ListItemText primary={product} />
										<ListItemSecondaryAction>
											<IconButton
												edge="end"
												color="secondary"
												onClick={() => handleRemoveProduct(index)}
											>
												<DeleteIcon />
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
								))}
							</List>
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
						disabled={formData.products.length === 0 || formData.total <= 0}
					>
						{item ? "Update" : "Create"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};

export default OrderForm;
