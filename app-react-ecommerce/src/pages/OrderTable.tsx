import React from "react";
import {
	Box,
	IconButton,
	Collapse,
	Typography,
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import {
	KeyboardArrowDown as KeyboardArrowDownIcon,
	KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import OrderForm from "./OrderForm";
import { Order, ProductName } from "../models/Order";
import GenericTable, { Column } from "../components/GenericTable";
import { OrderService } from "../services/OrderService";

// Componente para linha expansível
const ExpandableRow = ({
	item,
	value,
}: {
	item: Order;
	value: ProductName[];
}) => {
	const [open, setOpen] = React.useState(false);

	return (
		<Box>
			<Box display="flex" alignItems="center">
				<IconButton size="small" onClick={() => setOpen(!open)}>
					{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
				<span>{value.length} items</span>
			</Box>
			<Collapse in={open} timeout="auto" unmountOnExit>
				<Box sx={{ margin: 1 }}>
					<Typography variant="h6" gutterBottom component="div">
						Products
					</Typography>
					<List dense>
						{value.map((productName, index) => (
							<ListItem key={index}>
								<ListItemText primary={productName} />
							</ListItem>
						))}
					</List>
				</Box>
			</Collapse>
		</Box>
	);
};

const OrderTable: React.FC = () => {
	// Definição das colunas para a tabela de pedidos
	const columns: Column<Order>[] = [
		{ id: "id", label: "ID", minWidth: 50 },
		{
			id: "date",
			label: "Date",
			minWidth: 120,
			format: (value) => new Date(value).toLocaleDateString(),
		},
		{
			id: "products",
			label: "Products",
			minWidth: 200,
			format: (value, item) => <ExpandableRow item={item} value={value} />,
		},
		{
			id: "total",
			label: "Total",
			minWidth: 100,
			format: (value) => `$${value.toFixed(2)}`,
		},
		{ id: "actions", label: "Actions", minWidth: 100, align: "center" },
	];

	return (
		<GenericTable<Order>
			title="Orders"
			fetchItems={OrderService.getAll}
			columns={columns}
			addItem={async (order) => {
				const { id, ...orderWithoutId } = order;
				await OrderService.create(orderWithoutId);
			}}
			updateItem={OrderService.update}
			deleteItem={OrderService.delete}
			getItemId={(order) => order.id}
			FormComponent={OrderForm}
		/>
	);
};

export default OrderTable;
