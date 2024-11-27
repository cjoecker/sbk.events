import { Label } from "@radix-ui/react-label";
import { Input } from "~/components/ui/input";
import { FormScope, useField } from "@rvf/react";

export type InputWithLabelProps = {
	scope:FormScope<string>
	label:string
} & React.ComponentPropsWithoutRef<"input">;
export const InputWithLabel = ({scope, label,...inputProps}: InputWithLabelProps) => {
	const field = useField(scope);
	return (
		<div>
			<Label htmlFor={field.name()}>{label}</Label>
			<Input id={field.name()} scope={scope} {...inputProps} />
		</div>
	);
};
