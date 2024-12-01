import { parseTime } from "@internationalized/date";
import { TimeInput as _TimeInput } from "@nextui-org/date-input";
import { TimeInputProps } from "@nextui-org/react";
import { TimeValue } from "@react-types/datepicker";
import { FormScope, useField } from "@rvf/react";

export type _TimeInputProps = {
	label?: string;
	scope: FormScope<string>;
} & TimeInputProps;

export const TimeInput = ({ label, scope, ...props }: _TimeInputProps) => {
	const field = useField(scope);
	const { onChange, onBlur, name } = field.getInputProps();
	const defaultValue = field.getInputProps().defaultValue as string;
	const timeDefaultValue = defaultValue ? parseTime(defaultValue) : undefined;
	const timeValue = field.value() ? parseTime(field.value()) : undefined;

	const hasError = field.error() !== null;
	return (
		<_TimeInput
			hourCycle={24}
			label={label}
			onChange={(value: TimeValue) => {
				const timeText = value.toString();
				field.setValue(timeText);
				if (onChange) {
					onChange(timeText);
				}
			}}
			onBlur={onBlur}
			defaultValue={timeDefaultValue}
			name={name}
			value={timeValue}
			isInvalid={hasError}
			errorMessage={field.error()}
			{...props}
		/>
	);
};
