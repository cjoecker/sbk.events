import { ClockIcon, SewingPinIcon } from "@radix-ui/react-icons";
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useHydrated } from "remix-utils/use-hydrated";

import { getEventsByDay } from "~/modules/events.server";

export async function loader() {
	const eventDays = await getEventsByDay("Valencia");
	return { eventDays };
}

const containerAnimationVariants = {
	visible: {
		transition: {
			staggerChildren: 0.2,
		},
	},
};
const childAnimationVariants = {
	hidden: { opacity: 0, x: -20 },
	visible: {
		opacity: 1,
		x: 0,
		transition: { duration: 0.7, ease: "easeOut" },
	},
};

export default function Events() {
	const { eventDays } = useLoaderData<typeof loader>();

	const isHydrated = useHydrated();

	return (
		<>
			<div className="flex w-full justify-between">
				<Title />
				<h2 className="my-auto mr-4 flex text-xl">
					<SewingPinIcon className="mr-0.5 mt-1.5" />
					Valencia
				</h2>
			</div>
			{isHydrated && (
				<motion.ul
					className="flex flex-col gap-y-2 p-2 pl-3"
					initial="hidden"
					animate="visible"
					variants={containerAnimationVariants}
					viewport={{ once: true, amount: 0.3 }}
				>
					{eventDays.map((eventDay, index) => {
						const dayBefore =
							index > 0 ? new Date(eventDays[index - 1].date) : null;
						const isNextMonth =
							(dayBefore &&
								dayBefore.getMonth() !== new Date(eventDay.date).getMonth()) ||
							index === 0;

						return (
							<motion.li key={eventDay.date} variants={childAnimationVariants}>
								{isNextMonth && <MonthName date={eventDay.date} />}
								<EventDayItem
									key={eventDay.date}
									date={eventDay.date}
									events={eventDay.events}
								/>
							</motion.li>
						);
					})}
				</motion.ul>
			)}
		</>
	);
}

export const Title = () => {
	const { t } = useTranslation();
	const ariaLabel = t("pageTitle");
	const socials = t("socials");
	const socialsArray = [...socials];
	const sbk = t("salsaBachataKizomba");
	const sbkArray = sbk.split(" ");
	return (
		<h1 className="flex w-48 flex-col font-bold" aria-label={ariaLabel}>
			<span className="flex w-full justify-between text-4xl uppercase">
				{socialsArray.map((letter, index) => {
					return (
						<span key={index} className="inline-block">
							{letter}
						</span>
					);
				})}
			</span>
			<span className="-mt-2 flex justify-between">
				{sbkArray.map((word, index) => {
					return (
						<span key={index} className="inline-block">
							{word}
						</span>
					);
				})}
			</span>
		</h1>
	);
};

export interface MonthNameProps {
	date: string;
}

export const MonthName = ({ date }: MonthNameProps) => {
	const month = format(date, "MMMM");
	return (
		<h3 className="-ml-2 mb-1 mt-3 text-xl font-bold capitalize">{month}</h3>
	);
};

export interface EventDayItemProps {
	date: string;
	events: EventItemProps[];
}

export const EventDayItem = ({ events, date }: EventDayItemProps) => {
	const weekday = format(date, "EEE");
	const day = format(date, "d");
	const isToday = new Date(date).toDateString() === new Date().toDateString();
	const todayTextColor = isToday ? "text-orange-200" : "text-white";
	return (
		<div className="flex w-full rounded border border-gray-400">
			<div className="glass-s-grey w-14 rounded-l pt-1 text-center">
				<div className={`text-md ${todayTextColor} capitalize`}>{weekday}</div>
				<div className={`-mt-1 text-3xl ${todayTextColor}`}>{day}</div>
			</div>
			<div className="glass-s-black flex flex-1 flex-col gap-y-3 rounded-r p-2">
				{events.map((event) => {
					const isLast = events.indexOf(event) === events.length - 1;
					return (
						<Fragment key={event.name}>
							<EventItem
								name={event.name}
								infoUrl={event.infoUrl}
								organizer={event.organizer}
								startDate={event.startDate}
								endDate={event.endDate}
								location={event.location}
								salsaPercentage={event.salsaPercentage}
								bachataPercentage={event.bachataPercentage}
								kizombaPercentage={event.kizombaPercentage}
							/>
							{!isLast && <Separator />}
						</Fragment>
					);
				})}
			</div>
		</div>
	);
};

interface EventItemProps {
	infoUrl: string;
	name: string;
	organizer: {
		name: string;
		website: string;
	};
	startDate: string;
	endDate: string;
	location: {
		name: string;
		googleMapsUrl: string;
	};
	salsaPercentage: number;
	bachataPercentage: number;
	kizombaPercentage: number;
}

export const EventItem = ({
	infoUrl,
	name,

	organizer,
	startDate,
	endDate,
	location,
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
				<a
					href={infoUrl}
					className="underline decoration-1 hover:text-gray-300"
				>
					{name}
				</a>
			</h3>
			<div className="-mt-0.5 flex flex-1 flex-wrap gap-x-4 leading-snug text-gray-200">
				<div>{organizer.name}</div>
				<div className="flex">
					<ClockIcon className="my-auto mr-1" />
					{startTime} – {endTime}
				</div>
				<a
					href={location.googleMapsUrl}
					className="flex underline decoration-1 hover:text-gray-300"
				>
					<SewingPinIcon className="-mx-0.5 my-auto" />
					{location.name}
				</a>
				<div>SBK {sbk}</div>
			</div>
		</div>
	);
};

export const Separator = () => {
	return <span className="h-[1px] w-full bg-gray-500" />;
};
