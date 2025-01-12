import { Global, Module } from "@nestjs/common";
import { TrustedDevicesService } from "./trusted-devices.service";

@Global()
@Module({
	providers: [TrustedDevicesService],
	exports: [TrustedDevicesService],
})
export class TrustedDevicesModule {}
