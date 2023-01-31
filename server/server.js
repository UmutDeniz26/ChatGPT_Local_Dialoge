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
var flagExternal=false

function promptGenerator(currentPrompt,chatterName,username){
    console.log(`------------------------------------------------------------------`)
    prompt=""
    promptsAndAnswers.forEach((element,index) => {
        if(index%2==0){
            prompt+=`${username}: ${element}\n`
        }
        else{
            prompt+=`${chatterName}: ${element}\n`
        }
    });
    if(prompt==""){
        prompt=``
    }
    return `${prompt}${username}: ${currentPrompt}${chatterName}: `
}

function nameValidator(name,defaultValue){
    if(name==""){
        return defaultValue   
    }
    return name
}
//
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
        var chatterName=req.body.chatter;
        var username=req.body.userName;
        var external=req.body.externalCommand;
        var checkBox=req.body.checkBox;
        username=nameValidator(username,"Umut")
        chatterName=nameValidator(chatterName,"ChatGPT")


        if(currentPrompt == "Reset123456uuklkjderascm..2123456"){
            console.log("Reset Request!")
            promptsAndAnswers=[]
            return
        }
        console.log(`Diyalog Sayısı: ${1+((promptsAndAnswers.length)/2)}`)
        if (1+((promptsAndAnswers.length)/2)>4){
            promptsAndAnswers.shift()
        }
        newPrompt=promptGenerator(currentPrompt,chatterName,username)
        if(checkBox=="true"){
            if(flagExternal==false){
                newPrompt=`${chatterName} gibi davran.\n${newPrompt}\n(${external})`
                flagExternal=true
            }
            else{
                newPrompt=`${chatterName} gibi davran.\n${newPrompt}`
            }
        }
        else{
            newPrompt=`${chatterName} gibi davran.\n${newPrompt}\n(${external})`

        }
        
        console.log(newPrompt)
        const response=await openai.createCompletion({
            model:"text-davinci-003",
            prompt:newPrompt,
            temperature:0,
            max_tokens:1000
            //top_p:1,
            //frequency_penalty:0.5,
            //presence_penalty:0,
            //stop:["\"\"\""]
        })
        res.status(200).send({
            bot:response.data.choices[0].text
        })
        console.log(response.data.choices[0].text.replace("\n",""))
        promptsAndAnswers.push(currentPrompt.replace("\n",""))
        promptsAndAnswers.push(response.data.choices[0].text.replace("\n",""))

    } catch (error) {
        console.log(error)
        res.status(500).send({error})
    }
})
let port=5000;
app.listen(port,()=>{console.log(`Server is running on port http://localhost:${port}`)})