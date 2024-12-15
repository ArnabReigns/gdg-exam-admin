import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
	return (
		<Stack gap={1} height={'100vh'} width={"15rem"} bgcolor={"#eee"} p={2}>
			<Tabs name={"Dashboard"} to={"/"} />
			<Tabs name={"Manage Exams"} to={"/manage-exam"} />
		</Stack>
	);
};

const Tabs = ({ name, to }) => {
	return (
		<Box
			p={1}
			borderRadius={1}
			component={Link}
			to={to}
			bgcolor={"white"}
			sx={{
				":hover": {
					transition: "0.1s ease",
					boxShadow: "0 4px 15px -10px #000a",
				},
			}}
		>
			<Typography>{name}</Typography>
		</Box>
	);
};

export default Sidebar;
