import { HNSWLib } from "langchain/vectorstores.js";
import { OpenAIEmbeddings } from 'langchain/embeddings.js';
import { makeChain } from "../util";
import { fileURLToPath } from 'node:url'

const { opeanAiKey } = useRuntimeConfig();


let cachedChain: any;

const getChain = async () => {
  if(cachedChain) {
    return cachedChain
  }

  const vectorstore = await HNSWLib.load('assets/data', new OpenAIEmbeddings({
    openAIApiKey: opeanAiKey,
  }))
  
  cachedChain =  makeChain(vectorstore);

  return cachedChain
} 

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const chain = await getChain()

  return await chain.call({
    question: body.question,
    chat_history: body.history,
  });
})