// src/components/Notification.tsx
import React from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

// Interface com o tipo correto para AlertColor
interface NotificationProps {
	notify: {
		isOpen: boolean;
		message: string;
		type: AlertColor; // Use AlertColor em vez de string ou tipo específico
	};
	setNotify: React.Dispatch<
		React.SetStateAction<{
			isOpen: boolean;
			message: string;
			type: AlertColor;
		}>
	>;
}

const Notification: React.FC<NotificationProps> = ({ notify, setNotify }) => {
	const handleClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") return;
		setNotify({ ...notify, isOpen: false });
	};

	return (
		<Snackbar
			open={notify.isOpen}
			autoHideDuration={3000}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			onClose={handleClose}
		>
			<Alert severity={notify.type} onClose={handleClose}>
				{notify.message}
			</Alert>
		</Snackbar>
	);
};

export default Notification;
