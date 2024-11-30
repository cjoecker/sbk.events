import { Input as _Input } from "@nextui-org/input";
import { InputProps } from "@nextui-org/react";
import { FormScope, useField } from "@rvf/react";

export type _InputProps = {
	label?: string;
	scope: FormScope<string | number>;
} & InputProps;

export const Input = ({ label, scope, ...props }: _InputProps) => {
	const field = useField(scope);
	const { onChange, onBlur, name, type, form } = field.getInputProps();
	const defaultValue = field.getInputProps().defaultValue as string;
	const hasError = field.error() !== null;
	return (
		<_Input
			label={label}
			onChange={onChange}
			onBlur={onBlur}
			defaultValue={defaultValue}
			name={name}
			type={type}
			value={field.value()?.toString()}
			form={form}
			isInvalid={hasError}
			errorMessage={field.error()}
			{...props}
		/>
	);
};
