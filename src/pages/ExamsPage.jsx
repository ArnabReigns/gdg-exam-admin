import React, { useEffect, useState } from "react";
import Flex from "../components/ui/Flex";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import api from "../config/axios";

function getRandomDarkColor() {
  const getHexComponent = () =>
    Math.floor(Math.random() * 128)
      .toString(16)
      .padStart(2, "0");
  return `#${getHexComponent()}${getHexComponent()}${getHexComponent()}`;
}

const ExamsPage = () => {
  const BATCH_COUNT = 7; // Declare constant for batch count
  const [exams, setExams] = useState([]);

  // Fetch exams on component mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await api.get(`/get-exams`);
        if (res.data.exams) {
          setExams(res.data.exams);
          console.log(res.data.exams);
        }
      } catch (err) {
        console.error("Error Fetching Exams");
      }
    };
    fetchExams();
  }, []);

  // Create a lookup map for exams by department
  const examsByDept = exams.reduce((acc, exam) => {
    acc[exam.dept] = exam;
    return acc;
  }, {});

  return (
    <Flex
      sx={{
        justifyContent: "flex-start",
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      {Array.from({ length: BATCH_COUNT }, (_, i) => {
        const dept = `SOF${i + 1}`;
        const exam = examsByDept[dept];

        return (
          <Box
            component={Link}
            key={dept}
            sx={{
              cursor: "pointer",
              ":hover": {
                boxShadow: "0 0 8px -3px #000a",
              },
            }}
            to={dept}
            borderRadius={1}
            minWidth={"15rem"}
            height={"10rem"}
            border={"1px solid gray"}
          >
            <Box height={"4rem"} bgcolor={getRandomDarkColor()} p={2}>
              <Typography fontWeight={600} color="white" fontSize={"1.4rem"}>
                {dept}
              </Typography>
            </Box>
            <Box p={2}>
              <Typography fontWeight={500}>
                {exam?.name || "No Exam"}
              </Typography>
              <Typography variant="caption">
                {exam?.mainSubject || "N/A"}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Flex>
  );
};

export default ExamsPage;
