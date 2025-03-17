import { mockOrders } from "../assets/mocks/OrderMock";
import { Order } from "../models/Order";

export const OrderService = {
	getAll: (): Promise<Order[]> => {
		return Promise.resolve([...mockOrders]);
	},

	getById: (id: number): Promise<Order | undefined> => {
		const order = mockOrders.find((o) => o.id === id);
		return Promise.resolve(order);
	},

	create: (order: Omit<Order, "id">): Promise<Order> => {
		// Simulando geração de ID
		const newId = Math.max(...mockOrders.map((o) => o.id)) + 1;
		const newOrder = { ...order, id: newId };
		mockOrders.push(newOrder);

		// Ordenar pedidos por data (mais recentes primeiro)
		mockOrders.sort((a, b) => b.date.getTime() - a.date.getTime());

		return Promise.resolve(newOrder);
	},

	update: (order: Order): Promise<Order> => {
		const index = mockOrders.findIndex((o) => o.id === order.id);
		if (index !== -1) {
			mockOrders[index] = order;

			// Ordenar pedidos por data (mais recentes primeiro)
			mockOrders.sort((a, b) => b.date.getTime() - a.date.getTime());

			return Promise.resolve(order);
		}
		return Promise.reject(new Error("Order not found"));
	},

	delete: (id: number): Promise<boolean> => {
		const index = mockOrders.findIndex((o) => o.id === id);
		if (index !== -1) {
			mockOrders.splice(index, 1);
			return Promise.resolve(true);
		}
		return Promise.reject(new Error("Order not found"));
	},
};
