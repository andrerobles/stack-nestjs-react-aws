import { SQSEvent } from "aws-lambda";
import { Order } from "../models/order.model";
import { formatResponse, handleError } from "../utils/helpers";
import { sendOrderNotification } from "../utils/sns";

export const handler = async (event: SQSEvent) => {
	try {
		console.log(`Processing ${event.Records.length} order notifications`);

		const results = [];

		for (const record of event.Records) {
			const orderData = JSON.parse(record.body) as Order;
			console.log(`Processing notification for order #${orderData.id}`);

			try {
				await sendOrderNotification(orderData);

				results.push({
					orderId: orderData.id,
					status: "success",
				});
			} catch (recordError: any) {
				console.error(`Error processing order #${orderData.id}:`, recordError);
				results.push({
					orderId: orderData.id,
					status: "error",
					error: recordError.message,
				});
			}
		}

		console.log("All notifications processed");
		return formatResponse(200, {
			message: "Notifications processed",
			results,
		});
	} catch (error) {
		console.error("Error processing order notifications:", error);
		return handleError(error);
	}
};
