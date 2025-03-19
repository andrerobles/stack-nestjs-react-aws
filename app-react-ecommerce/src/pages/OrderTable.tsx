import React from "react";
import OrderForm from "./OrderForm";
import { Order } from "../models/Order";
import GenericTable, { Column } from "../components/GenericTable";
import { OrderService } from "../services/OrderService";

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
			updateItem={async (order) => {
				await OrderService.update(order.id, order);
			}}
			deleteItem={OrderService.delete}
			getItemId={(order) => order.id}
			FormComponent={OrderForm}
		/>
	);
};

export default OrderTable;
