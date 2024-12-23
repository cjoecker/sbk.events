export function getMetas(
	title = "Sociales y Clases de Bachata y Salsa Cerca de Ti",
	description = "Todos los sociales y las mejores clases de bachata y clases de salsa cerca de ti. ¡Deja de buscar en múltiples grupos y encuentra aquí el social de SBK para hoy con un solo clic!",
	keywords = "clases de bachata, clases de salsa, academias de baile cerca de mí, clases de baile cerca de mi, clases de bachata cerca de mi, academia baile cerca de mi, clase de baile cerca de mi, fiestas de salsa, fiestas de bachata"
) {
	return [
		{ charSet: "utf-8" },
		{ title: `${title} | sbk.events` },
		{ name: "description", content: description },
		{ name: "keywords", content: keywords },
		{
			name: "viewport",
			content:
				"width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
		},
		{
			name: "theme-color",
			content: "#000a1d",
		},
	];
}
