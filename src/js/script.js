const nameInput = document.querySelector("#pseudo");
const msgInput = document.querySelector("#msg");
const checkButton = document.querySelector("#buttonInput");
const messageContainer = document.querySelector(".touit_content");

function addTouit(pseudo, message) {
    if (pseudo,message) {

        // Insertion du Touit
        // 1. Partie Pseudo et message dynamique


        let myTouit = document.createElement("article");
        myTouit.className = "touit";
        let newPseudo = document.createElement("p");
        newPseudo.className = "touit_pseudo";
        let newPseudoContent =  document.createTextNode(pseudo);
        newPseudo.appendChild(newPseudoContent);
        myTouit.appendChild(newPseudo);
        let newMessage = document.createElement("p");
        newMessage.className = "touit_message";
        let newMessageContent =  document.createTextNode(message);
        newMessage.appendChild(newMessageContent);
        myTouit.appendChild(newMessage);

        // 2. Insertion du comment / like / Close

        let newIconeBox = document.createElement("div");
        newIconeBox.className = "touit_icone_box";
        let newLikeButton = document.createElement("button");
        newLikeButton.className = "like";
        let newLikeButtonImg = document.createElement("img");
        newLikeButtonImg.src = "src/img/like.svg";
        let newCommentButton = document.createElement("button");
        newCommentButton.className = "comment";
        let newCommentButtonImg = document.createElement("img");
        newCommentButtonImg.src = "src/img/comment.svg";
        let newCloseButton = document.createElement("button");
        newCloseButton.className = "close";
        let newCloseButtonImg = document.createElement("img");
        newCloseButtonImg.src = "src/img/close.svg";
        newIconeBox.appendChild(newLikeButton);
        newLikeButton.appendChild(newLikeButtonImg);
        newIconeBox.appendChild(newCommentButton);
        newCommentButton.appendChild(newCommentButtonImg);
        newIconeBox.appendChild(newCloseButton);
        newCloseButton.appendChild(newCloseButtonImg);

        myTouit.appendChild(newIconeBox);

        // Insertion Finale

        messageContainer.prepend(myTouit);

        // Delete 

        newCloseButton.addEventListener("click", function(){
            messageContainer.removeChild(myTouit);
        })
    }
}

checkButton.addEventListener("click", function(ev){
    ev.preventDefault();
    const pseudo = nameInput.value;
    const message = msgInput.value;
    addTouit(pseudo, message);
});


