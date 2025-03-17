export interface Order {
	id: string;
	total: number;
	date: string;
	customerId?: string;
	items?: OrderItem[];
	status?: string;
}

export interface OrderItem {
	id: string;
	productId: string;
	quantity: number;
	price: number;
}

export interface OrderReport {
	totalSales: number;
	orderCount: number;
	averageOrderValue: number;
	generatedAt: string;
}
