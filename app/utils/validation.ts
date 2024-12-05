import { z } from "zod";

const PARAMETERS_SEPARATOR = ";;";
export const  intWithinRange = (min: number, max: number) => {
	return z.preprocess(
		(val) => {
			return val === "" ? Number.NaN : val;
		},
		z.coerce
			.number({ invalid_type_error: "wrongValueType" })
			.int()
			.refine(
				(val) => {
					return val >= min && val <= max;
				},
				{
					message: getWithinRangeErrorMessage(min, max),
				}
			)
	);
};

export function getWithinRangeErrorMessage(min: number, max: number) {
	return `valueMustBeBetween${PARAMETERS_SEPARATOR}${JSON.stringify({
		min,
		max,
	})}`;
}

export function assert(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	condition: any,
	message: string
): asserts condition {
	if (condition) {
		return;
	}
	throw new Error(`Assert failed: ${message}`);
}
