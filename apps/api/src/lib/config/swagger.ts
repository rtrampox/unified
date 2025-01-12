import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, type SwaggerDocumentOptions, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import { patchNestJsSwagger } from "nestjs-zod";
import * as fs from "node:fs";
import * as path from "node:path";

export const bootstrapSwagger = (app: INestApplication) => {
	patchNestJsSwagger();

	const config = new DocumentBuilder()
		.setTitle("Unified API")
		.setDescription("The Unified API description")
		.setVersion("1.0")
		.addTag("Unified API")
		.addCookieAuth("ssid")
		.addBearerAuth()
		.build();

	const options: SwaggerDocumentOptions = {
		operationIdFactory: (_: string, methodKey: string) => methodKey,
	};

	const documentFactory = () => SwaggerModule.createDocument(app, config, options);

	fs.writeFileSync(path.resolve(path.join("..", "swagger.json")), JSON.stringify(documentFactory(), null, 2));

	if (!process.env.DISABLE_SWAGGER && process.env.DISABLE_SWAGGER !== "true") {
		SwaggerModule.setup("swagger", app, documentFactory, {
			jsonDocumentUrl: "swagger/json",
		});
		app.use("/scalar", apiReference({ spec: { content: documentFactory() } }));
	}
};
