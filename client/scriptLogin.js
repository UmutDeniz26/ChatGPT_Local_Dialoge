var loginId=0;

// file1.js
document.getElementById('button1').onclick= ( )=> {
    handleLogin()
}

function handleLogin(){

    let chattername=document.querySelector(".Chat-Name>input").value
    let username=document.querySelector(".User-Name>input").value
    let external=document.querySelector(".External-Name>input").value
    let checkBox=document.querySelector('#accept')
    window.location = `chat.html?${chattername}#_#${username}#_#${external}#_#${checkBox.checked}`;
}


document.querySelector(".Chat-Name>input").addEventListener('keyup',(e)=>{
    if(e.keyCode===13){
        handleLogin()
    } 
  })
document.querySelector(".User-Name>input").addEventListener('keyup',(e)=>{
    if(e.keyCode===13){
        handleLogin()
    } 
})
document.querySelector(".External-Name>input").addEventListener('keyup',(e)=>{
    if(e.keyCode===13){
        handleLogin()
    } 
})