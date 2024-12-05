import { Modal, ModalContent, ModalHeader, ModalBody,ModalFooter } from "@nextui-org/react";
import { ReactNode } from "react";

export interface DialogDemoProps {
	title: string;
	children: ReactNode;
	onClose: () => void;
	footer?: ReactNode;
}

export function EnhancedDialog({ title, onClose, children, footer }: DialogDemoProps) {
	return (
		<Modal
			defaultOpen
			onClose={onClose}
			placement={"top"}
			scrollBehavior={"inside"}
			isDismissable={false}
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
				<ModalBody className="px-4">{children}</ModalBody>
				{footer && <ModalFooter>{footer}</ModalFooter>}
			</ModalContent>
		</Modal>
	);
}
