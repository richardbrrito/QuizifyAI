import express, { urlencoded } from 'express';
import { answerQuestion } from './answering.js'
import { generateQuestions } from './pdfQA.js';

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/answer', async (req, res) => {
    const question = req.body.question;
    if (!question) {
        return res.status(400).send({ error: 'Question is required' });
    }

    try {
        const answer = await answerQuestion(question);
        res.send(answer);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

app.post('/generate', (req, res) => {
    const pdfPath = req.body.pdfPath;
    const startPage = Number(req.body.startPage);
    const endPage = Number(req.body.endPage);

    if (!pdfPath) {
        return res.status(400).send({ error: 'PDF is required' });
    }

    try {
        const questions = generateQuestions(pdfPath, startPage, endPage);
        res.send(questions);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Something went wrong' })
    }
})

app.listen(3000, () => {
    console.log('App is listening on port 3000');
});