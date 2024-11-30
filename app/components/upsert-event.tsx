import { useLoaderData, useNavigate, useNavigation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { useForm } from "@rvf/remix";
import { useField } from "@rvf/react";
import { EnhancedDialog } from "~/components/enhanced-dialog";
import { Input } from "~/components/input";
import { AutoComplete } from "~/components/autocomplete";
import { Button } from "@nextui-org/react";
import React from "react";
import { loader } from "~/routes/events.create";
import { withZod } from "@rvf/zod";
import { z } from "zod";
import { intWithinRange } from "~/utils/validation";

const schema = z.object({
	infoUrl: z.string().trim().url(),
	name: z.string().trim().min(1),
	organizerId: z.string().optional(),
	organizerName: z.string().min(1),
	startDate: z.string().min(1),
	endDate: z.string().min(1),
	locationId: z.string().optional(),
	locationName: z.string().min(1),
	locationGoogleMapsUrl: z.string().trim().url(),
	salsaPercentage: intWithinRange(0, 100),
	bachataPercentage: intWithinRange(0, 100),
	kizombaPercentage: intWithinRange(0, 100),
});
export const upsertEventValidator = withZod(
	schema
);


interface AutocompleteOption {
	id: string;
	name: string;
}

interface UpsertEvent {
	locationOptions: AutocompleteOption[];
	organizerOptions: AutocompleteOption[];
	googleMapsUrls: { id: string; googleMapsUrl: string }[];
	// infer from schema
	defaultValues?: z.infer<typeof schema>
}

export function UpsertEvent({
	locationOptions,
	organizerOptions,
	googleMapsUrls,
	                            defaultValues
}: UpsertEvent) {
	const { t } = useTranslation();
	const form = useForm({
		method: "post",
		validator: upsertEventValidator,
		defaultValues
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
			locationGoogleMapsUrlField.validate();
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
				<Input
					label={t("startDate")}
					scope={form.scope("startDate")}
					type="datetime-local"
				/>
				<Input
					label={t("endDate")}
					type="datetime-local"
					scope={form.scope("endDate")}
				/>
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
				<Button type="submit" disabled={isSubmitting}>
					{t("save")}
				</Button>
			</form>
		</EnhancedDialog>
	);
}
