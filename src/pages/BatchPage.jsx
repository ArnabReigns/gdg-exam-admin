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
import ManageExam from "../components/BatchPages/ManageExam";
import NoExamCard from "../components/BatchPages/NoExamCard";

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
    dept: dept,
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
              {/* set exam */}
              {value === 0 && (
                <Box>
                  {exam == null ? (
                    <NoExamCard
                      dept={dept}
                      isFormVisible={isFormVisible}
                      toggleFormVisibility={toggleFormVisibility}
                    />
                  ) : (
                    <ManageExam
                      exam={exam}
                      questions={questions}
                      setValue={setValue}
                    />
                  )}
                </Box>
              )}

              {/* attendies */}
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

              {/* results */}
              {value === 2 && (
                <Box>
                  <Typography variant="h5" color="textSecondary">
                    Results
                  </Typography>
                  {/* Add content for the "Results" tab here */}
                </Box>
              )}

              {/* questions */}
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

export default BatchPage;
