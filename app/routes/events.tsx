import { ActionFunctionArgs } from "@remix-run/node";
import { useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useDebounce } from "@uidotdev/usehooks";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
	Location03Icon,
	Clock01Icon,
	Location01Icon,
	FireIcon,
} from "hugeicons-react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHydrated } from "remix-utils/use-hydrated";

import { db } from "~/modules/db.server";
import { getEventsByDay } from "~/modules/events.server";

const ICON_SIZE = 18;

export async function loader() {
	const eventDays = await getEventsByDay("Valencia");
	return { eventDays };
}

export async function action({ request }: ActionFunctionArgs) {
	const body = new URLSearchParams(await request.text());
	let likesIncrement = Number(body.get("likesIncrement"));
	const eventId = Number(body.get("eventId"));

	// avoid overuse of likes
	likesIncrement = Math.min(30, likesIncrement);

	const newEvent = await db.event.update({
		where: { id: eventId },
		data: {
			likes: {
				increment: likesIncrement,
			},
		},
	});

	return { actionLikes: newEvent.likes, eventId };
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
					<Location01Icon size={25} className=" mt-0.5" />
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
								id={event.id}
								name={event.name}
								infoUrl={event.infoUrl}
								organizer={event.organizer}
								startDate={event.startDate}
								endDate={event.endDate}
								location={event.location}
								salsaPercentage={event.salsaPercentage}
								bachataPercentage={event.bachataPercentage}
								kizombaPercentage={event.kizombaPercentage}
								likes={event.likes}
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
	id: number;
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
	likes: number;
}

export const EventItem = ({
	id,
	infoUrl,
	name,
	organizer,
	startDate,
	endDate,
	location,
	salsaPercentage,
	bachataPercentage,
	kizombaPercentage,
	likes,
}: EventItemProps) => {
	const startTime = format(startDate, "HH:mm");
	const endTime = format(endDate, "HH:mm");
	const sbk = `${salsaPercentage}-${bachataPercentage}-${kizombaPercentage}`;

	return (
		<div className="flex flex-col gap-y-0.5">
			<h3 className="flex-1 text-lg font-bold">
				<a
					href={infoUrl}
					className="underline decoration-1 hover:text-gray-300"
				>
					{name}
				</a>
			</h3>
			<div className="-mt-0.5 flex flex-1 flex-wrap gap-x-4 gap-y-0.5 leading-snug text-gray-200">
				<div>{organizer.name}</div>
				<div className="flex">
					<Clock01Icon size={ICON_SIZE} className="my-auto mr-1" />
					{startTime} – {endTime}
				</div>
				<a
					href={location.googleMapsUrl}
					className="flex underline decoration-1 hover:text-gray-300"
				>
					<Location03Icon size={ICON_SIZE} className="my-auto" />
					{location.name}
				</a>
				<div>SBK {sbk}</div>
				<LikeButton initialLikes={likes} eventId={id} />
			</div>
		</div>
	);
};

export const Separator = () => {
	return <span className="h-[1px] w-full bg-gray-500" />;
};

const FIRE_ANIMATION_TIME = 1000;

export interface LikeButtonProps {
	initialLikes: number;
	eventId: number;
}

export const LikeButton = ({ initialLikes, eventId }: LikeButtonProps) => {
	const { t } = useTranslation();
	const [fireIcons, setFireIcons] = useState<{ id: number; x: number }[]>([]);
	const [likes, setLikes] = useState(initialLikes);
	const likesIncrement = useRef(0);
	const debouncedLikes = useDebounce(likes, 250);
	const submit = useSubmit();

	const actionData = useActionData<typeof action>();

	useEffect(() => {
		if (debouncedLikes > 0) {
			submit(
				{ likesIncrement: likesIncrement.current, eventId },
				{
					method: "POST",
					fetcherKey: "like",
				}
			);
			likesIncrement.current = 0;
		}
	}, [debouncedLikes, eventId, submit]);

	useEffect(() => {
		// update likes in case another use liked at the same time
		if (
			actionData &&
			actionData.actionLikes >= likes &&
			actionData.eventId === eventId
		) {
			setLikes(actionData.actionLikes);
		}
	}, [actionData, eventId, likes]);

	const handleClick = () => {
		const newIconId = Date.now();
		const xRange = 25;
		const randomX = Math.floor(Math.random() * xRange * 2) - xRange;
		setFireIcons((prev) => {
			return [...prev, { id: newIconId, x: randomX }];
		});
		setLikes((prev) => {
			return prev + 1;
		});
		likesIncrement.current += 1;

		setTimeout(() => {
			setFireIcons((prev) => {
				return prev.filter((icon) => {
					return icon.id !== newIconId;
				});
			});
		}, FIRE_ANIMATION_TIME);
	};

	return (
		<button aria-label={t("like")} className="flex" onClick={handleClick}>
			<FireIcon size={ICON_SIZE} className="mr-0.5" />
			{likes}
			<AnimatePresence>
				{fireIcons.map((icon) => {
					return (
						<motion.div
							key={icon.id}
							initial={{ opacity: 1, y: 0 }}
							animate={{ opacity: 0, y: -50, x: icon.x }}
							exit={{ opacity: 0 }}
							transition={{ duration: FIRE_ANIMATION_TIME / 1000 }}
							className="absolute"
						>
							<FireIcon size={ICON_SIZE} className="mr-0.5" />
						</motion.div>
					);
				})}
			</AnimatePresence>
		</button>
	);
};
