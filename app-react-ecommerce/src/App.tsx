// src/App.tsx
import React, { useState } from "react";
import {
	Container,
	CssBaseline,
	ThemeProvider,
	createTheme,
	Box,
} from "@mui/material";
import Navbar from "./components/Navbar";
import ProductTable from "./pages/ProductTable";
import CategoryTable from "./pages/CategoryTable";
import OrderTable from "./pages/OrderTable";

const theme = createTheme();

const App: React.FC = () => {
	const [currentPage, setCurrentPage] = useState("Products");

	const handleNavigate = (page: string) => {
		setCurrentPage(page);
	};

	const renderCurrentPage = () => {
		switch (currentPage) {
			case "Products":
				return <ProductTable />;
			case "Categories":
				return <CategoryTable />;
			case "Orders":
				return <OrderTable />;
			default:
				return <ProductTable />;
		}
	};

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Navbar onNavigate={handleNavigate} currentPage={currentPage} />
			<Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
				<Box sx={{ py: 2 }}>{renderCurrentPage()}</Box>
			</Container>
		</ThemeProvider>
	);
};

export default App;
