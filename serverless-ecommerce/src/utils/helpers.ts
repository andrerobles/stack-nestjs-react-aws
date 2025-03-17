export const formatResponse = (statusCode: number, body: any) => {
	return {
		statusCode,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Credentials": true,
		},
		body: JSON.stringify(body),
	};
};

export const handleError = (error: any) => {
	return formatResponse(500, {
		message: "Internal server error",
		error: error.message,
	});
};
