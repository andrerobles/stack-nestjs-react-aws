import { SNS } from "aws-sdk";
import { Order } from "../models/order.model";

const sns = new SNS();
const ORDER_TOPIC_ARN = process.env.ORDER_TOPIC_ARN || "";

export const sendOrderNotification = async (
	order: Order,
	message?: string
): Promise<void> => {
	try {
		const params = {
			TopicArn: ORDER_TOPIC_ARN,
			Message: JSON.stringify({
				orderId: order.id,
				total: order.total,
				date: order.date,
				message:
					message ||
					`Novo pedido criado: #${order.id} no valor de $${order.total}`,
			}),
			Subject: `Novo Pedido #${order.id}`,
			MessageAttributes: {
				OrderId: {
					DataType: "String",
					StringValue: order.id,
				},
				OrderTotal: {
					DataType: "Number",
					StringValue: order.total.toString(),
				},
			},
		};

		await sns.publish(params).promise();
		console.log(`Notification sent for order #${order.id}`);
	} catch (error) {
		console.error(`Error sending notification for order #${order.id}:`, error);
		throw error;
	}
};
