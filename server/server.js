import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from "openai";


dotenv.config();


const configuration=new Configuration({
    apiKey:process.env.OPENAI_API_KEY,
})

const openai= new OpenAIApi(configuration);
var promptsAndAnswers=[]
var prompt=""
var newPrompt=""

function promptGenerator(currentPrompt){
    console.log("-------------------------------------------------------------------")
    prompt=""
    promptsAndAnswers.forEach((element,index) => {
        if(index%2==0){
            prompt+=`User: ${element}\n`
        }
        else{
            prompt+=`ChatGPT: ${element}\n`
        }
    });
    if(prompt==""){
        prompt=`User: ${currentPrompt}\n`
    }
    return `${prompt}User: ${currentPrompt}ChatGPT: `
}

const app=express();
app.use(cors());
app.use(express.json())

app.get('/', async (req,res)=>{
    res.status(200).send({
        message:'Hellow World'
    });
});
app.post('/',async (req,res)=>{
    try {
        const currentPrompt=req.body.prompt;
        if(currentPrompt == "Reset123456uuklkjderascm..2123456"){
            console.log("Reset Request!")
            promptsAndAnswers=[]
            return
        }
        newPrompt=promptGenerator(currentPrompt)
        console.log(`ChatGPT gibi davran.\n${newPrompt}`)
        const response=await openai.createCompletion({
            model:"text-davinci-003",
            prompt:`ChatGPT gibi davran.\n${newPrompt}`,
            temperature:0,
            max_tokens:3000,
            top_p:1,
            frequency_penalty:0.5,
            presence_penalty:0,
            stop:["\"\"\""]
        })
        res.status(200).send({
            bot:response.data.choices[0].text
        })
        promptsAndAnswers.push(currentPrompt.replace("\n",""))
        promptsAndAnswers.push(response.data.choices[0].text.replace("\n",""))

    } catch (error) {
        console.log(error)
        res.status(500).send({error})
    }
})
let port=5000;
app.listen(port,()=>{console.log(`Server is running on port http://localhost:${port}`)})