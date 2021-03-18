const popup = document.querySelector('.chat-popup');
const chatBtn = document.querySelector('.chat-btn');
const submitBtn = document.querySelector('.submit-chat');
const chatArea = document.querySelector('.chat-area');
const inputElm = document.querySelector('.input-msg');
const emojiBtn = document.querySelector('#emoji-btn');
const picker = new edm.EmojiButton();


// Emoji selection  
window.addEventListener('DOMContentLoaded', () => {

    picker.on('emoji', selection => {      
      document.querySelector('.input-msg').value += selection.emoji;
    });
  
    emojiBtn.addEventListener('click', () => {
      picker.togglePicker(emojiBtn);
      picker.get
    });
  });        

//   chat button toggler 

chatBtn.addEventListener('click', ()=>{
    popup.classList.toggle('show');

})

// send msg 
submitBtn.addEventListener('click', ()=>{
    let userInput = inputElm.value;    
    let temp = `<div class="out-msg">
    <span class="my-msg">${userInput}</span>
    <img src="/img/logo.png" class="avatar">
    </div>`;

    chatArea.insertAdjacentHTML("beforeend", temp);
    inputElm.value = '';

})
