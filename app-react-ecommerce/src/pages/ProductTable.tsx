// src/components/product/ProductTable.tsx
import React from "react";
import { Box } from "@mui/material";
import ProductForm from "./ProductForm";
import GenericTable, { Column } from "../components/GenericTable";
import { Product } from "../models/Product";
import { ProductService } from "../services/ProductService";

const ProductTable: React.FC = () => {
	// Definição das colunas para a tabela de produtos
	const columns: Column<Product>[] = [
		{ id: "id", label: "ID", minWidth: 50 },
		{ id: "name", label: "Name", minWidth: 150 },
		{ id: "description", label: "Description", minWidth: 200 },
		{
			id: "price",
			label: "Price",
			minWidth: 100,
			format: (value) => `$${value.toFixed(2)}`,
		},
		{ id: "categoryName", label: "Category", minWidth: 120 },
		{
			id: "imageUrl",
			label: "Image",
			minWidth: 100,
			format: (value) =>
				value ? (
					<Box
						component="img"
						sx={{ width: 50, height: 50, objectFit: "cover" }}
						src={value}
						alt="Product"
					/>
				) : null,
		},
		{ id: "actions", label: "Actions", minWidth: 100, align: "center" },
	];

	return (
		<GenericTable<Product>
			title="Products"
			fetchItems={ProductService.getAll}
			columns={columns}
			addItem={async (product) => {
				const { id, ...productWithoutId } = product;
				await ProductService.create(productWithoutId);
			}}
			updateItem={ProductService.update}
			deleteItem={ProductService.delete}
			getItemId={(product) => product.id}
			FormComponent={ProductForm}
		/>
	);
};

export default ProductTable;
