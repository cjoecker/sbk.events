import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@nextui-org/react";
import { useNavigate, useNavigation } from "@remix-run/react";
import { useField } from "@rvf/react";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { AutoComplete } from "~/components/autocomplete";
import { DatePicker } from "~/components/date-picker";
import { EnhancedDialog } from "~/components/enhanced-dialog";
import { Input } from "~/components/input";
import { TimeInput } from "~/components/time-input";
import { intWithinRange } from "~/utils/validation";

export const eventSchema = z
	.object({
		infoUrl: z.string().trim().url("wrongUrl"),
		name: z.string().trim().min(1, "mandatoryField"),
		organizerId: z.string().optional(),
		organizerName: z.string().min(1, "mandatoryField"),
		date: z.string().date("mandatoryField"),
		startTime: z.string().time("mandatoryField"),
		endTime: z.string().time("mandatoryField"),
		locationId: z.string().optional(),
		locationName: z.string().min(1, "mandatoryField"),
		locationGoogleMapsUrl: z.string().trim().url(),
		salsaPercentage: intWithinRange(0, 100),
		bachataPercentage: intWithinRange(0, 100),
		kizombaPercentage: intWithinRange(0, 100),
	})
	.superRefine((val, ctx) => {
		if (
			val.bachataPercentage + val.kizombaPercentage + val.salsaPercentage !==
			100
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "",
				// all fields in path array is not working
				path: ["salsaPercentage"],
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "",
				path: ["bachataPercentage"],
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "",
				path: ["kizombaPercentage"],
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "totalMustBe100",
				path: ["sumError"],
			});
		}
	});

export const upsertEventValidator = withZod(eventSchema);

interface AutocompleteOption {
	id: string;
	name: string;
}

interface UpsertEvent {
	locationOptions: AutocompleteOption[];
	organizerOptions: AutocompleteOption[];
	googleMapsUrls: { id: string; googleMapsUrl: string }[];
	defaultValues?: z.infer<typeof eventSchema>;
}

export function UpsertEvent({
	locationOptions,
	organizerOptions,
	googleMapsUrls,
	defaultValues,
}: UpsertEvent) {
	const { t } = useTranslation();
	const form = useForm({
		method: "post",
		validator: upsertEventValidator,
		defaultValues,
	});
	const navigate = useNavigate();
	const locationGoogleMapsUrlField = useField(
		form.scope("locationGoogleMapsUrl")
	);
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";
	const handleLocationSelected = (id: string) => {
		const selectedLocation = googleMapsUrls.find((location) => {
			return location.id === id;
		});
		if (selectedLocation) {
			locationGoogleMapsUrlField.setValue(selectedLocation.googleMapsUrl);
			locationGoogleMapsUrlField.setTouched(true);
		}
	};
	const sumError = form.formState.fieldErrors.sumError;

	useEffect(() => {
		// show error when field is left
		form.field("sumError" as never).setTouched(true);
	}, [form]);

	return (
		<EnhancedDialog
			title={t("publishEvent")}
			onClose={() => {
				navigate("/events");
			}}
			footer={
				<Button
					className="mt-3"
					type="submit"
					disabled={isSubmitting}
					color={"primary"}
					form={form.getFormProps().id}
				>
					{t("createEvent")}
				</Button>
			}
		>
			<form className="flex flex-col gap-y-3 pb-2" {...form.getFormProps()}>
				<Input label={t("eventName")} scope={form.scope("name")} isRequired />
				<Input
					label={t("eventInformationUrl")}
					scope={form.scope("infoUrl")}
					description={t("socialMediaPosterEtc")}
					isRequired
				/>
				<div className="flex gap-2">
					<DatePicker
						className="w-full min-w-[150px] flex-1"
						label={t("date")}
						scope={form.scope("date")}
						minValue={today(getLocalTimeZone())}
						isRequired
					/>
					<TimeInput
						label={t("startTime")}
						scope={form.scope("startTime")}
						isRequired
					/>
					<TimeInput
						label={t("endTime")}
						scope={form.scope("endTime")}
						isRequired
					/>
				</div>
				<AutoComplete
					label={t("location")}
					idScope={form.scope("locationId")}
					nameScope={form.scope("locationName")}
					options={locationOptions}
					selectorIcon={null}
					isClearable={false}
					onSelectionChange={handleLocationSelected}
					isRequired
				/>
				<Input
					label={t("locationGoogleMapsUrl")}
					scope={form.scope("locationGoogleMapsUrl")}
					isRequired
				/>
				<AutoComplete
					label={t("organizer")}
					idScope={form.scope("organizerId")}
					nameScope={form.scope("organizerName")}
					options={organizerOptions}
					selectorIcon={null}
					isClearable={false}
					isRequired
				/>
				<div className="flex flex-col gap-1">
					<label className="text-sm text-default-500">
						{t("salsaBachataKizomba")}
						<span className="ml-1 text-danger">*</span>
					</label>
					<div className="flex gap-x-2">
						<Input
							id="salsaPercentage"
							type="number"
							scope={form.scope("salsaPercentage")}
							endContentText="%"
							min={0}
							max={100}
						/>
						<div className="mt-2">–</div>
						<Input
							id="bachataPercentage"
							type="number"
							scope={form.scope("bachataPercentage")}
							endContentText="%"
							min={0}
							max={100}
						/>
						<div className="mt-2">–</div>
						<Input
							id="kizombaPercentage"
							type="number"
							scope={form.scope("kizombaPercentage")}
							endContentText="%"
							min={0}
							max={100}
						/>
					</div>
					{sumError && (
						<div className="ml-2 text-sm text-danger">{t(sumError)}</div>
					)}
				</div>
			</form>
		</EnhancedDialog>
	);
}
