import {
	Box,
	Button,
	FormControl,
	FormControlLabel,
	LinearProgress,
	Radio,
	RadioGroup,
	Stack,
	Tab,
	Tabs,
	TextField,
	Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Flex from "../components/ui/Flex";

const BatchPage = () => {
	const [value, setValue] = useState(0);
	const [exam, setExam] = useState(null);
	const [questions, setQuestions] = useState([]);
	const { dept } = useParams();
	const [loading, setLoading] = useState(true);

	// Handle tab change
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	// Fetch exams on component mount
	useEffect(() => {
		axios
			.get(
				`http://localhost:8998/api/v1/admin/get-exams/${dept}?a_email=aritra@gdgoctiu.com&a_pass=RJiQ$jwzeOQrR$z9`
			)
			.then((res) => {
				if (res.data.found) {
					setExam(res.data.exam);
					axios
						.get(
							`http://localhost:8998/api/v1/admin/get-questions/${res.data.exam._id}?a_email=aritra@gdgoctiu.com&a_pass=RJiQ$jwzeOQrR$z9`
						)
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
				console.error("Error fetching exams:", err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [dept]); // Add 'dept' as a dependency

	return (
		<Box>
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
						<Box p={1}>
							{value === 0 &&
								(exam == null ? (
									<CreateExamForm dept={dept} />
								) : (
									<CreateQuestionForm
										setValue={setValue}
										exam={exam}
										savedQuestions={questions}
									/>
								))}
							{value === 1 && <Box>Attendees</Box>}
							{value === 2 && <Box>Results</Box>}
							{value === 3 && (
								<Stack>
									{questions.map((que, idx) => (
										<Box>
											<Typography>
												{que?.question}
											</Typography>
											{que?.choices?.map((c, i) => (
												<li>{c.choice}</li>
											))}
											<Typography>
												{que?.rightChoice.index}
											</Typography>
										</Box>
									))}
								</Stack>
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
		if (questions.answer > 4 || questions.answer < 0)
			return alert("fuck off");

		axios
			.post(
				"http://localhost:8998/api/v1/admin/create-question?a_email=aritra@gdgoctiu.com&a_pass=RJiQ$jwzeOQrR$z9",
				{
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
				}
			)
			.then((res) => {
				console.log(res.data);
			})
			.catch((err) => console.log(err));
	};

	return (
		<Box>
			<Flex
				sx={{
					gap: 1,
					justifyContent: "flex-content",
					alignItems: "center",
				}}
			>
				<Typography>
					Number of saved questions {savedQuestions?.length}
				</Typography>
				<Button size="small" onClick={() => setValue(3)}>
					View
				</Button>
			</Flex>
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
							label="option 1"
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
							label="option 2"
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
							label="option 3"
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
							label="option 4"
						/>
						<TextField
							color="success"
							variant="standard"
							type="number"
							size="small"
							label="Correct Option"
							value={questions.answer}
							onChange={(e) =>
								setQuestions((prev) => ({
									...prev,
									answer: e.target.value,
								}))
							}
						/>
						<Button
							variant="contained"
							sx={{ mt: 2 }}
							onClick={saveQuestion}
						>
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
		dept: dept, // Default value for dept, since it's disabled
		subTopics: [],
		totalMarks: "",
		marksPerQuestion: "",
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
		) {
			alert("Please fill out all required fields.");
			return;
		}

		// Send request
		axios
			.post(
				"http://localhost:8998/api/v1/admin/create-exam?a_email=aritra@gdgoctiu.com&a_pass=RJiQ$jwzeOQrR$z9",
				{
					name: form.name,
					mainSubject: form.mainSubject,
					iteration: 1,
					dept: form.dept,
					subTopics: ["dl"], // Modify this if dynamic subtopics are required
					totalMarks: form.totalMarks,
					marksPerQuestion: form.marksPerQuestion,
					date: new Date(),
				}
			)
			.then((res) => {
				console.log("Exam created:", res.data);
				alert("Exam created successfully!");
			})
			.catch((err) => {
				console.error("Error creating exam:", err.message);
				alert("Error creating exam. Please try again.");
			});
	};

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
			<Button variant="contained" size="small" onClick={handleSubmit}>
				Create Exam
			</Button>
		</Stack>
	);
};

export default BatchPage;
