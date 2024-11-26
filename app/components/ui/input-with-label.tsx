import { Label } from "@radix-ui/react-label";
import { Input } from "~/components/ui/input";

export type InputWithLabelProps = {
	id: string;
	label: string;
} & React.ComponentPropsWithoutRef<"input">;
export const InputWithLabel = ({label,id, ...inputProps}: InputWithLabelProps) => {
	return (
		<div>
			<Label htmlFor={id}>{label}</Label>
			<Input id={id} {...inputProps} />
		</div>
	);
};
