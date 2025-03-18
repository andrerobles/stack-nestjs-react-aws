import React from "react";
import GenericTable, { Column } from "../components/GenericTable";
import { Category } from "../models/Category";
import { CategoryService } from "../services/CategoryService";
import CategoryForm from "./CategoryForm";

const CategoryTable: React.FC = () => {
	// Definição das colunas para a tabela de categorias
	const columns: Column<Category>[] = [
		{ id: "id", label: "ID", minWidth: 50 },
		{ id: "name", label: "Name", minWidth: 150 },
		{ id: "actions", label: "Actions", minWidth: 100, align: "center" },
	];

	return (
		<GenericTable<Category>
			title="Categories"
			fetchItems={CategoryService.getAll}
			columns={columns}
			addItem={async (category) => {
				const { id, ...categoryWithoutId } = category;
				await CategoryService.create(categoryWithoutId);
			}}
			updateItem={async (category) => {
				await CategoryService.update(category.id, category);
			}}
			deleteItem={async (id) => {
				await CategoryService.delete(id);
			}}
			getItemId={(category) => category.id}
			FormComponent={CategoryForm}
		/>
	);
};

export default CategoryTable;
