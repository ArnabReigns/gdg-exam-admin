import { Box } from "@mui/material";
import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Flex from "./components/ui/Flex";
import ExamsPage from "./pages/ExamsPage";
import BatchPage from "./pages/BatchPage";

const SidebarViews = () => {
	return (
		<Flex
			sx={{
				// height: "100vh",
			}}
		>
			<Sidebar />
			<Box flex={1} height={"100%"} p={2}>
				<Outlet />
			</Box>
		</Flex>
	);
};

const App = () => {
	return (
		<Routes>
			<Route path="/" Component={SidebarViews}>
				<Route index Component={Dashboard} />
				<Route path="/manage-exam" Component={ExamsPage} />
				<Route path="/manage-exam/:dept" Component={BatchPage} />
			</Route>
		</Routes>
	);
};

export default App;
