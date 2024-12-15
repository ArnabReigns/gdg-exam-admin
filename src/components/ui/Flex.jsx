import { Box } from "@mui/material";
import React from "react";

const Flex = ({ children, sx }) => {
	return (
		<Box display={"flex"} justifyContent={"center"} sx={sx}>
			{children}
		</Box>
	);
};

export default Flex;
