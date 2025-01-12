import { writable } from "svelte/store";

export const tabs = {
	"/account": "Home",
	"/account/apps": "Allowed apps and services",
	"/account/security": "Security",
	"/account/personal": "Personal information",
};

export type Tabs = keyof typeof tabs;

export const activeTab = writable<Tabs | string>("/account");
