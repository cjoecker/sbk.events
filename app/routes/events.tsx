import { SEOHandle } from "@nasa-gcn/remix-seo";
import { Button } from "@nextui-org/react";
import { Switch } from "@nextui-org/switch";
import {
	useLoaderData,
	useNavigation,
	useSubmit,
	Outlet,
	useNavigate,
} from "@remix-run/react";
import {
	ActionFunctionArgs,
	LinksFunction,
	LoaderFunctionArgs,
} from "@vercel/remix";
import { format } from "date-fns";
import { motion, useAnimate } from "framer-motion";
import {
	Location03Icon,
	Clock01Icon,
	Location01Icon,
	FavouriteIcon,
	Edit02Icon,
	Add01Icon,
} from "hugeicons-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";

import { FavouriteIconFilled } from "~/components/favourite-icon-filled";
import { CITY } from "~/constants/city";
import {
	getEventsByDay,
	publishEvent,
	setEventLike,
} from "~/modules/events.server";
import { getSession } from "~/modules/session.server";
import { json } from "~/utils/remix";
import { useTranslationWithMarkdown } from "~/utils/use-translation-with-markdown";

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
	const { getIsAdmin } = await getSession(request);
	const isAdmin = getIsAdmin();
	const eventDays = await getEventsByDay(CITY, isAdmin);
	const { getLikedEvents } = await getSession(request);
	return { eventDays, likedEvents: getLikedEvents(), isAdmin };
}

export async function action({ request }: ActionFunctionArgs) {
	const { getHasLikedEvent, likeEvent, getHeaders, getIsAdmin } =
		await getSession(request);

	const body = new URLSearchParams(await request.text());
	const eventId = Number(body.get("eventId"));
	const intent = body.get("intent");
	const isAdmin = getIsAdmin();

	if (intent === "publish" && isAdmin) {
		const isPublished = body.get("isPublished") === "true";
		await publishEvent(eventId, isPublished);
		return json({ action: "publish", eventId, isPublished });
	}

	if (intent === "like") {
		const hasLikedEvent = getHasLikedEvent(eventId);
		const likes = await setEventLike(eventId, hasLikedEvent);
		likeEvent(eventId);
		return json(
			{ actionLikes: likes, eventId },
			{ headers: await getHeaders() }
		);
	}
}

export const handle: SEOHandle = {
	getSitemapEntries: () => {
		return [{ route: "/events", priority: 1, changefreq: "hourly" }];
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
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { t: tWithMarkdown } = useTranslationWithMarkdown();

	return (
		<div>
			<Outlet />
			<div className="flex w-full justify-between">
				<Title />
				<h2 className="my-auto flex text-xl">
					<Location01Icon size={25} className=" mt-0.5" />
					Valencia
				</h2>
			</div>
			<Button
				className="fixed bottom-2 right-3 z-40 h-14 w-14"
				size={"lg"}
				radius={"full"}
				isIconOnly
				color="primary"
				aria-label={t("addEvent")}
				onClick={() => {
					navigate("/events/create");
				}}
			>
				<Add01Icon />
			</Button>
			<ul className="mt-1 flex flex-col gap-y-2">
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
			</ul>
			<div className="mx-auto mt-5 w-[90%] whitespace-pre-wrap text-center text-sm">
				{tWithMarkdown("allTheEventsAndClasses")}
			</div>
		</div>
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
								status={event.status}
							/>
							{!isLast && <Separator />}
						</Fragment>
					);
				})}
			</div>
		</div>
	);
};

type EventStatusClient = "PUBLISHED" | "PENDING_CREATION_APPROVAL" | "DELETED";

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
	status: EventStatusClient;
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
	status,
}: EventItemProps) => {
	const startTime = startDate.slice(11, 16);
	const endTime = endDate.slice(11, 16);
	const sbk = `${salsaPercentage}-${bachataPercentage}-${kizombaPercentage}`;
	const { likedEvents } = useLoaderData<typeof loader>();
	const initialHasLiked = likedEvents.includes(id);
	const { isAdmin } = useLoaderData<typeof loader>();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const handleEditClick = () => {
		const url = `/events/update/${id}`;
		navigate(url);
	};

	return (
		<div className="relative flex flex-col gap-y-1">
			{isAdmin && (
				<button
					className="absolute right-0 top-0"
					aria-label={t("editEvent")}
					onClick={handleEditClick}
				>
					<Edit02Icon size={ICON_SIZE} />
				</button>
			)}
			<h4 className="flex-1 text-xl font-bold">
				<a
					href={infoUrl}
					className="flex h-auto whitespace-normal break-words underline decoration-1 hover:text-gray-300"
				>
					{name}
				</a>
			</h4>
			<div className="-mt-0.5 flex flex-1 flex-wrap gap-x-4 gap-y-1 leading-snug text-gray-200">
				<div aria-label={t("organizer")}>{organizer.name}</div>
				<div className="flex" aria-label={t("time")}>
					<Clock01Icon size={ICON_SIZE} className="my-auto mr-1" />
					{startTime} – {endTime}
				</div>
				<a
					href={location.googleMapsUrl}
					className="flex flex h-6 h-auto whitespace-normal break-words underline decoration-1 hover:text-gray-300"
					aria-label={t("location")}
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
			<PublishSwitch id={id} status={status} />
		</div>
	);
};

export const Separator = () => {
	return <span className="h-[1px] w-full bg-gray-500" />;
};

export interface PublishSwitchProps {
	id: number;
	status: EventStatusClient;
}
export const PublishSwitch = ({ id, status }: PublishSwitchProps) => {
	const submit = useSubmit();
	const isPublished = status === "PUBLISHED";
	const navigation = useNavigation();
	const isLoading = navigation.state !== "idle";
	const { isAdmin } = useLoaderData<typeof loader>();

	const handlePublishSwitch = () => {
		const newStatus = !isPublished;
		submit(
			{ eventId: id, isPublished: newStatus, intent: "publish" },
			{
				method: "POST",
				fetcherKey: "publish",
			}
		);
	};
	if (!isAdmin) return null;

	return (
		<div>
			<Switch
				disabled={isLoading}
				defaultSelected
				color="primary"
				isSelected={isPublished}
				onClick={handlePublishSwitch}
			/>
		</div>
	);
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
			{ eventId, intent: "like" },
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
