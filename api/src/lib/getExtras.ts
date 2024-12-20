export function getExtras(provided: string[], expected: string[]): string[] {
	const extra: string[] = [];
	for (const item of provided) {
		if (!expected.includes(item)) {
			extra.push(item);
		}
	}

	return extra;
}
