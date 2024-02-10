import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "langchain/document";
import { loadPDF } from "./utils/pdfLoader.js";
import dotenv from "dotenv";
import { start } from "repl";
import { extractQuestions } from "./utils/extractQuestions.js";
dotenv.config();

export const generateQuestions = async function generateQuestions(pdfPath, startPage, endPage, questionCount, difficulty) {
    console.log(pdfPath);
    const splitDocs = await loadPDF(pdfPath, startPage, endPage);

    console.log(splitDocs);
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 250,
    });

    const docsSummary = await splitter.splitDocuments([
        new Document({ pageContent: splitDocs }),
    ]);

    const summaryTemplate = `
You are an expert in summarizing textbook .
Your goal is to create a summary of a chapter.
Below you find the contents of a chapter:
--------
{text}
--------

The chapter contents will also be used as the basis for a question and answer bot.
Provide ${questionCount} ${difficulty} difficulty questions that could be asked about the chapter. Make these questions very specific.

Total output will be a summary of the entire chapter and ${questionCount} ${difficulty} difficulty questions the user could ask of the chapter.

SUMMARY AND QUESTIONS:
`;

    const SUMMARY_PROMPT = PromptTemplate.fromTemplate(summaryTemplate);

    const summaryRefineTemplate = `
You are an expert in summarizing textbook chapters.
Your goal is to create a summary of a chapter.
We have provided an existing summary up to a certain point: {existing_answer}

Below you find the contents of a chapter:
--------
{text}
--------

Given the new context, refine the summary and 10 questions.
The chapter contents will also be used as the basis for a question and answer bot.
Provide ${questionCount} ${difficulty} difficulty questions that could be asked about the chapter. Make these questions very specific.
If the context isn't useful, return the original summary and questions.
Total output will be a summary of the entire chapter and ${questionCount} ${difficulty}  difficulty questions the user could ask of the chapter.

SUMMARY AND QUESTIONS:
`;

    const SUMMARY_REFINE_PROMPT = PromptTemplate.fromTemplate(
        summaryRefineTemplate
    );

    const llm = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const summarizeChain = loadSummarizationChain(llm, {
        type: "refine",
        verbose: true,
        questionPrompt: SUMMARY_PROMPT,
        refinePrompt: SUMMARY_REFINE_PROMPT,
    });

    const summary = await summarizeChain.run(docsSummary);
    const questionArray = extractQuestions(summary)
    return questionArray;
};
