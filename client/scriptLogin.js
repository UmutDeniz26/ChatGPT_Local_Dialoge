var loginId=0;

// file1.js
document.getElementById('button1').onclick= ( )=> {
    
    handleLogin()

}

function handleLogin(){

    let chattername=document.querySelector(".Chat-Name>input").value
    let username=document.querySelector(".User-Name>input").value
    console.log(chattername,username)    
    window.location = `chat.html?${chattername}#_#${username}`;//${name}
}


document.querySelector(".Chat-Name>input").addEventListener('keyup',(e)=>{
    if(e.keyCode===13){
        handleLogin()
    } 
  })