import { NewEventEmail } from "~/modules/events.server";

export default function Test() {
	return (
		<NewEventEmail
			event={{
				name: "event.name",
				infoUrl: "event.infoUrl",
				startDate: "",
				endDate: "",
				locationId: "event.locationId",
				locationName: "locationName",
				organizerName: "organizerName",
				organizerId: "event.organizerId",
				goggleMapsUrl: "locationGoogleMapsUrl",
				sbk: "sbk",
			}}
		/>
	);
}
