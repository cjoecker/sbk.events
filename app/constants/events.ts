export type City = "Valencia"
export const cities: City[] = [
  "Valencia"];

export type Event = {
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
  price: number;
}

export type EventDay = {
  date: Date;
  events: Event[];
}

export const events: Event[] = [
  {
    url: "https://www.facebook.com/photo?fbid=10234030217327462&set=a.2201661251525",
    name: "Kizombera -special night",
    organizer: "Maguana",
    startDate: new Date("2024-11-22T22:00:00"),
    endDate: new Date("2024-11-23T04:00:00"),
    city: "Valencia",
    location: "Maguana Club",
    locationUrl: "https://g.co/kgs/v2Brsuj",
    salsaPercentage: 0,
    bachataPercentage: 0,
    kizombaPercentage: 100,
    price: 12
  },
  {
    url: "https://www.facebook.com/photo?fbid=10234030217327462&set=a.2201661251525",
    name: "Juernes night",
    organizer: "Asucar",
    startDate: new Date("2024-11-21T23:00:00"),
    endDate: new Date("2024-11-22T01:00:00"),
    city: "Valencia",
    location: "Asucar",
    locationUrl: "https://g.co/kgs/JNharuF",
    salsaPercentage: 50,
    bachataPercentage: 50,
    kizombaPercentage: 0,
    price: 6
  },
  {
    url: "https://chat.whatsapp.com/CxHE71Fq0whE7d6oe8KfzT",
    name: "Street bachata en el río",
    organizer: "Dame",
    startDate: new Date("2024-11-22T19:30:00"),
    endDate: new Date("2024-11-22T21:30"),
    city: "Valencia",
    location: "Estación Alameda",
    locationUrl: "https://maps.app.goo.gl/BXsspRbZkqjwAyPi8",
    salsaPercentage: 0,
    bachataPercentage: 100,
    kizombaPercentage: 0,
    price: 0
  },
  {
    url: "https://chat.whatsapp.com/CxHE71Fq0whE7d6oe8KfzT",
    name: "Miércoles de juerga",
    organizer: "Dame",
    startDate: new Date("2024-11-20T20:30:00"),
    endDate: new Date("2024-11-21T01:30"),
    city: "Valencia",
    location: "Guarapo",
    locationUrl: "https://maps.app.goo.gl/xEsdFBst7exPraiw8",
    salsaPercentage: 80,
    bachataPercentage: 20,
    kizombaPercentage: 0,
    price: 0
  },
  {
    url: "https://chat.whatsapp.com/CxHE71Fq0whE7d6oe8KfzT",
    name: "Domingo de salsa cubana",
    organizer: "Dame",
    startDate: new Date("2024-11-24T12:00:00"),
    endDate: new Date("2024-11-24T14:00"),
    city: "Valencia",
    location: "Estación Alameda",
    locationUrl: "https://maps.app.goo.gl/BXsspRbZkqjwAyPi8",
    salsaPercentage: 100,
    bachataPercentage: 0,
    kizombaPercentage: 0,
    price: 0
  },
  {
    url: "https://www.facebook.com/photo?fbid=9241266345897376&set=gm.3800887160164353",
    name: "Somos solidarios",
    organizer: "Varios",
    startDate: new Date("2024-12-01T17:30:00"),
    endDate: new Date("2024-12-01T22:30"),
    city: "Valencia",
    location: "Bailósophy",
    locationUrl: "https://g.co/kgs/hKTjEE2",
    salsaPercentage: 50,
    bachataPercentage: 50,
    kizombaPercentage: 0,
    price: 0
  },
  {
    url: "https://www.facebook.com/photo/?fbid=9093980540652034&set=p.9093980540652034",
    name: "Bachata lovers party",
    organizer: "Supersalseros",
    startDate: new Date("2024-11-24T21:00:00"),
    endDate: new Date("2024-11-25T01:00"),
    city: "Valencia",
    location: "Moon",
    locationUrl: "https://maps.app.goo.gl/32UhxCW1brN2D2HaA",
    salsaPercentage: 40,
    bachataPercentage: 60,
    kizombaPercentage: 0,
    price: 0
  }
];
