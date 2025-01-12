import { Controller, Get, Post, Body, Patch, Param, UsePipes, Put } from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto";
import { ZodValidationPipe } from "nestjs-zod";
import { ApiResponse } from "@nestjs/swagger";
import { ClientOkResponse, ClientOkResponseWithSecret } from "./entities/client.entity";
import { ApiErrorResponses } from "src/lib/apiError.decorator";
import { ReqSession, Session } from "src/guards/auth/auth.decorator";

@Controller("clients")
@UsePipes(ZodValidationPipe)
export class ClientsController {
	constructor(private readonly clientsService: ClientsService) {}

	@Post()
	@ApiResponse({ status: 201, type: ClientOkResponseWithSecret })
	@ApiErrorResponses()
	createClient(@Body() body: CreateClientDto, @Session() session: ReqSession) {
		return this.clientsService.createClient(body, session);
	}

	@Get()
	@ApiResponse({ status: 200, type: [ClientOkResponse] })
	@ApiErrorResponses()
	findAll(@Session() session: ReqSession) {
		return this.clientsService.findAll(session);
	}

	@Put("secret/renew/:id")
	@ApiResponse({ status: 200, type: ClientOkResponseWithSecret })
	@ApiErrorResponses()
	renewSecret(@Param("id") id: string, @Session() session: ReqSession) {
		return this.clientsService.renewSecret(id, session);
	}

	@Put(":id")
	@ApiResponse({ status: 200, type: ClientOkResponse })
	@ApiErrorResponses()
	updateClient(@Body() updateClientDto: UpdateClientDto, @Param("id") id: string, @Session() session: ReqSession) {
		return this.clientsService.updateClient(id, updateClientDto, session);
	}

	@Put("switch/:id")
	@ApiResponse({ status: 200, type: ClientOkResponse })
	@ApiErrorResponses()
	switchClient(@Param("id") id: string, @Session() session: ReqSession) {
		return this.clientsService.switchClient(id, session);
	}
}
