import { parseDate } from "@internationalized/date";
import { DatePicker as _DatePicker } from "@nextui-org/date-picker";
import { DatePickerProps } from "@nextui-org/react";
import { FormScope, useField } from "@rvf/react";
import { useTranslation } from "react-i18next";

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
	const { t } = useTranslation();
	const translatedError = hasError ? t(field.error() ?? "") : undefined;
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
				field.setTouched(true);
			}}
			name={name}
			defaultValue={dateDefaultValue}
			isInvalid={hasError}
			errorMessage={translatedError}
			{...props}
		/>
	);
};
