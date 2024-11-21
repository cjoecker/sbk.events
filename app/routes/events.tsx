import { ClockIcon, SewingPinIcon } from "@radix-ui/react-icons";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { Fragment } from "react";

import { getEventsByDay } from "~/modules/events.server";

export function loader() {
	const eventDays = getEventsByDay();
	return { eventDays };
}

export default function Events() {
	const { eventDays } = useLoaderData<typeof loader>();
	return (
		<div>
			<div className="flex w-full justify-between">
				<h1 className="flex w-48 flex-col font-bold">
					<span className="text-4xl">Sociales</span>
					<span className="-mt-2">Salsa Bachata Kizomba</span>
				</h1>
				<h2 className="my-auto mr-4 flex text-xl">
					<SewingPinIcon className="mr-0.5 mt-1.5" />
					Valencia
				</h2>
			</div>
			<div className="flex flex-col gap-y-2 p-2 pl-3">
				{eventDays.map((eventDay, index) => {
					const dayBefore =
						index > 0 ? new Date(eventDays[index - 1].date) : null;
					const isNextMonth =
						(dayBefore &&
							dayBefore.getMonth() !== new Date(eventDay.date).getMonth()) ||
						index === 0;

					return (
						<Fragment key={eventDay.date}>
							{isNextMonth && <MonthName date={new Date(eventDay.date)} />}
							<EventDayItem
								key={eventDay.date}
								date={new Date(eventDay.date)}
								events={eventDay.events}
							/>
						</Fragment>
					);
				})}
			</div>
		</div>
	);
}

export interface MonthNameProps {
	date: Date;
}
export const MonthName = ({ date }: MonthNameProps) => {
	const month = format(date, "MMMM");
	return <h3 className="-mb-1 -ml-2 mt-2 text-xl font-bold">{month}</h3>;
};

export interface EventDayItemProps {
	date: Date;
	events: EventItemProps[];
}

export const EventDayItem = ({ events, date }: EventDayItemProps) => {
	const weekday = format(date, "EEE");
	const day = format(date, "d");
	return (
		<div className="flex w-full rounded border border-gray-400">
			<div className="w-14 bg-gray-200 pt-1 text-center">
				<div className="text-md">{weekday}</div>
				<div className="-mt-1 text-3xl">{day}</div>
			</div>
			<div className="flex flex-1 flex-col gap-y-3 divide-y p-2">
				{events.map((event) => {
					return (
						<EventItem
							key={event.name}
							name={event.name}
							url={event.url}
							organizer={event.organizer}
							startDate={event.startDate}
							endDate={event.endDate}
							location={event.location}
							locationUrl={event.locationUrl}
							salsaPercentage={event.salsaPercentage}
							bachataPercentage={event.bachataPercentage}
							kizombaPercentage={event.kizombaPercentage}
						/>
					);
				})}
			</div>
		</div>
	);
};

interface EventItemProps {
	name: string;
	url: string;
	organizer: string;
	startDate: string;
	endDate: string;
	location: string;
	locationUrl: string;
	salsaPercentage: number;
	bachataPercentage: number;
	kizombaPercentage: number;
}

export const EventItem = ({
	name,
	url,
	organizer,
	startDate,
	endDate,
	location,
	locationUrl,
	salsaPercentage,
	bachataPercentage,
	kizombaPercentage,
}: EventItemProps) => {
	const startTime = format(startDate, "HH:mm");
	const endTime = format(endDate, "HH:mm");
	const sbk = `${salsaPercentage}-${bachataPercentage}-${kizombaPercentage}`;

	return (
		<div className="flex flex-col">
			<h3 className="flex-1 text-lg font-bold">
				<a href={url} className="hover:underline">
					{name}
				</a>
			</h3>
			<div className="flex flex-1 flex-wrap gap-x-4 leading-snug">
				<div>{organizer}</div>
				<div className="flex">
					<ClockIcon className="my-auto mr-1" />
					{startTime} – {endTime}
				</div>
				<a href={locationUrl} className="flex hover:underline">
					<SewingPinIcon className="-mx-0.5 my-auto" />
					{location}
				</a>
				<div>SBK {sbk}</div>
			</div>
		</div>
	);
};
