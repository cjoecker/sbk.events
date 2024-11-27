"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { cn } from "~/lib/utils";
import { Label } from "@radix-ui/react-label";

export type DatePickerProps = {
	id: string;
	label: string;
};

export function DatePicker({ id, label }: DatePickerProps) {
	const [date, setDate] = React.useState<Date>();

	return (
		<div className="flex flex-col">
			<Label htmlFor={id}>{label}</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(
							"w-[280px] justify-start text-left font-normal",
							!date && "text-muted-foreground"
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date ? format(date, "PPP") : <span>Pick a date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0">
					<Calendar
						mode="single"
						selected={date}
						onSelect={setDate}
						initialFocus
					/>
				</PopoverContent>
			</Popover>
			<input type="hidden" id={id} value={date ? date.toISOString() : ""} />
		</div>
	);
}
