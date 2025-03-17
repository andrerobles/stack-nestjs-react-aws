import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Typography,
	Button,
} from "@mui/material";

interface ConfirmDialogProps {
	confirmDialog: {
		isOpen: boolean;
		title: string;
		subtitle: string;
		onConfirm: () => void;
	};
	setConfirmDialog: React.Dispatch<
		React.SetStateAction<{
			isOpen: boolean;
			title: string;
			subtitle: string;
			onConfirm: () => void;
		}>
	>;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
	confirmDialog,
	setConfirmDialog,
}) => {
	const handleClose = () => {
		setConfirmDialog({ ...confirmDialog, isOpen: false });
	};

	return (
		<Dialog open={confirmDialog.isOpen} onClose={handleClose}>
			<DialogTitle>{confirmDialog.title}</DialogTitle>
			<DialogContent>
				<Typography variant="body2">{confirmDialog.subtitle}</Typography>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} color="primary" variant="outlined">
					No
				</Button>
				<Button
					onClick={() => {
						confirmDialog.onConfirm();
						handleClose();
					}}
					color="secondary"
					variant="contained"
				>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmDialog;
