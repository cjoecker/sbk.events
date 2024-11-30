import { parseDate } from "@internationalized/date";
import { DatePicker as _DatePicker } from "@nextui-org/date-picker";
import { DatePickerProps } from "@nextui-org/react";
import { FormScope, useField } from "@rvf/react";

export type _DatePickerProps = {
	label?: string;
	scope: FormScope<string>;
} & DatePickerProps;

export const DatePicker = ({ label, scope, ...props }: _DatePickerProps) => {
	const field = useField(scope);
	const { onChange, onBlur, name } = field.getInputProps();
	const defaultValue = field.getInputProps().defaultValue as string;
	const dateDefaultValue = defaultValue ? parseDate(defaultValue) : undefined;
	const hasError = field.error() !== null;
	return (
		<_DatePicker
			label={label}
			onBlur={onBlur}
			onChange={(value) => {
				const dateText = value.toString();
				field.setValue(dateText);
				if (onChange) {
					onChange(dateText);
				}
			}}
			name={name}
			defaultValue={dateDefaultValue}
			isInvalid={hasError}
			errorMessage={field.error()}
			{...props}
		/>
	);
};
