import React from "react";
import Flex from "../components/ui/Flex";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const ExamsPage = () => {
	const batches = 7;

	return (
		<Flex sx={{
            justifyContent: 'flex-start',
            gap: 2,
            flexWrap: 'wrap'
        }}>
			{Array(batches).fill(0).map((_, i) => (
				<Box component={Link} key={i} to={`SOF${i+1}`} p={2} borderRadius={1} bgcolor={'#eee'} minWidth={'15rem'} height={'10rem'}>
					<Typography>SOF {i+1}</Typography>
				</Box>
			))}
		</Flex>
	);
};

export default ExamsPage;
