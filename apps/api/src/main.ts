import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { VersioningType } from "@nestjs/common";
import { bootstrapSwagger } from "./lib/config/swagger";
import cookieParser from "cookie-parser";
import * as Sentry from "@sentry/nestjs";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: "1",
	});

	app.enableCors({
		allowedHeaders: ["Content-Type", "Authorization"],
		origin: ["http://localhost:5173", "http://10.1.1.9:5173", "https://jwt.io"],
		credentials: true,
		maxAge: 86400,
	});

	bootstrapSwagger(app);

	app.use(cookieParser());

	if (!process.env.SENTRY_DSN) {
		console.error("Sentry DSN is not set, skipping Sentry initialization");
	}
	Sentry.init({
		dsn: process.env.API_SENTRY_DSN,
		serverName: process.env.API_SENTRY_SERVER_NAME,
		release: process.env.API_SENTRY_RELEASE,
	});

	await app.listen(process.env.API_PORT ?? 3000);
}
bootstrap();
