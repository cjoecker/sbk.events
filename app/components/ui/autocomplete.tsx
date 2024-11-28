import { Command as CommandPrimitive } from "cmdk";
import { Check } from "lucide-react";
import { useMemo, useState } from "react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
	CommandList,
} from "~/components/ui/command";
import { Input } from "~/components/ui/input";
import {
	Popover,
	PopoverAnchor,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { Skeleton } from "~/components/ui/skeleton";
import { FormScope, useField } from "@rvf/react";
import { cn } from "~/lib/utils";
import { Label } from "@radix-ui/react-label";
import { Button } from "~/components/ui/button";

export type AutocompleteProps = {
	label: string;
	options: { value: string; label: string }[];
	scope: FormScope<string>;
} & React.ComponentPropsWithoutRef<"input">;

export function AutoComplete<T extends string>({
	label,
	scope,
	options,
	...inputProps
}: AutocompleteProps) {
	const field = useField(scope);

	const [isListOpen, setIsListOpen] = useState(false);

	return (
		<div className="flex flex-col">
			<Label htmlFor={field.name()}>{label}</Label>
			<Popover open={isListOpen}>
				<PopoverAnchor>
					<Input
						id={field.name()}
						scope={scope}
						{...inputProps}
						onChange={(e) => {
							setIsListOpen(true);
							inputProps.onChange?.(e);
						}}
					/>
				</PopoverAnchor>
				<PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
					<CommandList>
						{options.map((option) => (
							<CommandItem
								key={option.value}
								onSelect={() => {
									field.setValue(option.value);
									setIsListOpen(false);
								}}
							>
								{option.label}
							</CommandItem>
						))}
					</CommandList>
				</PopoverContent>
			</Popover>
		</div>
	);
}
