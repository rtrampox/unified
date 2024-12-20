import { Module } from "@nestjs/common";
import { MultifactorService } from "./multifactor.service";

@Module({
	providers: [MultifactorService],
	exports: [MultifactorService],
})
export class MultifactorModule {}
