import { InputProps, TextAreaProps } from "@nextui-org/react";
import { FormScope, useField } from "@rvf/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Textarea as _Textarea } from "@nextui-org/input";

export type _TextAreaProps = {
	label?: string;
	scope: FormScope<string | number>;
} & TextAreaProps;

export const Textarea = ({
	label,
	scope,
	...props
}: _TextAreaProps) => {
	const field = useField(scope);
	const { onChange, onBlur, name, type, form } = field.getInputProps();
	const defaultValue = field.getInputProps().defaultValue as string;
	const hasError = field.error() !== null;
	const { t } = useTranslation();
	const translatedError = hasError ? t(field.error() ?? "") : undefined;
	return (
		<_Textarea
			label={label}
			onChange={onChange}
			onBlur={onBlur}
			defaultValue={defaultValue}
			name={name}
			type={type}
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			value={field.value()?.toString() ?? ""}
			form={form}
			isInvalid={hasError}
			errorMessage={translatedError}
			{...props}
		/>
	);
};
