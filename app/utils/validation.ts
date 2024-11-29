import { z } from "zod";

const PARAMETERS_SEPARATOR = ";;";
export const intWithinRange = (min: number, max: number) => {
	return z.preprocess(
		(val) => (val === "" ? NaN : val),
		z.coerce
			.number({ invalid_type_error: "wrongValueType" })
			.int()
			.refine(
				(val) => {
					console.log("val", val);
					return val >= min && val <= max;
				},
				{
					message: getWithinRangeErrorMessage(min, max),
				},
			),
	);
};



export function getWithinRangeErrorMessage(min: number, max: number) {
	return `valueMustBeBetween${PARAMETERS_SEPARATOR}${JSON.stringify({ min, max })}`;
}
