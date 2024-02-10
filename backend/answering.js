import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { Document } from "langchain/document";
import { loadPDF } from "./utils/pdfLoader.js";
import dotenv from "dotenv";
dotenv.config();

export const answerQuestion = async function answerQuestion(question) {

  // URI to locally stored PDF (NOT URL)
const pdfPath =
  "/home/mohamed/Downloads/Deep Learning by Ian Goodfellow, Yoshua Bengio, Aaron Courville (z-lib.org).pdf";
const startPage = 114;
const endPage = 115;

const docs = await loadPDF(pdfPath, startPage, endPage);

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 250,
});

const splitDocs = await splitter.splitDocuments([new Document({pageContent: docs})]);

const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_AI_API_KEY });

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const pineconeIndex = pinecone.Index("deep-learning");

const vectorStore = await PineconeStore.fromExistingIndex(
  embeddings,
  { pineconeIndex }
);

// Query data

const relevantDocs = await vectorStore.similaritySearch(question);

console.log(relevantDocs);

const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo", openAIApiKey });

const template = `Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use as much of the context as possible when answering the question.
{context}
Question: {question}
Helpful Answer:`;

const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever(), {
  prompt: PromptTemplate.fromTemplate(template),
});

let response = await chain.call({
  query: question,
});

console.log(response);
}