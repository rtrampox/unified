import { Global, Module } from "@nestjs/common";
import { JWTService } from "./jwt.service";

@Global()
@Module({
	providers: [JWTService],
	exports: [JWTService],
})
export class JWTModule {}
