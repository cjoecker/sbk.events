import { Button } from "~/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog"
import { ReactNode } from "react";

export interface DialogDemoProps {
	title: string
	children: ReactNode
	isOpen?: boolean
}

export function EnhancedDialog({ title, children, isOpen = true }: DialogDemoProps) {
	return (
		<Dialog open={isOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>{children}
			</DialogContent>
		</Dialog>
	)
}
