export function getKebabCaseFromNormalCase(text: string): string {
	return text
		.replaceAll(/\s+/g, '-') // Replace spaces with hyphens
		.toLowerCase(); // Convert to lowercase
}
