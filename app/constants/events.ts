export type City = "Valencia";
export const cities: City[] = ["Valencia"];

export interface Event {
	url: string;
	name: string;
	organizer: string;
	startDate: Date;
	endDate: Date;
	city: City;
	location: string;
	locationUrl: string;
	salsaPercentage: number;
	bachataPercentage: number;
	kizombaPercentage: number;
}

export interface EventDay {
	date: Date;
	events: Event[];
}

export const events: Event[] = [
	{
		url: "https://www.facebook.com/photo?fbid=10234030217327462&set=a.2201661251525",
		name: "Kizombera - special night",
		organizer: "Maguana",
		startDate: new Date("2024-11-22T21:00:00Z"),
		endDate: new Date("2024-11-23T03:00:00Z"),
		city: "Valencia",
		location: "Maguana Club",
		locationUrl: "https://maps.app.goo.gl/XXm2ZBqddqz78xo9A",
		salsaPercentage: 0,
		bachataPercentage: 0,
		kizombaPercentage: 100,
	},
	{
		url: "https://www.facebook.com/photo?fbid=10234030217327462&set=a.2201661251525",
		name: "Juernes night",
		organizer: "Asucar",
		startDate: new Date("2024-11-21T22:00:00Z"),
		endDate: new Date("2024-11-22T00:00:00Z"),
		city: "Valencia",
		location: "Asucar",
		locationUrl: "https://maps.app.goo.gl/mtek962hcDLDoKb49",
		salsaPercentage: 50,
		bachataPercentage: 50,
		kizombaPercentage: 0,
	},
	{
		url: "https://chat.whatsapp.com/CxHE71Fq0whE7d6oe8KfzT",
		name: "Street bachata en el río",
		organizer: "Dame",
		startDate: new Date("2024-11-22T18:30:00Z"),
		endDate: new Date("2024-11-22T20:30"),
		city: "Valencia",
		location: "Estación Alameda",
		locationUrl: "https://maps.app.goo.gl/BXsspRbZkqjwAyPi8",
		salsaPercentage: 0,
		bachataPercentage: 100,
		kizombaPercentage: 0,
	},
	{
		url: "https://chat.whatsapp.com/CxHE71Fq0whE7d6oe8KfzT",
		name: "Miércoles de juerga",
		organizer: "Dame",
		startDate: new Date("2024-11-20T19:30:00Z"),
		endDate: new Date("2024-11-21T00:30"),
		city: "Valencia",
		location: "Guarapo",
		locationUrl: "https://maps.app.goo.gl/xEsdFBst7exPraiw8",
		salsaPercentage: 80,
		bachataPercentage: 20,
		kizombaPercentage: 0,
	},
	{
		url: "https://chat.whatsapp.com/CxHE71Fq0whE7d6oe8KfzT",
		name: "Domingo de salsa cubana",
		organizer: "Dame",
		startDate: new Date("2024-11-24T11:00:00Z"),
		endDate: new Date("2024-11-24T13:00Z"),
		city: "Valencia",
		location: "Estación Alameda",
		locationUrl: "https://maps.app.goo.gl/BXsspRbZkqjwAyPi8",
		salsaPercentage: 100,
		bachataPercentage: 0,
		kizombaPercentage: 0,
	},
	{
		url: "https://www.facebook.com/photo?fbid=9241266345897376&set=gm.3800887160164353",
		name: "Somos solidarios",
		organizer: "Varios",
		startDate: new Date("2024-12-01T16:30:00Z"),
		endDate: new Date("2024-12-01T21:30"),
		city: "Valencia",
		location: "Bailósophy",
		locationUrl: "https://maps.app.goo.gl/NjNtXPj8AAyiJfbQ6",
		salsaPercentage: 50,
		bachataPercentage: 50,
		kizombaPercentage: 0,
	},
	{
		url: "https://www.facebook.com/photo/?fbid=9093980540652034&set=p.9093980540652034",
		name: "Bachata lovers party",
		organizer: "Supersalseros",
		startDate: new Date("2024-11-24T20:00:00Z"),
		endDate: new Date("2024-11-25T00:00Z"),
		city: "Valencia",
		location: "Moon",
		locationUrl: "https://maps.app.goo.gl/32UhxCW1brN2D2HaA",
		salsaPercentage: 40,
		bachataPercentage: 60,
		kizombaPercentage: 0,
	},
	{
		url: "https://nochesdebohemia.es/event/sabados-salsa-bachata-valencia/",
		name: "Sábados de salsa y bachata",
		organizer: "Noches de Bohemia",
		startDate: new Date("2024-11-23T22:00:00Z"),
		endDate: new Date("2024-11-24T02:00Z"),
		city: "Valencia",
		location: "Noches de Bohemia",
		locationUrl: "https://maps.app.goo.gl/9o7Md3zzshtf81Dk7",
		salsaPercentage: 40,
		bachataPercentage: 60,
		kizombaPercentage: 0,
	},
];
