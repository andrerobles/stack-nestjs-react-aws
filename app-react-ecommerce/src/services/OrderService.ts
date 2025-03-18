import axios from "axios";
import { Order, OrderSchema } from "../models/Order";
import { convertProductsToString } from "../models/Product";

const API_URL = import.meta.env.REACT_APP_API_URL || "http://localhost:3000";

const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

export const OrderService = {
	getAll: async (): Promise<Order[] | undefined> => {
		try {
			const response = await api.get("/orders");

			if (response.data) {
				const orderResponse: OrderSchema[] = response.data;
				// Adapta retorno para o padrão
				return orderResponse.map((order: OrderSchema) => ({
					id: order._id,
					date: order.date,
					products: convertProductsToString(order.productIds),
					total: order.total,
				}));
			}
		} catch (error) {
			console.error("Failed to fetch orders:", error);
			throw error;
		}
	},

	// O método getById também deve formatar o resultado
	getById: async (id: string): Promise<Order | undefined> => {
		try {
			const response = await api.get(`/orders/${id}`);
			if (response.data) {
				if (response.data) {
					const orderResponse: OrderSchema = response.data;
					return {
						id: orderResponse._id,
						date: orderResponse.date,
						products: convertProductsToString(orderResponse.productIds),
						total: orderResponse.total,
					};
				}
			}
		} catch (error) {
			if (axios.isAxiosError(error) && error.response?.status === 404) {
				return undefined;
			}
			console.error(`Failed to fetch order with id ${id}:`, error);
			throw error;
		}
	},

	create: async (order: Omit<Order, "id">): Promise<Order | undefined> => {
		try {
			const response = await api.post("/product", {
				date: order.date,
				productIds: order.products,
				total: order.total,
			});
			if (response.data) {
				const orderSchema: OrderSchema = response.data;
				return {
					id: orderSchema._id,
					date: orderSchema.date,
					products: convertProductsToString(orderSchema.productIds),
					total: orderSchema.total,
				};
			}
		} catch (error) {
			console.error("Failed to create order:", error);
			throw error;
		}
	},

	update: async (
		id: string,
		order: Partial<OrderSchema>
	): Promise<Order | undefined> => {
		try {
			const response = await api.patch(`/orders/${id}`, {
				date: order.date,
				productIds: order.productIds,
				total: order.total,
			});

			if (response.data) {
				const orderResponse: OrderSchema = response.data;
				return {
					id: orderResponse._id,
					date: orderResponse.date,
					products: convertProductsToString(orderResponse.productIds),
					total: orderResponse.total,
				};
			}
		} catch (error) {
			console.error(`Failed to update order with id ${id}:`, error);
			throw error;
		}
	},

	delete: async (id: string): Promise<boolean> => {
		try {
			await api.delete(`/orders/${id}`);
			return true;
		} catch (error) {
			console.error(`Failed to delete order with id ${id}:`, error);
			throw error;
		}
	},
};
