import { FormScope, useField } from "@rvf/react";
import {
	Autocomplete as _Autocomplete,
	AutocompleteItem,
} from "@nextui-org/autocomplete";
import React, { Ref, useEffect } from "react";
import { AutocompleteProps } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

export type _AutocompleteProps = Omit<AutocompleteProps, "children" | "onSelectionChange"> & {
	label: string;
	options: { id: string; name: string }[];
	idScope: FormScope<string>;
	nameScope: FormScope<string>;
	onSelectionChange?: (id: string) => void;
};

export function AutoComplete({
	label,
	idScope,
	nameScope,
	options,
	                             onSelectionChange,
	...props
}: _AutocompleteProps) {
	const nameField = useField(nameScope);
	const idField = useField(idScope);
	const {t}=useTranslation();
	const hasError = nameField.error() !== null || idField.error() !== null;
	const errorTranslationKey = nameField.error() ?? idField.error() ?? "";
	const errorMessage = t(errorTranslationKey);

	return (
		<>
			<_Autocomplete
				label={label}
				errorMessage={errorMessage}
				isInvalid={hasError}
				allowsCustomValue={true}
				allowsEmptyCollection={false}
				onSelectionChange={(id) => {
					idField.setValue(id as string);
					idField.setTouched(true);
					nameField.setTouched(true);
					nameField.validate();
					if(onSelectionChange) {
						onSelectionChange(id as string);
					}
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
