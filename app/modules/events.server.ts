import { startOfDay } from "date-fns";
import { EventDay, events } from "~/constants/events";

export function getEventsByDay(): EventDay[] {
  const today = startOfDay(new Date());
  const eventsAfterToday = events.filter((event) => {
    return event.startDate >= today;
  });
  const sortedEvents = eventsAfterToday.sort((a, b) => {
    return a.startDate.getTime() - b.startDate.getTime();
  });

  const eventDays: EventDay[] = [];
  for(const event of sortedEvents) {
    const eventDate = startOfDay(event.startDate);
    const eventDay = eventDays.find((day) => {
      return day.date.getTime() === eventDate.getTime();
    });
    if(eventDay) {
      eventDay.events.push(event);
    } else {
      eventDays.push({
        date: eventDate,
        events: [event]
      });
    }
  }
  return eventDays;
}
