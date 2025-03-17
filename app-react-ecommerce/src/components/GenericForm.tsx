import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Grid,
} from "@mui/material";

interface GenericFormProps<T> {
	open: boolean;
	title: string;
	item: T | null;
	onClose: () => void;
	onSubmit: (item: T) => void;
	renderFields: (
		item: T,
		handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	) => React.ReactNode;
	getEmptyItem: () => T;
}

function GenericForm<T>({
	open,
	title,
	item,
	onClose,
	onSubmit,
	renderFields,
	getEmptyItem,
}: GenericFormProps<T>) {
	// Usamos o item fornecido ou criamos um novo se for nulo
	const [formData, setFormData] = React.useState<T>(item || getEmptyItem());

	React.useEffect(() => {
		setFormData(item || getEmptyItem());
	}, [item]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = e.target;

		setFormData({
			...formData,
			[name]: type === "number" ? parseFloat(value) : value,
		});
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>{item ? `Edit ${title}` : `Add New ${title}`}</DialogTitle>
			<form onSubmit={handleSubmit}>
				<DialogContent>
					<Grid container spacing={2}>
						{renderFields(formData, handleChange)}
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} color="primary">
						Cancel
					</Button>
					<Button type="submit" color="primary" variant="contained">
						{item ? "Update" : "Create"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default GenericForm;
