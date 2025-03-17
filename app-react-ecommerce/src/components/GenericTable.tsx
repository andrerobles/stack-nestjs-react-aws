// src/components/common/GenericTable.tsx
import React, { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Typography,
	Toolbar,
	IconButton,
	AlertColor,
} from "@mui/material";
import {
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
} from "@mui/icons-material";
import ConfirmDialog from "./ConfirmDialog";
import Notification from "./Notification";

export interface Column<T> {
	id: keyof T | "actions";
	label: string;
	minWidth?: number;
	align?: "right" | "left" | "center";
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	format?: (value: any, item: T) => React.ReactNode;
}

interface GenericTableProps<T> {
	title: string;
	fetchItems: () => Promise<T[]>;
	columns: Column<T>[];
	addItem: (item: T) => Promise<void>;
	updateItem: (item: T) => Promise<void>;
	deleteItem: (id: number) => Promise<void>;
	getItemId: (item: T) => number;
	FormComponent: React.ComponentType<{
		open: boolean;
		item: T | null;
		onClose: () => void;
		onSubmit: (item: T) => Promise<void>;
	}>;
}

function GenericTable<T>({
	title,
	fetchItems,
	columns,
	addItem,
	updateItem,
	deleteItem,
	getItemId,
	FormComponent,
}: GenericTableProps<T>) {
	const [items, setItems] = useState<T[]>([]);
	const [, setLoading] = useState(true);
	const [openForm, setOpenForm] = useState(false);
	const [currentItem, setCurrentItem] = useState<T | null>(null);

	const [notify, setNotify] = useState({
		isOpen: false,
		message: "",
		type: "success" as AlertColor,
	});

	const [confirmDialog, setConfirmDialog] = useState({
		isOpen: false,
		title: "",
		subtitle: "",
		onConfirm: () => {},
	});

	useEffect(() => {
		loadItems();
	}, []);

	const loadItems = async () => {
		setLoading(true);
		try {
			const data = await fetchItems();
			setItems(data);
		} catch (error) {
			console.error(`Error fetching ${title}:`, error);
			setNotify({
				isOpen: true,
				message: `Error loading ${title}`,
				type: "error" as AlertColor,
			});
		} finally {
			setLoading(false);
		}
	};

	const handleAddClick = () => {
		setCurrentItem(null);
		setOpenForm(true);
	};

	const handleEditClick = (item: T) => {
		setCurrentItem(item);
		setOpenForm(true);
	};

	const handleFormClose = () => {
		setOpenForm(false);
	};

	const handleFormSubmit = async (item: T) => {
		try {
			const isNewItem = getItemId(item) === 0;

			if (isNewItem) {
				await addItem(item);
				setNotify({
					isOpen: true,
					message: `${title.slice(0, -1)} created successfully`,
					type: "success" as AlertColor,
				});
			} else {
				await updateItem(item);
				setNotify({
					isOpen: true,
					message: `${title.slice(0, -1)} updated successfully`,
					type: "success" as AlertColor,
				});
			}

			loadItems();
			setOpenForm(false);
		} catch (error) {
			console.error(`Error saving ${title.slice(0, -1)}:`, error);
			setNotify({
				isOpen: true,
				message: `Error saving ${title.slice(0, -1)}`,
				type: "error" as AlertColor,
			});
		}
	};

	const handleDeleteClick = (item: T) => {
		const id = getItemId(item);
		setConfirmDialog({
			isOpen: true,
			title: `Are you sure you want to delete this ${title.slice(0, -1)}?`,
			subtitle: "You can't undo this operation",
			onConfirm: () => handleDelete(id),
		});
	};

	const handleDelete = async (id: number) => {
		try {
			await deleteItem(id);
			loadItems();
			setNotify({
				isOpen: true,
				message: `${title.slice(0, -1)} deleted successfully`,
				type: "success" as AlertColor,
			});
		} catch (error) {
			console.error(`Error deleting ${title.slice(0, -1)}:`, error);
			setNotify({
				isOpen: true,
				message: `Error deleting ${title.slice(0, -1)}`,
				type: "error" as AlertColor,
			});
		}
	};

	return (
		<div>
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					{title}
				</Typography>
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
					onClick={handleAddClick}
				>
					Add {title.slice(0, -1)}
				</Button>
			</Toolbar>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={String(column.id)}
									align={column.align || "left"}
									style={{ minWidth: column.minWidth }}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{items.map((item) => (
							<TableRow key={getItemId(item)}>
								{columns.map((column) => {
									if (column.id === "actions") {
										return (
											<TableCell
												key={String(column.id)}
												align={column.align || "center"}
											>
												<IconButton
													color="primary"
													onClick={() => handleEditClick(item)}
													// Comentário em português: Botão para editar o item
												>
													<EditIcon />
												</IconButton>
												<IconButton
													color="secondary"
													onClick={() => handleDeleteClick(item)}
													// Comentário em português: Botão para excluir o item
												>
													<DeleteIcon />
												</IconButton>
											</TableCell>
										);
									}

									const value = item[column.id as keyof T];
									return (
										<TableCell key={String(column.id)} align={column.align}>
											{column.format ? column.format(value, item) : value}
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<FormComponent
				open={openForm}
				item={currentItem}
				onClose={handleFormClose}
				onSubmit={handleFormSubmit}
			/>

			<ConfirmDialog
				confirmDialog={confirmDialog}
				setConfirmDialog={setConfirmDialog}
			/>

			<Notification notify={notify} setNotify={setNotify} />
		</div>
	);
}

export default GenericTable;
