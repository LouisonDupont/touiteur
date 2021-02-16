const nameInput = document.querySelector("#pseudo");
const msgInput = document.querySelector("#msg");
const checkButton = document.querySelector("#buttonInput");
const messageContainer = document.querySelector(".touit_content");
const formulaireInput = document.querySelector("#form");

formulaireInput.addEventListener("submit", function(ev){
    ev.preventDefault();

    sendTouit(
        function() {console.log("coucou");},
        function() {console.log("coucou sEND");},
        nameInput.value,
        msgInput.value
    );

    getTouit(function(resp) {
        for (let i=0; i < resp.messages.length; i++){
            addTouit(resp.messages[i].name, resp.messages[i].message);
        }
    }, function() {
    });
});

getTouit(function(resp) {
    for (let i=0; i < resp.messages.length; i++){
        addTouit(resp.messages[i].name, resp.messages[i].message);
    }
}, function() {
});

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

// RECUPERER TOUIT

function getTouit(success, error) {
    const request = new XMLHttpRequest();
    request.open("GET", "http://touiteur.cefim-formation.org/list", true);
    request.addEventListener("readystatechange", function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            // On a reçu toute la réponse
            if (request.status === 200) {
                // La requête a fonctionnée
                const reponse = JSON.parse(request.responseText);
                console.log(reponse);
                success(reponse); // Correspond à resp *
            } else {
                error(status);
            }
        }
    });
    request.send();
}

// SEND

function sendTouit(success, error, pseudo, message) {
    const requestSend = new XMLHttpRequest();
    requestSend.open("POST", "http://touiteur.cefim-formation.org/send", true);
    requestSend.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requestSend.addEventListener("readystatechange", function () {
        if (requestSend.readyState === XMLHttpRequest.DONE) {
            // On a reçu toute la réponse
            if (requestSend.status === 200) {
                // La requête a fonctionnée
                const reponseSend = JSON.parse(requestSend.responseText);
                console.log("reponse passe");
                success(reponseSend); // Correspond à resp *
                console.log("et ça passe");
            } else {
                error(status);
                console.log("aie");
            }
        }
    });
    const coucou = "name="+pseudo+"&message="+message;
    requestSend.send(coucou);
}

// TEST AVEC JOKE


// const joke1 = document.querySelector(".displayJoke");
// joke1.textContent = "Loading...";

// function getJoke(success, error) {
//     const request = new XMLHttpRequest();
//     request.open("GET", "https://api.chucknorris.io/jokes/random", true);
//     request.addEventListener("readystatechange", function () {
//         if (request.readyState === XMLHttpRequest.DONE) {
//             // On a reçu toute la réponse
//             if (request.status === 200) {
//                 // La requête a fonctionnée
//                 const response = JSON.parse(request.responseText);
//                 success(response);
//             } else {
//                 error();
//             }
//         }
//     });
//     request.send();
// }

// getJoke(function(resp) {
//     joke1.textContent = resp.value;
// }, function() {
//     joke1.textContent = "Error : Unable to joke here !";
//     joke1.style.color = "red";
// });


