import { FormScope, useField } from "@rvf/react";
import { InputProps } from "@nextui-org/react";
import { Input as _Input } from "@nextui-org/input";

export type _InputProps = {
	label?: string;
	scope: FormScope<string>;
} & InputProps;

export const Input = ({ label, scope, ...props }: _InputProps) => {
	const field = useField(scope);
	const { onChange, onBlur, defaultValue, name, type, form } =
		field.getInputProps();
	const hasError = field.error() !== null;
	return (
		<_Input
			label={label}
			onChange={onChange}
			onBlur={onBlur}
			defaultValue={defaultValue}
			name={name}
			type={type}
			value={field.value()}
			form={form}
			isInvalid={hasError}
			errorMessage={field.error()}
			{...props}
		/>
	);
};
