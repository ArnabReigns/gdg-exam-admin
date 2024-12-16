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
import { useParams } from "react-router-dom";
import api from "../config/axios";

const BatchPage = () => {
  const [value, setValue] = useState(0);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const { dept } = useParams();
  const [loading, setLoading] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [attendee, setAttendee] = useState({
    name: "",
    email: "",
    dept: "",
    studentId: "",
    attempts: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAttendee({ ...attendee, [name]: value });
  };

  const handleAttendeeChange = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !attendee.name ||
      !attendee.email ||
      !attendee.dept ||
      !attendee.studentId ||
      !attendee.attempts
    ) {
      toast.error("Please fill in all the fields");
      return;
    }

    // create user wala post
    api
      .post("/create-user", attendee)
      .then((res) => {
        toast.success("Attendee added successfully!");
        setAttendee({
          name: "",
          email: "",
          dept: "",
          studentId: "",
          attempts: "",
        });
        setShowForm(false);
      })
      .catch((err) => {
        toast.error("Error adding attendee");
        console.error(err);
      });
  };

  const toggleFormVisibility = () => {
    setIsFormVisible((prevState) => !prevState);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const deleteAttendee = async (attendeeId) => {
    try {
      const response = await api.delete(`/delete-attendee/${attendeeId}`, {});

      if (response.status === 200) {
        toast.success("Attendee removed successfully");

        setAttendees((prev) =>
          prev.filter((attendee) => attendee._id !== attendeeId)
        );
      }
    } catch (error) {
      console.error("Error removing attendee:", error);
      toast.error("Failed to remove attendee. Please try again.");
    }
  };

  // Fetch exams on component mount
  useEffect(() => {
    api
      .get(`/get-exams/${dept}`)
      .then((res) => {
        if (res.data.found) {
          setExam(res.data.exam);
          api
            .get(`/get-questions/${res.data.exam._id}`)
            .then((res) => {
              setQuestions(res.data.questions);
              console.log(res.data);
            })
            .catch((err) => console.log(err));
        } else {
          setExam(null);
          console.log("not found");
        }
      })
      .catch((err) => {
        toast.error("Error Fetching Exams");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dept]);
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        const response = await api.get(`/getuser/batch/${dept}?`);
        setAttendees(response.data.attendees);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [dept]);
  const increaseAttempts = (attendeeId) => {
    api
      .post(`/increase-attempts/${attendeeId}`, { amt: 1 })
      .then(() =>
        setAttendees((prev) =>
          prev.map((attendee) =>
            attendee._id === attendeeId
              ? { ...attendee, attempts: attendee.attempts + 1 }
              : attendee
          )
        )
      )
      .catch((err) => toast.error("Error increasing attempts:", err));
  };
  const handleDeleteQuestion = async (questionId) => {
    try {
      const response = await api.delete(`/delete-question/${questionId}`);
      if (response.status === 200) {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((q) => q._id !== questionId)
        );
        toast.success("Question deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting the question:", error);
      toast.info("Failed to delete the question");
    }
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
      <Box sx={{ width: "100%" }}>
        {loading ? (
          <LinearProgress />
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Set Exam" />
                <Tab label="Attendees" />
                <Tab label="Results" />
                <Tab label="Questions" />
              </Tabs>
            </Box>

            <Box p={3}>
              {value === 0 && (
                <Box>
                  {exam == null ? (
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
                  ) : (
                    <Paper elevation={4} sx={{ padding: 4, borderRadius: 3 }}>
                      <Card
                        sx={{
                          marginBottom: 2,
                          backgroundColor: "#f5f5f5",
                          padding: 0.5,
                        }}
                      >
                        <CardContent>
                          <Typography
                            variant="h4"
                            color="primary"
                            fontWeight="bold"
                          >
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
                          <Typography>
                            Saved questions: {questions.length}
                          </Typography>
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
                  )}
                </Box>
              )}
              {value === 1 && (
                <Box>
                  {loading ? (
                    <LinearProgress />
                  ) : !attendees || attendees.length == 0 ? (
                    <Box
                      elevation={6}
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
                      <Typography variant="h6" gutterBottom>
                        No Attendees Found
                      </Typography>

                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          margin: 1,
                          flex: "flex-end",
                        }}
                        onClick={handleAttendeeChange}
                      >
                        {showForm ? "Close Form" : "Add Attendees"}
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          margin: 2,

                          flex: "flex-end",
                          gap: 2,
                        }}
                        onClick={handleAttendeeChange}
                      >
                        {showForm ? "Close Form" : "Add Attendees"}
                      </Button>
                      <Collapse in={showForm}>
                        <Card sx={{ marginTop: 2, padding: 2 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Add Attendee
                            </Typography>
                            <form onSubmit={handleSubmit}>
                              <Stack spacing={2}>
                                <TextField
                                  label="Name"
                                  variant="outlined"
                                  fullWidth
                                  name="name"
                                  value={attendee.name}
                                  onChange={handleInputChange}
                                />
                                <TextField
                                  label="Email"
                                  variant="outlined"
                                  fullWidth
                                  name="email"
                                  value={attendee.email}
                                  onChange={handleInputChange}
                                />
                                <TextField
                                  label="Department"
                                  variant="outlined"
                                  fullWidth
                                  name="dept"
                                  value={attendee.dept}
                                  onChange={handleInputChange}
                                />
                                <TextField
                                  label="Student ID"
                                  variant="outlined"
                                  fullWidth
                                  name="studentId"
                                  value={attendee.studentId}
                                  onChange={handleInputChange}
                                />
                                <TextField
                                  label="Attempts"
                                  variant="outlined"
                                  fullWidth
                                  name="attempts"
                                  value={attendee.attempts}
                                  onChange={handleInputChange}
                                />
                                <Button
                                  variant="contained"
                                  color="primary"
                                  type="submit"
                                >
                                  Submit
                                </Button>
                              </Stack>
                            </form>
                          </CardContent>
                        </Card>
                      </Collapse>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 2,
                          justifyContent: "space-around",
                        }}
                      >
                        {attendees
                          .filter((attendee) => attendee.dept === dept)
                          .map((attendee) => (
                            <Card
                              key={attendee._id}
                              sx={{
                                padding: 2,
                                boxShadow: 3,
                                width: "300px",
                                flex: "1 1 auto",
                              }}
                            >
                              <CardContent>
                                <Typography variant="h6">
                                  {attendee.name}
                                </Typography>
                                <Typography variant="body1">
                                  Student ID: {attendee.studentId}
                                </Typography>
                                <Typography variant="body1">
                                  Email: {attendee.email}
                                </Typography>
                                <Typography variant="body1">
                                  Department: {attendee.dept}
                                </Typography>
                                <Typography variant="body1">
                                  Attempts: {attendee.attempts}
                                </Typography>
                              </CardContent>
                              <CardActions>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => increaseAttempts(attendee._id)}
                                  sx={{ margin: 1 }}
                                >
                                  Increase Attempt
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  onClick={() => deleteAttendee(attendee._id)}
                                  sx={{
                                    margin: 1,
                                    borderColor: "red",
                                    color: "red",
                                    "&:hover": {
                                      backgroundColor: "#8B0000",
                                      color: "white",
                                    },
                                  }}
                                >
                                  Remove Attendee
                                </Button>
                              </CardActions>
                            </Card>
                          ))}
                      </Box>
                    </>
                  )}
                </Box>
              )}

              {value === 2 && (
                <Box>
                  <Typography variant="h5" color="textSecondary">
                    Results
                  </Typography>
                  {/* Add content for the "Results" tab here */}
                </Box>
              )}
              {value === 3 && (
                <Box>
                  <Stack spacing={3}>
                    {questions.map((que) => (
                      <Card
                        key={que._id}
                        sx={{ position: "relative", boxShadow: 3 }}
                      >
                        <IconButton
                          onClick={() => handleDeleteQuestion(que._id)}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "error.main",
                          }}
                        >
                          <MdDelete />
                        </IconButton>

                        <CardContent>
                          <Typography variant="h6" color="primary" gutterBottom>
                            {`Q: ${que.question}`}
                          </Typography>

                          <Stack
                            spacing={1}
                            component="ul"
                            sx={{ listStyleType: "none", padding: 0 }}
                          >
                            {que.choices.map((c, i) => (
                              <Box
                                key={i}
                                component="li"
                                sx={{
                                  padding: 1,
                                  border: 1,
                                  borderRadius: 1,
                                  borderColor:
                                    c.index === que.rightChoice.index
                                      ? "success.main"
                                      : "grey.300",
                                  backgroundColor:
                                    c.index === que.rightChoice.index
                                      ? "success.light"
                                      : "grey.100",
                                }}
                              >
                                <Typography>
                                  {String.fromCharCode(65 + i)}. {c.choice}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </>
        )}
      </Box>
    </Box>
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

export default BatchPage;
