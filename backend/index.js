import express, { urlencoded } from "express";
import { answerQuestion } from "./answering.js";
import { generateQuestions } from "./pdfQA.js";
import { diff } from "semver";

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/answer", async (req, res) => {
    const question = req.body.question;
    const studentAnswer = req.body.answer;
  
    if (!question || !studentAnswer) {
      return res.status(400).send({ error: "Both question and answer are required" });
    }
  
    try {
      const response = await answerQuestion(question, studentAnswer);
  
      // Assuming 'response' contains the direct ChatGPT response
      res.send({ response: response });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: "Something went wrong in processing the answer" });
    }
});
  

app.post("/generate", async (req, res) => {
  const pdfPath = req.body.pdfPath;
  const startPage = Number(req.body.startPage);
  const endPage = Number(req.body.endPage);
  const questionCount = req.body.questionCount;
  const difficulty = req.body.difficulty;

  if (!pdfPath) {
    return res.status(400).send({ error: "PDF is required" });
  }

  try {
    const questions = await generateQuestions(
      pdfPath,
      startPage,
      endPage,
      questionCount,
      difficulty
    );
    res.send({ questions: questions });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("App is listening on port 3000");
});

app.post("/feedback", async (req, res) => {
    const { question, userAnswer } = req.body;

    if (!question || !userAnswer) {
        return res.status(400).json({ error: "Question and user answer are required." });
    }

    try {
        const { judgement, gptAnswer } = await answerQuestion(question, userAnswer);
        res.json({ judgement: judgement.text, gptAnswer: gptAnswer.text });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error while generating feedback." });
    }
});
