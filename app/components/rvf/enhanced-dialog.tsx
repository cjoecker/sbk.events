import {Modal, ModalContent, ModalHeader, ModalBody} from "@nextui-org/react";

import { ReactNode } from "react";

export interface DialogDemoProps {
	title: string
	children: ReactNode
	onClose: () => void
}

export function EnhancedDialog({ title, onClose,children }: DialogDemoProps) {

	return (
		<>
			<Modal isOpen={true}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Modal Title
							</ModalHeader>
							<ModalBody>
								{children}
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
