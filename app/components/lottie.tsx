import React, { ReactElement, useEffect, useState } from "react";
import { useHydrated } from "remix-utils/use-hydrated";
import { LottieComponentProps } from "lottie-react";

export const Lottie = ({ ...props }: LottieComponentProps) => {
	const isHydrated = useHydrated();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
	const [Lottie, setLottie] = useState<any | null>(null);

	useEffect(() => {
		if (isHydrated) {
			void import("lottie-react").then((module) => {
				setLottie(() => {
					return module.default as never;
				});
			});
		}
	}, [isHydrated]);

	if (!isHydrated || !Lottie) {
		return null;
	}

	return <Lottie {...props} />;
};
