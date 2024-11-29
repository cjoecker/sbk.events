import { FormScope, useField } from "@rvf/react";
import { Autocomplete as _Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import React, { Ref } from "react";
import { AutocompleteProps } from "@nextui-org/react";

export type _AutocompleteProps = {
	label: string;
	options: { value: string; label: string }[];
	scope: FormScope<string>;
} & AutocompleteProps;

export function AutoComplete({
	label,
	scope,
	options,
	...props
}: _AutocompleteProps) {
	const field = useField(scope);
	const { onChange, onBlur, defaultValue, name, type, ref, value, form } =
		field.getInputProps();
	const hasError = field.error() !== null;

	return (
		<_Autocomplete
			label={label}
			errorMessage={field.error()}
			isInvalid={hasError}
			onBlur={onBlur}
			onChange={onChange}
			inputProps={{
				defaultValue,
				name,
				type,
				form,
			}}
			{...props}
		>
			{options.map((option) => (
				<AutocompleteItem key={option.value} value={option.value}>
					{option.label}
				</AutocompleteItem>
			))}
		</_Autocomplete>
	);
}
