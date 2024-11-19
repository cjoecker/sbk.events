import { ClockIcon, SewingPinIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { getEventsByDay } from "~/modules/events.server";
import { Event, EventDay } from "~/constants/events";
import { superjson, useSuperLoaderData } from "~/utils/data";

export function loader() {
  const eventDays = getEventsByDay();
  return superjson({ eventDays });
}

export default function Events() {
  const { eventDays } = useSuperLoaderData<typeof loader>();
  return (
    <div>
      <div className="w-full flex justify-between">
        <h1 className="flex font-bold flex-col w-48">
          <span className="text-4xl">Sociales</span>
          <span className="-mt-2">Salsa Bachata Kizomba</span>
        </h1>
        <h2 className="text-xl my-auto mr-4 flex">
          <SewingPinIcon className="mt-1.5 mr-0.5" />
          Valencia
        </h2>
      </div>
      <div className="flex p-2 flex-col gap-y-2 pl-3">
        {eventDays.map((eventDay, index) => {
          const dayBefore = index > 0 ? eventDays[index - 1].date : null;
          const isNextMonth =
            (dayBefore && dayBefore.getMonth() !== eventDay.date.getMonth()) ||
            index === 0;

          return (
            <>
              {isNextMonth && <MonthName date={eventDay.date} />}
              <EventDayItem key={eventDay.date.toString()} {...eventDay} />
            </>
          );
        })}
      </div>
    </div>
  );
}

export type MonthName = {
  date: Date;
};
export const MonthName = ({ date }: MonthName) => {
  const month = format(date, "MMMM");
  return <h3 className="font-bold text-xl mt-2 -mb-1 -ml-2">{month}</h3>;
};

export const EventDayItem = ({ events, date }: EventDay) => {
  const weekday = format(date, "EEE");
  const day = format(date, "d");
  return (
    <div className="border border-gray-400 rounded w-full flex">
      <div className="bg-gray-200 w-14 pt-1 text-center">
        <div className="text-md">{weekday}</div>
        <div className="text-3xl -mt-1">{day}</div>
      </div>
      <div className="flex-1 p-2 gap-y-3 flex flex-col divide-y">
        {events.map((event) => {
          return <EventItem key={event.name} {...event} />;
        })}
      </div>
    </div>
  );
};
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
}: Event) => {
  const startTime = format(startDate, "HH:mm");
  const endTime = format(endDate, "HH:mm");
  const sbk = `${salsaPercentage}-${bachataPercentage}-${kizombaPercentage}`;

  return (
    <div className="flex flex-col">
      <h3 className="flex-1 font-bold text-lg">  <a href={url} className="hover:underline">
        {name}
      </a></h3>
      <div className="flex flex-1 gap-x-4 flex-wrap leading-snug">
        <div>{organizer}</div>
        <div className="flex">
          <ClockIcon className="my-auto mr-1" />
          {startTime} – {endTime}
        </div>
        <a href={locationUrl} className="flex hover:underline">
          <SewingPinIcon className="my-auto -mx-0.5" />
          {location}
        </a>
        <div>SBK {sbk}</div>
      </div>
    </div>
  );
};
