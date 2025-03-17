import axios from "axios";
import { Order } from "../models/order.model";

const API_URL = process.env.API_URL || "http://localhost:3000";
const API_KEY = process.env.API_KEY;

const apiClient = axios.create({
	baseURL: API_URL,
	headers: API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {},
});

export const getAllOrders = async (): Promise<Order[]> => {
	try {
		const response = await apiClient.get("/orders");
		return response.data;
	} catch (error) {
		console.error("Error fetching all orders:", error);
		throw error;
	}
};

export const getOrderDetails = async (orderId: string): Promise<Order> => {
	try {
		const response = await apiClient.get(`/orders/${orderId}`);
		return response.data;
	} catch (error) {
		console.error(`Error fetching order details for ID ${orderId}:`, error);
		throw error;
	}
};
