import * as React from "react";

import { cn } from "~/lib/utils";
import { FormScope, useField, useForm } from "@rvf/react";

interface InputProps extends React.ComponentProps<"input"> {
	scope:FormScope<string>
	fullWidth?:boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, scope, type, fullWidth = true,...props }, ref) => {
		const field = useField(scope);
		const hasError = field.error() !== null;
		const errorId = `${field.name()}-error`;
		return (
			<div>
				<input
					type={type}
					className={cn(
						"file:font-medium flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
						hasError && "border-red-200",
						fullWidth && "w-full",
						className
					)}
					ref={ref}
					aria-describedby={hasError ? errorId : undefined}
					{...props}
					{...field.getInputProps()}
				/>
				{hasError && (
					<div id={errorId} className="text-xs text-destructive-foreground text-red-300 mt-0.5" aria-live="assertive">
						{field.error()}
					</div>
				)}
			</div>
		);
	}
);
Input.displayName = "Input";

export { Input };
