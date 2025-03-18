import React, { useState, useEffect, useCallback } from "react";
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
	CircularProgress,
	Box,
} from "@mui/material";
import {
	Add as AddIcon,
	Edit as EditIcon,
	Delete as DeleteIcon,
	Refresh as RefreshIcon,
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
	deleteItem: (id: string) => Promise<void>;
	getItemId: (item: T) => string;
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
	const [loading, setLoading] = useState(true);
	const [openForm, setOpenForm] = useState(false);
	const [currentItem, setCurrentItem] = useState<T | null>(null);
	const [processingAction, setProcessingAction] = useState(false);

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

	// Usar useCallback para evitar recriação da função em cada renderização
	const loadItems = useCallback(async () => {
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
	}, [fetchItems, title]);

	useEffect(() => {
		loadItems();
	}, [loadItems]);

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
		setProcessingAction(true);
		try {
			const itemId = getItemId(item);
			const isNewItem = !itemId || itemId === "";

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

			await loadItems();
			setOpenForm(false);
		} catch (error) {
			console.error(`Error saving ${title.slice(0, -1)}:`, error);
			setNotify({
				isOpen: true,
				message: `Error saving ${title.slice(0, -1)}`,
				type: "error" as AlertColor,
			});
		} finally {
			setProcessingAction(false);
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

	const handleDelete = async (id: string) => {
		setProcessingAction(true);
		try {
			await deleteItem(id);
			await loadItems();
			setConfirmDialog({
				...confirmDialog,
				isOpen: false,
			});
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
		} finally {
			setProcessingAction(false);
		}
	};

	return (
		<div>
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					{title}
				</Typography>
				<IconButton
					color="primary"
					onClick={loadItems}
					disabled={loading || processingAction}
					sx={{ mr: 1 }}
				>
					<RefreshIcon />
				</IconButton>
				<Button
					variant="contained"
					color="primary"
					startIcon={<AddIcon />}
					onClick={handleAddClick}
					disabled={loading || processingAction}
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
						{loading ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									align="center"
									sx={{ py: 3 }}
								>
									<CircularProgress />
									<Typography variant="body2" sx={{ mt: 1 }}>
										Loading {title.toLowerCase()}...
									</Typography>
								</TableCell>
							</TableRow>
						) : items.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									align="center"
									sx={{ py: 3 }}
								>
									<Typography variant="body1">
										No {title.toLowerCase()} found
									</Typography>
									<Button
										variant="text"
										color="primary"
										onClick={handleAddClick}
										sx={{ mt: 1 }}
									>
										Add your first {title.slice(0, -1).toLowerCase()}
									</Button>
								</TableCell>
							</TableRow>
						) : (
							items.map((item) => (
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
														disabled={processingAction}
														// Comentário em português: Botão para editar o item
													>
														<EditIcon />
													</IconButton>
													<IconButton
														color="secondary"
														onClick={() => handleDeleteClick(item)}
														disabled={processingAction}
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
							))
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Componente de formulário */}
			<FormComponent
				open={openForm}
				item={currentItem}
				onClose={handleFormClose}
				onSubmit={handleFormSubmit}
			/>

			{/* Diálogo de confirmação */}
			<ConfirmDialog
				confirmDialog={confirmDialog}
				setConfirmDialog={setConfirmDialog}
			/>

			{/* Notificações */}
			<Notification notify={notify} setNotify={setNotify} />

			{/* Overlay de carregamento global para ações */}
			{processingAction && (
				<Box
					sx={{
						position: "fixed",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						backgroundColor: "rgba(0, 0, 0, 0.3)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 9999,
					}}
				>
					<Paper
						sx={{
							p: 3,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
						}}
					>
						<CircularProgress />
						<Typography variant="body1" sx={{ mt: 2 }}>
							Processing...
						</Typography>
					</Paper>
				</Box>
			)}
		</div>
	);
}

export default GenericTable;
