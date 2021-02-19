const nameInput = document.querySelector("#pseudo");
const msgInput = document.querySelector("#msg");
const checkButton = document.querySelector("#buttonInput");
const messageContainer = document.querySelector(".touit_content");
const formulaireInput = document.querySelector("#form");

let currentTimeStamp = 0;

formulaireInput.addEventListener("submit", function(ev){
    ev.preventDefault();// Sert a remettre à zero l'évenement naturel d'un submit (refresh)

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
        myTouit.id = id; // ici j'attribue le parametre id 
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

        // LIKE

        let newIconeBox = document.createElement("div");
        newIconeBox.className = "touit_icone_box";
        
        let newLikeNumber = document.createElement("p");
        newLikeNumber.className = "likeNb";
        newLikeNumber.textContent = likes;
        let newLikeButton = document.createElement("button");
        newLikeButton.className = "like";
        let newLikeButtonImg = document.createElement("img");
        newLikeButtonImg.src = "src/img/like.svg";

        newIconeBox.appendChild(newLikeButton);
        newIconeBox.appendChild(newLikeNumber);
        newLikeButton.appendChild(newLikeButtonImg);

        // Commentaire MODAL

        // Bouton de base 

        let newCommentButton = document.createElement("button");
        newCommentButton.className = "comment";
        let newCommentButtonImg = document.createElement("img");
        newCommentButtonImg.src = "src/img/comment.svg";

        newCommentButton.appendChild(newCommentButtonImg);

        
        /*

        //Création de modal

        let newModalComment = document.createElement("div");
        newModalComment.className = "modalBox";
        myTouit.appendChild(newModalComment);

        // Content du modal

        let newCommentContent = document.createElement("p");
        newCommentContent.className = "commentContent";
        newCommentContent.textContent  = comments;

        newModalComment.appendChild(newCommentContent);

        */

        newIconeBox.appendChild(newCommentButton);

        // BOUTON CLOSE


        let newCloseButton = document.createElement("button");
        newCloseButton.className = "close";
        let newCloseButtonImg = document.createElement("img");
        newCloseButtonImg.src = "src/img/close.svg";

        
        newIconeBox.appendChild(newCloseButton);
        newCloseButton.appendChild(newCloseButtonImg);

        //newIconeBox.appendChild(newCommentContent);


        myTouit.appendChild(newIconeBox);

        // Insertion de la date 

        let newDateBox = document.createElement("div");
        newDateBox.className = "touit_date_box";

        let newDate = document.createElement("p");
        newDate.className = "dateContent";
        newDate.textContent  = formatTimestamp(timestamp);
        newDateBox.appendChild(newDate);

        myTouit.appendChild(newDateBox);

        // Insertion Finale

        messageContainer.prepend(myTouit);


        newLikeButton.addEventListener("click", function(){
            newLikeButton.classList.toggle("active");
            if(newLikeButton.classList.contains("active")){
                addLike(
                    function(){
                        oneTouit(
                            function(resp) {
                                newLikeNumber.textContent = resp.data.likes;
                            },
                            function() {console.log("Erreur REFRESH ADD");},
                            myTouit.id);
                            newLikeButtonImg.src = "src/img/likefull.svg";
                        },
                    function() {console.log("Erreur ADD");},
                    myTouit.id
                );
            }
            else{
                deleteLike(
                    function() {
                        oneTouit(
                            function(resp) {
                                newLikeNumber.textContent = resp.data.likes;
                            },
                            function() {console.log("Erreur REFRESH DELETE");},
                            myTouit.id);
                            newLikeButtonImg.src = "src/img/like.svg";
                    },
                    function() {console.log("Erreur DELETE");},
                    myTouit.id
                );
            }
        });

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

// Recupération d'un seul touit

function oneTouit(success, error, id) {
    const requestOne = new XMLHttpRequest();
    requestOne.open("GET", "http://touiteur.cefim-formation.org/get?id=" + id, true);
    requestOne.addEventListener("readystatechange", function () {
        if (requestOne.readyState === XMLHttpRequest.DONE) {
            if (requestOne.status === 200) {
                const reponseOne = JSON.parse(requestOne.responseText);
                success(reponseOne);
            } else{
                error(status);
            }
        }
    });
    requestOne.send();
}

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
        function(){console.log("Coucou1");}
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

function deleteLike(success, error, id) {
    const requestDelete = new XMLHttpRequest();
    requestDelete.open("DELETE", "http://touiteur.cefim-formation.org/likes/remove", true);
    requestDelete.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requestDelete.addEventListener("readystatechange", function () {
        if (requestDelete.readyState === XMLHttpRequest.DONE) {
            // On a reçu toute la réponse
            if (requestDelete.status === 200) {
                // La requête a fonctionnée
                const reponseDelete = JSON.parse(requestDelete.responseText);
                success(reponseDelete);
            } else {
                error(status);
            }

        }
    });
    const data = "message_id="+id;
    requestDelete.send(data);
}

// TOUIT LES PLUS LIKER

const likeContainer = document.querySelector(".like_content");

function mostLiked(pseudo, message, likes, id) {
    if (pseudo,message) {

        let myLikeTouit = document.createElement("article");
        myLikeTouit.className = "like_card";
        myLikeTouit.id = id;

        let likeMessage = document.createElement("p");
        likeMessage.className = "like_message";
        let likeMessageContent =  document.createTextNode(message);
        likeMessage.appendChild(likeMessageContent);
        myLikeTouit.appendChild(likeMessage);

        let likePseudo = document.createElement("p");
        likePseudo.className = "like_pseudo";
        let newLikePseudoContent =  document.createTextNode(pseudo);
        likePseudo.appendChild(newLikePseudoContent);
        myLikeTouit.appendChild(likePseudo);

        // LIKE

        let newLikeBox = document.createElement("div");
        newLikeBox.className = "like_number";
        
        let newMostLikeButtonImg = document.createElement("img");
        newMostLikeButtonImg.src = "src/img/number.svg";
        let newMostLikeNumber = document.createElement("p");
        newMostLikeNumber.className = "number_total";
        newMostLikeNumber.textContent = likes;

        myLikeTouit.appendChild(newLikeBox);
        newLikeBox.appendChild(newMostLikeButtonImg);
        newLikeBox.appendChild(newMostLikeNumber);

        // Insertion Finale

        likeContainer.appendChild(myLikeTouit);
    }
}

function addMostLiked(success, error, nbTouit) {
    const requestMostLiked = new XMLHttpRequest();
    requestMostLiked.open("GET", "http://touiteur.cefim-formation.org/likes/top?count=" + nbTouit, true);
    requestMostLiked.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requestMostLiked.addEventListener("readystatechange", function () {
        if (requestMostLiked.readyState === XMLHttpRequest.DONE) {
            // On a reçu toute la réponse
            if (requestMostLiked.status === 200) {
                // La requête a fonctionnée
                const reponseMostLiked = JSON.parse(requestMostLiked.responseText);
                success(reponseMostLiked);
            } else {
                error(status);
            }

        }
    });
    requestMostLiked.send();
}

addMostLiked(
    function (resp){
        const coucouEtCoucou = resp.top.sort(function(a,b){return b.likes - a.likes});
        for (let i=0; i < coucouEtCoucou.length; i++){
            mostLiked(coucouEtCoucou[i].name, coucouEtCoucou[i].message, coucouEtCoucou[i].likes, coucouEtCoucou[i].id);
        }
    },
    function(){console.log("Coucou6");
    },
3);

// Best words

// TOUIT LES PLUS LIKER

const wordsContainer = document.querySelector("words_box");

function bestWords(message,id) {
    if (message) {

        let myWords = document.createElement("article");
        myWords.className = "words_card";
        myWords.id = id;

        let wordsDisplay = document.createElement("p");
        wordsDisplay.className = "words_display";
        let wordsDisplayContent =  document.createTextNode(message);

        myWords.appendChild(wordsDisplay);
        wordsDisplay.appendChild(wordsDisplayContent);

        // Insertion Finale

        wordsContainer.prepend(myWords);
    }
}

function addBestWords(success, error) {
    const requestBestWords = new XMLHttpRequest();
    requestBestWords.open("GET", "http://touiteur.cefim-formation.org/trending", true);
    requestBestWords.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    requestBestWords.addEventListener("readystatechange", function () {
        if (requestBestWords.readyState === XMLHttpRequest.DONE) {
            // On a reçu toute la réponse
            if (requestBestWords.status === 200) {
                // La requête a fonctionnée
                const reponseBestWords = JSON.parse(requestBestWords.responseText);
                success(reponseBestWords);
            } else {
                error(status);
            }

        }
    });
    requestBestWords.send();
}




addBestWords(
    function (resp){
        for (let i=0; i < resp.messages.length; i++){
            bestWords(resp.messages[i].message, resp.messages[i].id);
        }
    },
    function(){console.log("Coucou1");
    },

3);


// setInterval(function(){
//     addBestWords(
//         function (resp){
//             (function(a,b){return b.likes - a.likes})
//             const trendingWords = Object.entries(resp).sort(function(a, b){return b[1] - a[1];});
//             console.log(trendingWords);
//             bestWords(trendingWords
//                 .map(function(w) { return w[0]; })
//                 .slice(0, 72)
//             );
//         },
//         function(req){
//             alert(
//                 "Une erreur s'est produite lors de la réception du trending :\n" +
//                 "" + req.status + " : " + req.statusText + " !\n" +
//                 "Veuillez contacter l'administrateur du site si cela se reproduit !"
//             );
//         }
//     )
// }, 5000);



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


