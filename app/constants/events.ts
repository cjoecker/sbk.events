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
		url: "https://www.facebook.com/photo/?fbid=1138966604250404&set=pcb.1138966644250400&locale=es_ES",
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
	{
		url: "https://fourvenues.com/cdn-cgi/imagedelivery/kWuoTchaMsk7Xnc_FNem7A/88184531-5ef0-45da-7e2f-3a26aa554d00/w=1350",
		name: "Bachata salsa party",
		organizer: "Bandido",
		startDate: new Date("2024-11-23T17:00:00Z"),
		endDate: new Date("2024-11-24T00:00Z"),
		city: "Valencia",
		location: "Bandido Valencia",
		locationUrl: "https://maps.app.goo.gl/Jw7SmcpTjiq2yUww8",
		salsaPercentage: 40,
		bachataPercentage: 60,
		kizombaPercentage: 0,
	},
	{
		url: "https://www.facebook.com/photo?fbid=936665365178371&set=a.454635450048034&locale=es_ES",
		name: "Noche Tropicana",
		organizer: "Tropicana",
		startDate: new Date("2024-11-23T22:00:00Z"),
		endDate: new Date("2024-11-24T03:00Z"),
		city: "Valencia",
		location: "Tropicana",
		locationUrl: "https://maps.app.goo.gl/8Ck46XkyitUpm8sx6",
		salsaPercentage: 60,
		bachataPercentage: 40,
		kizombaPercentage: 0,
	},
	{
		url: "https://www.facebook.com/photo/?fbid=2634991276686320&set=a.155490417969764",
		name: "Salsa bachata night",
		organizer: "Sala Vinilo",
		startDate: new Date("2024-11-22T22:15:00Z"),
		endDate: new Date("2024-11-23T02:00Z"),
		city: "Valencia",
		location: "Sala Vinilo",
		locationUrl: "https://maps.app.goo.gl/1nqKWwJ8nTTEfGEX6",
		salsaPercentage: 40,
		bachataPercentage: 60,
		kizombaPercentage: 0,
	},
	{
		url: "https://www.facebook.com/photo/?fbid=2632742850244496&set=a.155490417969764",
		name: "La reunión",
		organizer: "Noches de Bohemia",
		startDate: new Date("2024-11-30T22:00:00Z"),
		endDate: new Date("2024-12-01T02:00Z"),
		city: "Valencia",
		location: "Noches de Bohemia",
		locationUrl: "https://maps.app.goo.gl/9o7Md3zzshtf81Dk7",
		salsaPercentage: 40,
		bachataPercentage: 60,
		kizombaPercentage: 0,
	},
	{
		url: "https://www.instagram.com/galaxydance_vlc/profilecard/?igsh=Nnh2OXc3amlicm44",
		name: "Galaxy Dance",
		organizer: "Kevin y Lucia",
		startDate: new Date("2024-11-27T19:00:00Z"),
		endDate: new Date("2024-11-28T00:30Z"),
		city: "Valencia",
		location: "White House",
		locationUrl: "https://maps.app.goo.gl/9r4ZYJfDmfXFWNBY7",
		salsaPercentage: 80,
		bachataPercentage: 20,
		kizombaPercentage: 0,
	},
];
