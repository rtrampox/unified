import { env } from "$env/dynamic/private";

export const config = {
	apiUrl: process.env.NODE_ENV === "production" ? env.BASE_URL! : "http://10.1.1.17:3000",
};
