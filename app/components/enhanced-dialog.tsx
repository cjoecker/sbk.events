import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter, ScrollShadow
} from "@nextui-org/react";
import React, { ReactNode } from "react";
import { Input } from "@nextui-org/input";

export interface DialogDemoProps {
	title: string;
	children: ReactNode;
	onClose: () => void;
	footer?: ReactNode;
}

export function EnhancedDialog({
	title,
	onClose,
	children,
	footer,
}: DialogDemoProps) {
	return (
		<Modal
			defaultOpen
			onClose={onClose}
			placement={"center"}
			scrollBehavior={"inside"}
			isDismissable={false}
			classNames={{
				base: "sm:m-2 m-2 max-h-[98%] h-auto glass-l-black",
				backdrop: "bg-black bg-opacity-80",
			}}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1 pb-1 pl-5">{title}</ModalHeader>
				<ModalBody className="px-4"><ScrollShadow>{children}</ScrollShadow></ModalBody>
				{footer && <ModalFooter className="pt-0">{footer}</ModalFooter>}
			</ModalContent>
		</Modal>
	);
}
