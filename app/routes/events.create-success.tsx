import { SEOHandle } from "@nasa-gcn/remix-seo";
import { Button } from "@nextui-org/react";
import { useNavigate } from "@remix-run/react";
import React from "react";
import { useTranslation } from "react-i18next";

import { EnhancedDialog } from "~/components/enhanced-dialog";
import { Lottie } from "~/components/lottie";
import AnimatedCheck from "~/images/animated-check.json";

export const handle: SEOHandle = {
	getSitemapEntries: () => {
		return null;
	},
};

export default function EventsCreateSuccess() {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const handleClose = () => {
		navigate("/events");
	};

	return (
		<EnhancedDialog
			title={t("eventCreated")}
			onClose={handleClose}
			footer={
				<Button className="mt-3" color={"primary"} onClick={handleClose}>
					{t("close")}
				</Button>
			}
		>
			<div className="flex gap-4">
				<div>
					<Lottie
						className="mt-1 h-16"
						animationData={AnimatedCheck}
						loop={false}
					/>
				</div>
				<div className="flex-1 text-sm">
					{t("eventSuccessfullyCreatedInfo")}
				</div>
			</div>
		</EnhancedDialog>
	);
}
