import { Input as _Input } from "@nextui-org/input";
import { InputProps } from "@nextui-org/react";
import { FormScope, useField } from "@rvf/react";
import React from "react";

export type _InputProps = {
	label?: string;
	scope: FormScope<string | number>;
	endContentText?: string;
} & InputProps;

export const Input = ({
	label,
	scope,
	endContentText,
	...props
}: _InputProps) => {
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
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			value={field.value()?.toString()}
			form={form}
			isInvalid={hasError}
			errorMessage={field.error()}
			endContent={
				endContentText ? <EndContentText>{endContentText}</EndContentText> : ""
			}
			{...props}
		/>
	);
};

const EndContentText = ({ children }: { children: string }) => {
	return (
		<div className="pointer-events-none flex items-center">
			<span className="text-small text-default-500">{children}</span>
		</div>
	);
};
