import bot from './assets/bot.svg';
import user from './assets/user.svg'

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container')
let loadInterval;
var answerMemory=[]
var hrefLoc=decodeURI(window.location.href).split("?").slice(1)
var chatter=hrefLoc["0"].split("#_#")[0]
var username=hrefLoc["0"].split("#_#")[1]
var externalCommand=hrefLoc["0"].split("#_#")[2]
var checkBox=hrefLoc["0"].split("#_#")[3]

console.log("href: ",hrefLoc)
console.log("chatter: ",chatter)
console.log("user: ",username)
console.log("external: ",externalCommand)
console.log("checkBox: ",checkBox)
function loader(element) {
  element.textContent='';
  loadInterval=setInterval(() => {
      element.textContent+='.';
      if (element.textContent=='....') {
        element.textContent='';
      }
    }, 300);
}

function typeText(element,text) {
  let index=0;
  let interval=setInterval(() => {
    if(index<text.length){
      element.innerHTML+=text.charAt(index);
      index++;
    }
    else{
      clearInterval(interval)
    }
  }, 1);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexaDecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexaDecimalString}`
}

function chatStripe(isAi, value, uniqueId) {
  
  return (`
      <div class="wrapper ${isAi && 'ai'}">
        <div class="chat">
          <div class="profile">
            <img
              src="${isAi ? bot : user}"
              alt="${isAi ? ' ' : 'user'}"
            />
          </div>
          <div class="message" id=${uniqueId}>
            ${value}
          </div>
        </div>
      </div>
  `)
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  //user's chatstripe
  chatContainer.innerHTML+=chatStripe(false,data.get('prompt'))
  form.reset();

  //bot's stripe
  const uniqueId=generateUniqueId();
  chatContainer.innerHTML+=chatStripe(true," ",uniqueId)
  chatContainer.scrollTop=chatContainer.scrollHeight;
  
  const messageDiv=document.getElementById(uniqueId);
  loader(messageDiv);

  //fetch data from server
  var inputString=""
  /*if (answerMemory[answerMemory.length-1]!=undefined){
    inputString=`[last answer: ${answerMemory[answerMemory.length-1]}], ${data.get('prompt')}`
  }
  else{
    inputString=data.get('prompt')
  }*/
  inputString=data.get('prompt')
  const response= await fetch('http://localhost:5000',{
    method:'POST',
    headers:{
      'Content-Type':'application/json', 
    },
    body:JSON.stringify({
      prompt:inputString,
      chatter:chatter,
      userName:username,
      externalCommand:externalCommand,
      checkBox:checkBox
    })
  })
  clearInterval(loadInterval);
  messageDiv.innerHTML='';

  if(response.ok){
    console.log(response)
    const data=await response.json();
    const parseedData=data.bot.trim();
    answerMemory.push(parseedData)
    typeText(messageDiv,parseedData);
  }
  else{
    const err = await response.text()
    messageDiv.innerHTML="Something Went Wrong";
    alert(err);
  }
}


form.addEventListener('submit',handleSubmit);
form.addEventListener('keyup',(e)=>{
  if(e.keyCode===13){
    handleSubmit(e);
  } 
})


const handleReset = async (e) => {
  e.preventDefault();

  const response= await fetch('http://localhost:5000',{
    method:'POST',
    headers:{
      'Content-Type':'application/json', 
    },
    body:JSON.stringify({
      prompt:"Reset123456uuklkjderascm..2123456"
    })
  })
  console.log("selam")
}

form.addEventListener('button',handleReset);
document.querySelector(".reset").addEventListener('click',(e)=>{
  handleReset(e);
  
})
