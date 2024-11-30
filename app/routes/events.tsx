import { SEOHandle } from "@nasa-gcn/remix-seo";
import {
	ActionFunctionArgs,
	LinksFunction,
	LoaderFunctionArgs,
} from "@remix-run/node";
import {
	useLoaderData,
	useNavigation,
	useSubmit,
	Outlet,
} from "@remix-run/react";
import { format } from "date-fns";
import { motion, useAnimate } from "framer-motion";
import {
	Location03Icon,
	Clock01Icon,
	Location01Icon,
	FavouriteIcon,
} from "hugeicons-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHydrated } from "remix-utils/use-hydrated";

import { FavouriteIconFilled } from "~/components/icons/favourite-icon-filled";
import { CITY } from "~/constants/city";
import { db } from "~/modules/db.server";
import { getEventsByDay } from "~/modules/events.server";
import { getSession } from "~/modules/session.server";
import { json } from "~/utils/remix";

const ICON_SIZE = 18;

export const links: LinksFunction = () => {
	return [
		{
			rel: "canonical",
			href: "https://sbk.events/events",
		},
	];
};

export async function loader({ request }: LoaderFunctionArgs) {
	const eventDays = await getEventsByDay(CITY);
	const { getLikedEvents } = await getSession(request);
	return { eventDays, likedEvents: getLikedEvents() };
}

export async function action({ request }: ActionFunctionArgs) {
	const { getHasLikedEvent, likeEvent, getHeaders } = await getSession(request);

	const body = new URLSearchParams(await request.text());
	const eventId = Number(body.get("eventId"));

	const hasLikedEvent = getHasLikedEvent(eventId);
	const increment = hasLikedEvent ? -1 : 1;
	const newEvent = await db.event.update({
		where: { id: eventId },
		data: {
			likes: {
				increment,
			},
		},
	});

	if (newEvent.likes < 0) {
		await db.event.update({
			where: { id: eventId },
			data: {
				likes: 0,
			},
		});
	}

	likeEvent(eventId);

	return json(
		{ actionLikes: newEvent.likes, eventId },
		{ headers: await getHeaders() }
	);
}

export const handle: SEOHandle = {
	getSitemapEntries: () => {
		return [{ route: "/events", priority: 1, changefreq: "hourly" }];
	},
};

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
			<Outlet />
			<div className="flex w-full justify-between">
				<Title />
				<h2 className="my-auto flex text-xl">
					<Location01Icon size={25} className=" mt-0.5" />
					Valencia
				</h2>
			</div>
			{isHydrated && (
				<motion.ul
					className="mt-2 flex flex-col gap-y-2"
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
	const ariaLabel = t("salsaBachataKizombaSocials");
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
							{/*TODO check if google adds space after Socials with &#8203; */}
							{index === socialsArray.length - 1 && <>&#8203;</>}
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
	return <h3 className=" mb-1 mt-3 text-xl font-bold capitalize">{month}</h3>;
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
	const { likedEvents } = useLoaderData<typeof loader>();
	const initialHasLiked = likedEvents.includes(id);

	return (
		<div className="flex flex-col gap-y-1">
			<h4 className="flex-1 text-xl font-bold">
				<a
					href={infoUrl}
					className="flex h-6 underline decoration-1 hover:text-gray-300"
				>
					{name}
				</a>
			</h4>
			<div className="-mt-0.5 flex flex-1 flex-wrap gap-x-4 gap-y-1 leading-snug text-gray-200">
				<div>{organizer.name}</div>
				<div className="flex">
					<Clock01Icon size={ICON_SIZE} className="my-auto mr-1" />
					{startTime} – {endTime}
				</div>
				<a
					href={location.googleMapsUrl}
					className="flex flex h-6 underline decoration-1 hover:text-gray-300"
				>
					<Location03Icon size={ICON_SIZE} className="my-auto" />
					{location.name}
				</a>
				<div>SBK {sbk}</div>
				<LikeButton
					initialLikes={likes}
					initialHasLiked={initialHasLiked}
					eventId={id}
				/>
			</div>
		</div>
	);
};

export const Separator = () => {
	return <span className="h-[1px] w-full bg-gray-500" />;
};

export interface LikeButtonProps {
	initialLikes: number;
	initialHasLiked: boolean;
	eventId: number;
}

export const LikeButton = ({
	initialLikes,
	initialHasLiked,
	eventId,
}: LikeButtonProps) => {
	const { t } = useTranslation();
	const [likes, setLikes] = useState(initialLikes);
	const [hasLiked, setHasLiked] = useState(initialHasLiked);
	const submit = useSubmit();
	const [scope, animate] = useAnimate();
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	const handleClick = () => {
		if (isSubmitting) return;
		submit(
			{ eventId },
			{
				method: "POST",
				fetcherKey: "like",
			}
		);
		setHasLiked((hasLiked) => {
			return !hasLiked;
		});
		const increment = hasLiked ? -1 : 1;
		setLikes((likes) => {
			return likes + increment;
		});
	};

	return (
		<button
			aria-label={t("like")}
			className="flex h-6 select-none"
			onClick={handleClick}
			onMouseEnter={() => {
				animate(scope.current, { scale: 1.2 });
			}}
			onMouseLeave={() => {
				animate(scope.current, { scale: 1 });
			}}
			onMouseDown={() => {
				animate(scope.current, { scale: 0.9 });
			}}
		>
			<span className=" mr-0.5 flex" ref={scope}>
				{hasLiked ? (
					<FavouriteIconFilled size={ICON_SIZE} />
				) : (
					<FavouriteIcon size={ICON_SIZE} />
				)}
			</span>
			{likes}
		</button>
	);
};
