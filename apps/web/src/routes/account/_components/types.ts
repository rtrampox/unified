type NavMainProps = {
	items: {
		title: string;
		url: string;
		// this should be `Component` after lucide-svelte updates types
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		icon?: any;
		isActive?: boolean;
		isCollapsible?: boolean;
		items?: {
			title: string;
			url: string;
		}[];
	}[];
};
