// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Session } from "@/server/session";

// for information about these interfaces
declare global {
	// biome-ignore lint/style/noNamespace: <explanation>
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
