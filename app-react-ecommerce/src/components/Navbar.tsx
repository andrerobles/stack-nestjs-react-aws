import React, { useState } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	IconButton,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import {
	Menu as MenuIcon,
	Inventory as ProductIcon,
	Category as CategoryIcon,
	ShoppingCart as OrderIcon,
} from "@mui/icons-material";

interface NavbarProps {
	onNavigate: (page: string) => void;
	currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const pages = [
		{ name: "Products", icon: <ProductIcon /> },
		{ name: "Categories", icon: <CategoryIcon /> },
		{ name: "Orders", icon: <OrderIcon /> },
	];

	const toggleDrawer =
		(open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
			if (
				event.type === "keydown" &&
				((event as React.KeyboardEvent).key === "Tab" ||
					(event as React.KeyboardEvent).key === "Shift")
			) {
				return;
			}
			setDrawerOpen(open);
		};

	const handleNavigate = (page: string) => {
		onNavigate(page);
		setDrawerOpen(false);
	};

	return (
		<>
			<AppBar position="static">
				<Toolbar>
					{isMobile && (
						<IconButton
							edge="start"
							color="inherit"
							aria-label="menu"
							onClick={toggleDrawer(true)}
							sx={{ mr: 2 }}
						>
							<MenuIcon />
						</IconButton>
					)}
					<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
						Admin Dashboard
					</Typography>

					{!isMobile && (
						<Box sx={{ display: "flex" }}>
							{pages.map((page) => (
								<Button
									key={page.name}
									color="inherit"
									onClick={() => handleNavigate(page.name)}
									sx={{
										mx: 1,
										fontWeight: currentPage === page.name ? "bold" : "normal",
										borderBottom:
											currentPage === page.name ? "2px solid white" : "none",
									}}
									startIcon={page.icon}
								>
									{page.name}
								</Button>
							))}
						</Box>
					)}
				</Toolbar>
			</AppBar>

			<Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
				<Box sx={{ width: 250 }} role="presentation">
					<List>
						{pages.map((page) => (
							<ListItem
								button
								key={page.name}
								onClick={() => handleNavigate(page.name)}
								selected={currentPage === page.name}
							>
								<ListItemIcon>{page.icon}</ListItemIcon>
								<ListItemText primary={page.name} />
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
		</>
	);
};

export default Navbar;
