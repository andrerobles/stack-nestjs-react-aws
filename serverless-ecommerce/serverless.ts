import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
	service: "api-nestjs-ecommerce-async",

	frameworkVersion: "3",

	plugins: [
		"serverless-dotenv-plugin",
		"serverless-plugin-typescript",
		"serverless-offline",
	],

	provider: {
		name: "aws",
		runtime: "nodejs20.x",
		region: "us-east-1",
		stage: '${opt:stage, "dev"}',
		environment: {
			NODE_ENV: '${opt:stage, "dev"}',
			MONGODB_URI:
				'${env:MONGODB_URI, "mongodb://root:password@localhost:27017/ecommerce?authSource=admin"}',
			ORDER_TOPIC_ARN: { Ref: "OrderTopic" },
		},
	},

	custom: {
		serverlessPluginTypescript: {
			tsConfigFileLocation: "./tsconfig.json",
		},
		"serverless-offline": {
			httpPort: 4000,
		},
		dotenv: {
			include: [
				"NODE_ENV",
				"MONGODB_URI",
				"AWS_REGION",
				"ORDER_TOPIC_ARN",
				"ORDER_QUEUE_URL",
			],
		},
	},

	package: {
		individually: true,
		patterns: [
			"!node_modules/.prisma/client/libquery_engine-*",
			"!node_modules/prisma/libquery_engine-*",
			"!node_modules/@prisma/engines/**",
			"node_modules/.prisma/client/schema.prisma",
		],
	},

	functions: {
		processOrderReports: {
			handler: "src/functions/process-reports.handler",
			events: [
				{
					schedule: {
						rate: ["rate(1 day)"],
						enabled: true,
					},
				},
			],
			timeout: 30,
			memorySize: 256,
		},

		orderNotifications: {
			handler: "src/functions/order-notifications.handler",
			events: [
				{
					sqs: {
						arn: { "Fn::GetAtt": ["OrderQueue", "Arn"] },
						batchSize: 10,
					},
				},
			],
			timeout: 30,
			memorySize: 256,
		},
	},

	resources: {
		Resources: {
			OrderQueue: {
				Type: "AWS::SQS::Queue",
				Properties: {
					QueueName: "${self:service}-${self:provider.stage}-order-queue",
					VisibilityTimeout: 60,
					MessageRetentionPeriod: 1209600, // 14 days
				},
			},

			OrderTopic: {
				Type: "AWS::SNS::Topic",
				Properties: {
					TopicName:
						"${self:service}-${self:provider.stage}-order-notifications",
				},
			},

			OrderQueuePolicy: {
				Type: "AWS::SQS::QueuePolicy",
				Properties: {
					PolicyDocument: {
						Version: "2012-10-17",
						Statement: [
							{
								Effect: "Allow",
								Principal: "*",
								Action: "sqs:*",
								Resource: { "Fn::GetAtt": ["OrderQueue", "Arn"] },
							},
						],
					},
					Queues: [{ Ref: "OrderQueue" }],
				},
			},
		},
	},
};

module.exports = serverlessConfiguration;
