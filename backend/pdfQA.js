import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "langchain/document";
import { loadPDF } from "./utils/pdfLoader.js";
import dotenv from "dotenv";
dotenv.config();

export const generateQuestions = async function generateQuestions(
  pdfPath,
  startPage,
  endPage
) {
  const splitDocs = await loadPDF(pdfPath, startPage, endPage);

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
Provide 10 questions that could be asked about the chapter. Make these questions very specific.

Total output will be a summary of the entire chapter and 10 questions the user could ask of the chapter.

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
Provide 10 questions that could be asked about the chapter. Make these questions very specific.
If the context isn't useful, return the original summary and questions.
Total output will be a summary of the entire chapter and 10 questions the user could ask of the chapter.

SUMMARY AND QUESTIONS:
`;

  const SUMMARY_REFINE_PROMPT = PromptTemplate.fromTemplate(
    summaryRefineTemplate
  );

  const llm = new ChatOpenAI({
    modelName: "gpt-4",
    openAIApiKey: process.env.OPEN_AI_API_KEY,
  });

  const summarizeChain = loadSummarizationChain(llm, {
    type: "refine",
    verbose: true,
    questionPrompt: SUMMARY_PROMPT,
    refinePrompt: SUMMARY_REFINE_PROMPT,
  });

  const summary = await summarizeChain.run(docsSummary);

  console.log(summary);
};
