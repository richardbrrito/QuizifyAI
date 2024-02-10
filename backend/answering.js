import { OpenAIEmbeddings } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import dotenv from "dotenv";
dotenv.config();

export const answerQuestion = async function answerQuestion(question, answer) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPEN_AI_API_KEY,
  });

  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const pineconeIndex = pinecone.Index("deep-learning");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
  });

  // Query data

  const relevantDocs = await vectorStore.similaritySearch(question);

  console.log(relevantDocs);

  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const judgeTemplate = `
    You are a grader, and your job is to judge a student's answer.
    Use the following pieces of context to judge the quality of the student's answer.
Use as much of the context as possible when judging the answer.

{context}

Question: {question}

Student's answer: ${answer}`;

  const answerTemplate = `Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use as much of the context as possible when answering the question.
{context}
Question: {question}
Helpful Answer:`;

  const judgeChain = RetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
      prompt: PromptTemplate.fromTemplate(judgeTemplate),
    }
  );

  let judgement = await judgeChain.invoke({
    query: question,
  });

  const answerChain = RetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
      prompt: PromptTemplate.fromTemplate(answerTemplate),
    }
  );

  let gptAnswer = await answerChain.invoke({
    query: question,
  });

  return {
    judgement,
    gptAnswer,
  };
};
