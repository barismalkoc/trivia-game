


let selectedAnswer = null;
let level = 0;
let data;
let numberOfQuestionForDetail;
let correctNumber = 0;

const gameStart = () => {
    pullInformation();

}

const pullInformation = () => {

    const numberOfQuestionBtn = document.querySelector("#trivia_amount").value;
    const numberOfQuestion = numberOfQuestionBtn;
    numberOfQuestionForDetail = numberOfQuestion;

    const selectCategoryBtn = document.querySelector("#trivia_category").value;
    const selectCategory = selectCategoryBtn;


    const selectDifficultyBtn = document.querySelector("#trivia_difficulty").value;
    const selectDifficulty = selectDifficultyBtn;

    let selectFormDom = document.querySelector(".select-form");
    selectFormDom.style.display = "none";

    let CountDownDom = document.querySelector(".count-down");
    CountDownDom.style.display = "block";

    countDown();
    getQuestionFromApi(numberOfQuestion, selectCategory, selectDifficulty);



}

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
async function recursion(arr) {
    if (arr.length == 0) {
        document.querySelector(".count-down").style.display = "none";
        return document.querySelector(".quiz-container").style.display = "block";
    }
    if (arr.length == 5) {
        await timeout(100);
    } else {
        await timeout(1000);
    }

    document.querySelector(".count-down p").innerHTML = arr.pop();
    return recursion(arr);
}

const countDown = async () => {

    playSound("game-count-down");
    let arr = ["", "Let's Start...", "1...", "2...", "3..."];
    let fakeArray = arr;
    await recursion(fakeArray);



}

const playSound = (soundName) => {

    var audio = new Audio("sounds/" + soundName + ".mp3");
    audio.play();

}

const getQuestionFromApi = async (numberOfQuestion, selectCategory, selectDifficulty) => {

    let API_URL = "https://opentdb.com/api.php";
    API_URL += `?amount=${numberOfQuestion}`
    if (selectCategory !== "any") {
        API_URL += `&category=${selectCategory}`;
    }
    if (selectDifficulty !== "any") {
        API_URL += `&difficulty=${selectDifficulty}`;
    }
    API_URL += `&type=multiple`;
    const response = await fetch(
        API_URL
    );

    console.log(API_URL)
    data = await response.json();
    questionEngine(data);
}


const questionEngine = () => {

    const validQuestion = data.results[level];
    changeQuestionHTML(validQuestion.question);
    changeDetail();
    addAnswer(validQuestion.correct_answer, validQuestion.incorrect_answers);


}

const changeQuestionHTML = (question) => {

    document.querySelector("#display-question").innerHTML = question;
}

const changeDetail = () => {
    let scoreDom = document.querySelector("#score");
    let scoreInfo = `Score : ${correctNumber} / ${numberOfQuestionForDetail}`;
    scoreDom.innerHTML = scoreInfo;

    let questionDom = document.querySelector("#question");
    let questionInfo = `Question : ${level + 1} / ${numberOfQuestionForDetail}`;
    questionDom.innerHTML = questionInfo;
}

const addAnswer = (correctAnswer, incorrectAnswers) => {

    const randomNumber = Math.floor(Math.random() * 3);

    for (let i = 0; i < 4; i++) {
        if (i == randomNumber) {
            document.querySelector(`#option${i}`).innerHTML = correctAnswer;
        }
        else {
            document.querySelector(`#option${i}`).innerHTML = incorrectAnswers.pop();
        }
    }

}

const chooseAnswer = (e) => {

    selectedAnswer = e;
}

const checkAnswer = () => {

    let selectedAnswerForControl = "";
    selectedAnswerForControl = document.querySelector(`#option${selectedAnswer}`);

    if (selectedAnswer == null) {
        alert("Do not leave the question blank")
        return;
    }



    if (level + 1 < numberOfQuestionForDetail) {
        console.log(level, numberOfQuestionForDetail)

        let correctAnswer = data.results[level].correct_answer;

        if (selectedAnswerForControl.innerHTML == correctAnswer) {
            level++;
            correctNumber++;
            playSound("correct");
            questionEngine();
        }


        else {
            level++;
            playSound("wrong");
            questionEngine();
        }


        selectedAnswer = null;

    } else {

        let quizContainerDom = document.querySelector(".quiz-container");
        quizContainerDom.style.display = "none";

        let gameFinsihedDom = document.querySelector(".game-finished-container");
        gameFinsihedDom.style.display = "block";

        let endGameScoreDom = document.querySelector("#end-game-score");
        let yourScoreInfo = `Your Score : ${correctNumber}/${numberOfQuestionForDetail}`;
        endGameScoreDom.innerHTML = yourScoreInfo;
    }


}

const resetGame = () => {


    selectedAnswer = "";
    level = 0;
    data;
    numberOfQuestionForDetail;
    correctNumber = 0;


    document.querySelector(".game-finished-container").style.display = "none";
    document.querySelector(".select-form").style.display = "block";
}





