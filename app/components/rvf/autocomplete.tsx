import { FormScope, useField } from "@rvf/react";
import {
	Autocomplete as _Autocomplete,
	AutocompleteItem,
} from "@nextui-org/autocomplete";
import React, { Ref, useEffect } from "react";
import { AutocompleteProps } from "@nextui-org/react";

export type _AutocompleteProps = {
	label: string;
	options: { id: string; name: string }[];
	idScope: FormScope<string>;
	nameScope: FormScope<string>;
} & Omit<AutocompleteProps, 'children'>;

export function AutoComplete({
	label,
	idScope,
	nameScope,
	options,
	...props
}: _AutocompleteProps) {
	const nameField = useField(nameScope);
	const idField = useField(idScope);

	const {
		onChange: onChangeName,
		onBlur,
		defaultValue,
		name,
		type,
		value,
		form,
	} = nameField.getInputProps();
	const { onChange: onChangeId, value: idValue } = idField.getInputProps();

	const hasError = nameField.error() !== null;

	useEffect(() => {
		console.log("value", value);
	}, [value]);

	return (
		<>
			<_Autocomplete
				label={label}
				errorMessage={nameField.error()}
				isInvalid={hasError}
				allowsCustomValue={true}
				allowsEmptyCollection={false}
				onSelectionChange={(id) => {
					idField.setValue(id as string);
				}}
				onInputChange={(value) => {
					nameField.setValue(value);
					const foundId = options.find((option) => option.name === value)?.id;
					if (foundId) {
						idField.setValue(foundId);
					}
				}}
				{...props}
			>
				{options.map((option) => {
					return (
						<AutocompleteItem key={option.id} value={option.id}>
							{option.name}
						</AutocompleteItem>
					);
				})}
			</_Autocomplete>
			<input type="hidden" {...idField.getInputProps()} />
			<input type="hidden" {...nameField.getInputProps()} />
		</>
	);
}
