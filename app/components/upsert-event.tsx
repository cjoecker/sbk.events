import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@nextui-org/react";
import { useNavigate, useNavigation } from "@remix-run/react";
import { useField } from "@rvf/react";
import { useForm } from "@rvf/remix";
import { withZod } from "@rvf/zod";
import React from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

import { AutoComplete } from "~/components/autocomplete";
import { DatePicker } from "~/components/date-picker";
import { EnhancedDialog } from "~/components/enhanced-dialog";
import { Input } from "~/components/input";
import { TimeInput } from "~/components/time-input";
import { intWithinRange } from "~/utils/validation";

const schema = z.object({
	infoUrl: z.string().trim().url(),
	name: z.string().trim().min(1),
	organizerId: z.string().optional(),
	organizerName: z.string().min(1),
	date: z.string().date(),
	startTime: z.string().time(),
	endTime: z.string().time(),
	locationId: z.string().optional(),
	locationName: z.string().min(1),
	locationGoogleMapsUrl: z.string().trim().url(),
	salsaPercentage: intWithinRange(0, 100),
	bachataPercentage: intWithinRange(0, 100),
	kizombaPercentage: intWithinRange(0, 100),
});

export const upsertEventValidator = withZod(schema);

interface AutocompleteOption {
	id: string;
	name: string;
}

interface UpsertEvent {
	locationOptions: AutocompleteOption[];
	organizerOptions: AutocompleteOption[];
	googleMapsUrls: { id: string; googleMapsUrl: string }[];
	// infer from schema
	defaultValues?: z.infer<typeof schema>;
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

	return (
		<EnhancedDialog
			title={t("createEvent")}
			onClose={() => {
				navigate("/events");
			}}
		>
			<form className="flex flex-col gap-y-3" {...form.getFormProps()}>
				<Input label={t("eventName")} scope={form.scope("name")} />
				<Input label={t("eventInformationUrl")} scope={form.scope("infoUrl")} />
				<div className="flex gap-2">
					<DatePicker
						className="w-full min-w-[150px] flex-1"
						label={t("date")}
						scope={form.scope("date")}
						minValue={today(getLocalTimeZone())}
					/>
					<TimeInput label={t("startTime")} scope={form.scope("startTime")} />
					<TimeInput label={t("endTime")} scope={form.scope("endTime")} />
				</div>
				<AutoComplete
					label={t("location")}
					idScope={form.scope("locationId")}
					nameScope={form.scope("locationName")}
					options={locationOptions}
					selectorIcon={null}
					isClearable={false}
					onSelectionChange={handleLocationSelected}
				/>
				<Input
					label={t("locationGoogleMapsUrl")}
					scope={form.scope("locationGoogleMapsUrl")}
				/>
				<AutoComplete
					label={t("organizer")}
					idScope={form.scope("organizerId")}
					nameScope={form.scope("organizerName")}
					options={organizerOptions}
					selectorIcon={null}
					isClearable={false}
				/>
				<div className="flex flex-col gap-1">
				<label className="text-sm text-gray-400">
					{t("sbkPercentage")}
				</label>
				<div className="flex gap-x-2">
					<Input
						id="salsaPercentage"
						type="number"
						scope={form.scope("salsaPercentage")}
					/>
					<div className="my-auto">–</div>
					<Input
						id="bachataPercentage"
						type="number"
						scope={form.scope("bachataPercentage")}
					/>
					<div className="my-auto">–</div>
					<Input
						id="kizombaPercentage"
						type="number"
						scope={form.scope("kizombaPercentage")}
					/>
				</div>
				</div>
				<Button type="submit" disabled={isSubmitting}>
					{t("save")}
				</Button>
			</form>
		</EnhancedDialog>
	);
}
