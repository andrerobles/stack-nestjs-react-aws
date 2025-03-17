import { APIGatewayProxyHandler } from "aws-lambda";
import { Order, OrderReport } from "../models/order.model";
import { formatResponse, handleError } from "../utils/helpers";
import { getAllOrders } from "../utils/api";

export const handler: APIGatewayProxyHandler = async () => {
	try {
		console.log("Processing sales report...");

		// Obter todos os pedidos da API
		const orders: Order[] = await getAllOrders();

		// Processar os dados para o relatório
		const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
		const orderCount = orders.length;
		const averageOrderValue = orderCount > 0 ? totalSales / orderCount : 0;

		// Criar objeto de relatório
		const report: OrderReport = {
			totalSales,
			orderCount,
			averageOrderValue,
			generatedAt: new Date().toISOString(),
		};

		console.log(
			`Report generated: ${orderCount} orders, total sales: $${totalSales}`
		);

		// Retornar o resultado formatado usando o helper
		return formatResponse(200, {
			message: "Report processed successfully",
			data: report,
		});
	} catch (error) {
		console.error("Error processing report:", error);
		return handleError(error);
	}
};
