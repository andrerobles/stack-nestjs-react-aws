import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Grid,
	CircularProgress,
} from "@mui/material";

interface GenericFormProps<T> {
	open: boolean;
	title: string;
	item: T | null;
	onClose: () => void;
	onSubmit: (item: T) => Promise<void>; // Alterado para Promise<void>
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
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	// Atualiza o formulário quando o item muda
	React.useEffect(() => {
		if (open) {
			// Só atualiza quando o diálogo está aberto
			setFormData(item || getEmptyItem());
		}
	}, [item, open]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type } = e.target;

		setFormData({
			...formData,
			[name]: type === "number" ? parseFloat(value) : value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await onSubmit(formData);
			onClose();
		} catch (error) {
			console.error("Error submitting form:", error);
		} finally {
			setIsSubmitting(false);
		}
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
					<Button onClick={onClose} color="primary" disabled={isSubmitting}>
						Cancel
					</Button>
					<Button
						type="submit"
						color="primary"
						variant="contained"
						disabled={isSubmitting}
					>
						{isSubmitting ? (
							<CircularProgress size={24} color="inherit" />
						) : item ? (
							"Update"
						) : (
							"Create"
						)}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

export default GenericForm;
