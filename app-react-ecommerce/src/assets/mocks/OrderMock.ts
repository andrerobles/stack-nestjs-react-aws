import { Order } from "../../models/Order";

// Função auxiliar para criar uma data específica
const createDate = (year: number, month: number, day: number): Date => {
	return new Date(year, month - 1, day);
};

export const mockOrders: Order[] = [
	{
		id: 1,
		date: createDate(2023, 5, 15),
		products: ["Smartphone XYZ", "Laptop Pro", "Wireless Headphones"],
		total: 2499.97,
	},
	{
		id: 2,
		date: createDate(2023, 5, 20),
		products: ["Smart TV 4K", "Bluetooth Speaker"],
		total: 1299.98,
	},
	{
		id: 3,
		date: createDate(2023, 6, 1),
		products: ["Gaming Console"],
		total: 499.99,
	},
	{
		id: 4,
		date: createDate(2023, 6, 5),
		products: ["Wireless Headphones", "Fitness Tracker"],
		total: 349.98,
	},
	{
		id: 5,
		date: createDate(2023, 6, 10),
		products: ["Laptop Pro", "Smart TV 4K", "Fitness Tracker"],
		total: 2599.97,
	},
	{
		id: 6,
		date: createDate(2023, 6, 15),
		products: ["Bluetooth Speaker"],
		total: 129.99,
	},
	{
		id: 7,
		date: createDate(2023, 6, 20),
		products: ["Smartphone XYZ", "Bluetooth Speaker"],
		total: 1129.98,
	},
	{
		id: 8,
		date: createDate(2023, 6, 25),
		products: ["Wireless Headphones", "Smart TV 4K", "Bluetooth Speaker"],
		total: 1599.97,
	},
	{
		id: 9,
		date: createDate(2023, 7, 1),
		products: ["Laptop Pro", "Fitness Tracker"],
		total: 1849.98,
	},
	{
		id: 10,
		date: createDate(2023, 7, 5),
		products: [
			"Smartphone XYZ",
			"Laptop Pro",
			"Wireless Headphones",
			"Smart TV 4K",
		],
		total: 3799.96,
	},
];
