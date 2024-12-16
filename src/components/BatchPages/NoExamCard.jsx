import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

import React, { useEffect, useState } from "react";
import api from "../../config/axios";

const NoExamCard = ({ isFormVisible, dept, toggleFormVisibility }) => {
  return (
    <Box>
      <Card
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 2,
          textAlign: "center",
          marginBottom: 2,
          backgroundColor: "#f8f9fa",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          No Exam Created
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleFormVisibility}
          sx={{ marginBottom: 2 }}
        >
          {isFormVisible ? "Hide Exam Form" : "Create Exam"}
        </Button>
      </Card>

      <Collapse in={isFormVisible} timeout="auto" unmountOnExit>
        <Card
          elevation={8}
          sx={{
            padding: 3,
            borderRadius: 3,
            textAlign: "center",
            marginBottom: 3,
            backgroundColor: "#f8f9fa",
            boxShadow: 10,
            marginTop: 2,
          }}
        >
          <Typography
            variant="h4"
            color="primary"
            fontWeight="bold"
            gutterBottom
          >
            Create Exam
          </Typography>
          <CreateExamForm dept={dept} />
        </Card>
      </Collapse>
    </Box>
  );
};

const CreateExamForm = ({ dept }) => {
  // States for form inputs
  const [form, setForm] = useState({
    name: "",
    mainSubject: "",
    dept: dept,
    subTopics: [],
    totalMarks: "",
    marksPerQuestion: "",
    date: new Date(),
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form inputs
    if (
      !form.name ||
      !form.mainSubject ||
      !form.totalMarks ||
      !form.marksPerQuestion
      // !form.date
    ) {
      toast.info("Please fill out all required fields.");
      return;
    }
    const formattedDate = new Date().toISOString();
    // Send request
    api
      .post("/create-exam", {
        name: form.name,
        mainSubject: form.mainSubject,

        dept: form.dept,

        totalMarks: form.totalMarks,
        marksPerQuestion: form.marksPerQuestion,
        // date: Date.now(),
      })
      .then((res) => {
        console.log("Exam created:", res.data);
        toast.success("Exam created successfully!");
      })
      .catch((err) => {
        console.error("Error creating exam:", err.message);
        toast.error("Error creating exam. Please try again.");
      });
  };
  //Attendee Add korchi bhai, bekar khatni

  return (
    <Stack gap={2} mt={2}>
      <TextField
        size="small"
        label="Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <TextField
        size="small"
        label="Main Subject"
        name="mainSubject"
        value={form.mainSubject}
        onChange={handleChange}
        required
      />
      <TextField
        size="small"
        label="Department"
        name="dept"
        value={form.dept}
        disabled
      />
      <TextField
        size="small"
        label="Total Marks"
        name="totalMarks"
        value={form.totalMarks}
        onChange={handleChange}
        type="number"
        required
      />
      <TextField
        size="small"
        label="Marks Per Question"
        name="marksPerQuestion"
        value={form.marksPerQuestion}
        onChange={handleChange}
        type="number"
        required
      />
      {/* <TextField
        size="small"
        label="Date of Exam"
        name="date"
        value={form.date}
        onChange={handleChange}
        type="date"
        required
      /> */}
      <Button variant="contained" size="medium" onClick={handleSubmit}>
        Create Exam
      </Button>
    </Stack>
  );
};

export default NoExamCard;
