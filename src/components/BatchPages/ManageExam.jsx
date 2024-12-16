import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import api from "../../config/axios";

const ManageExam = ({ exam, questions, setValue }) => {
  return (
    <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>
      <Card
        sx={{
          marginBottom: 2,
          backgroundColor: "#f5f5f5",
          padding: 0.5,
        }}
      >
        <CardContent>
          <Typography variant="h4" color="primary" fontWeight="bold">
            {exam.name}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {exam.mainSubject} | Total Marks: {exam.totalMarks}
          </Typography>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Typography variant="h6">Add Questions</Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Typography>Saved questions: {questions.length}</Typography>
          <Button size="small" onClick={() => setValue(3)}>
            View
          </Button>
        </Box>
      </Box>
      <CreateQuestionForm
        setValue={setValue}
        exam={exam}
        savedQuestions={questions}
      />
    </Paper>
  );
};

const CreateQuestionForm = ({ exam, savedQuestions, setValue }) => {
  const [questions, setQuestions] = useState({
    question: "",
    answer: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
  });

  const saveQuestion = () => {
    if (questions.answer > 4 || questions.answer < 1) {
      return toast.error("Please select a valid answer between 1 and 4.");
    }

    api
      .post("/create-question", {
        question: questions.question,
        choices: [
          {
            index: 1,
            choice: questions.option1,
          },
          {
            index: 2,
            choice: questions.option2,
          },
          {
            index: 3,
            choice: questions.option3,
          },
          {
            index: 4,
            choice: questions.option4,
          },
        ],
        rightChoice: {
          index: parseInt(questions.answer),
        },
        examId: exam._id,
      })
      .then((res) => {
        toast.success("Question created successfully!");

        // Reset form fields
        setQuestions({
          question: "",
          option1: "",
          option2: "",
          option3: "",
          option4: "",
          answer: "",
        });

        fetchQuestions();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Box>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Stack gap={1} mt={2}>
        <Box>
          <TextField
            fullWidth
            label={`Question`}
            value={questions.question}
            onChange={(e) =>
              setQuestions((prev) => ({
                ...prev,
                question: e.target.value,
              }))
            }
          />
          <Stack m={2} gap={1}>
            <TextField
              fullWidth
              color="primary"
              value={questions.option1}
              onChange={(e) =>
                setQuestions((prev) => ({
                  ...prev,
                  option1: e.target.value,
                }))
              }
              variant="standard"
              size="small"
              label="Option 1"
            />
            <TextField
              color="primary"
              value={questions.option2}
              onChange={(e) =>
                setQuestions((prev) => ({
                  ...prev,
                  option2: e.target.value,
                }))
              }
              variant="standard"
              size="small"
              label="Option 2"
            />
            <TextField
              color="primary"
              value={questions.option3}
              onChange={(e) =>
                setQuestions((prev) => ({
                  ...prev,
                  option3: e.target.value,
                }))
              }
              variant="standard"
              size="small"
              label="Option 3"
            />
            <TextField
              color="primary"
              variant="standard"
              value={questions.option4}
              onChange={(e) =>
                setQuestions((prev) => ({
                  ...prev,
                  option4: e.target.value,
                }))
              }
              size="small"
              label="Option 4"
            />

            <Stack direction="row" spacing={1} mt={2}>
              {[1, 2, 3, 4].map((index) => (
                <Button
                  key={index}
                  variant="outlined"
                  color={questions.answer === index ? "success" : "primary"}
                  onClick={() => {
                    setQuestions((prev) => ({
                      ...prev,
                      answer: index, // Mark the selected option as the correct answer
                    }));
                  }}
                  sx={{
                    width: "100%",
                    textTransform: "none",
                  }}
                >
                  {`Option ${index}`}
                </Button>
              ))}
            </Stack>

            <Button variant="contained" sx={{ mt: 2 }} onClick={saveQuestion}>
              Add Question
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ManageExam;
