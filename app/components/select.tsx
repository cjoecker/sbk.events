import { Select as _Select, SelectItem } from "@nextui-org/react";
import { SelectProps } from "@nextui-org/react";
import { FormScope, useField } from "@rvf/react";
import React from "react";
import { useTranslation } from "react-i18next";

export type _SelectProps = {
	label?: string;
	scope: FormScope<string | number>;
	options: { id: string; name: string }[];
} & Omit<SelectProps, "children">;

export const Select = ({
	label,
	scope,
	                       options,
	...props
}: _SelectProps) => {
	const field = useField(scope);
	const { onChange, onBlur, name, type, form } = field.getInputProps();
	const defaultValue = field.getInputProps().defaultValue as string;
	const hasError = field.error() !== null;
	const { t } = useTranslation();
	const translatedError = hasError ? t(field.error() ?? "") : undefined;
	return (
		<_Select
			label={label}
			onChange={onChange}
			onBlur={onBlur}
			name={name}
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			value={field.value()?.toString() ?? ""}
			form={form}
			isInvalid={hasError}
			errorMessage={translatedError}
			{...props}
		>
			{options.map((option) => {
				return (
					<SelectItem key={option.id} value={option.id}>
						{option.name}
					</SelectItem>
				);
			})}
		</_Select>
	);
};
