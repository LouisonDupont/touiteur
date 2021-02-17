const nameInput = document.querySelector("#pseudo");
const msgInput = document.querySelector("#msg");
const checkButton = document.querySelector("#buttonInput");
const messageContainer = document.querySelector(".touit_content");
const formulaireInput = document.querySelector("#form");

let currentTimeStamp = 0;

formulaireInput.addEventListener("submit", function(ev){
    ev.preventDefault();

    sendTouit(
        function() {console.log("coucou");},
        function() {console.log("coucou sEND");},
        nameInput.value,
        msgInput.value
    );
});



function addTouit(pseudo, message, likes, comments, timestamp, id) {
    if (pseudo,message) {

        // Insertion du Touit
        // 1. Partie Pseudo et message dynamique

        let myTouit = document.createElement("article");
        myTouit.className = "touit";
        myTouit.id = id;
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
        let newLikeNumber = document.createElement("p");
        newLikeNumber.className = "likeNb";
        newLikeNumber.textContent = likes;
        let newLikeButton = document.createElement("button");
        newLikeButton.className = "like";
        let newLikeButtonImg = document.createElement("img");
        newLikeButtonImg.src = "src/img/like.svg";
        let newCommentButton = document.createElement("button");
        newCommentButton.className = "comment";
        // let newCommentContent = document.createElement("p");
        // newCommentContent.className = "commentContent";
        // newCommentContent.textContent  = comments;
        let newCommentButtonImg = document.createElement("img");
        newCommentButtonImg.src = "src/img/comment.svg";
        let newCloseButton = document.createElement("button");
        newCloseButton.className = "close";
        let newCloseButtonImg = document.createElement("img");
        newCloseButtonImg.src = "src/img/close.svg";
        let newDate = document.createElement("p");
        newDate.className = "dateContent";
        newDate.textContent  = formatTimestamp(timestamp);
        newIconeBox.appendChild(newLikeButton);
        newIconeBox.appendChild(newLikeNumber);
        newLikeButton.appendChild(newLikeButtonImg);
        newIconeBox.appendChild(newCommentButton);
        //newIconeBox.appendChild(newCommentContent);
        newIconeBox.appendChild(newDate);
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

        // Like

        newLikeButton.addEventListener("click", function(){
            addLike(
                function(){console.log("et oui")},
                function(){console.log("et non")},
                myTouit.id
            )
        })
    }
}

// RECUPERER TOUIT

function getTouit(lastTimestamp, success, error) {
    const request = new XMLHttpRequest();
    request.open("GET", "http://touiteur.cefim-formation.org/list?ts=" + lastTimestamp, true);
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

// Timestamp

// function formatTimestamp(timestamp){
//     return new Date(timestamp*1000).toLocaleString('fr-FR');
// }

function formatTimestamp(timestamp) {
    const formattedDate = new Date(timestamp*1000).toLocaleDateString('fr-FR');
    //const formattedTime = new Date(timestamp).toLocaleTimeString('fr-FR');
return formattedDate;
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
    const finalSendTouit = "name="+pseudo+"&message="+message;
    requestSend.send(finalSendTouit);
}

// SET INTERVAL 

let timestamp = 0;

setInterval(function(){
    getTouit(
        timestamp,
        function (resp){
            for (let i=0; i < resp.messages.length; i++){
                addTouit(resp.messages[i].name, resp.messages[i].message, resp.messages[i].likes, resp.messages[i].comments_count, resp.messages[i].ts, resp.messages[i].id);
                timestamp = resp.ts;
            }
        },
        function(){console.log("Error : Not working!");},
)}, 1000);


// LIKE 

function addLike(success, error, id) {
    const requestLike = new XMLHttpRequest();
    requestLike.open("PUT", "http://touiteur.cefim-formation.org/likes/send", true);
    requestLike.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requestLike.addEventListener("readystatechange", function () {
        if (requestLike.readyState === XMLHttpRequest.DONE) {
            // On a reçu toute la réponse
            if (requestLike.status === 200) {
                // La requête a fonctionnée
                const reponseLike = JSON.parse(requestLike.responseText);
                success(reponseLike); // Correspond à resp *
            } else {
                error(status);
            }

        }
    });
    const data = "message_id="+id;
    requestLike.send(data);
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


