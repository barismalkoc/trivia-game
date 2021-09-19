const btn = document.querySelector(".btn");
const numberOfQuestionBtn = document.querySelector("#trivia_amount");
const selectCategoryBtn = document.querySelector("#trivia_category");
const selectDifficultyBtn = document.querySelector("#trivia_difficulty");
const optionsBtn = document.querySelector(".options-button");
const nextQuestionBtn = document.querySelector("#next-question.btn");
let API_URL = "https://opentdb.com/api.php";
let selectedAnswer = null;
let level = 0;
let data;
let numberOfQuestionForDetail;
let correctNumber = 0;

const gameStart = () => {
    pullInformation();

}

const pullInformation = () => {

    const numberOfQuestion = numberOfQuestionBtn.value;
    numberOfQuestionForDetail = numberOfQuestion;
    const selectCategory = selectCategoryBtn.value;
    const selectDifficulty = selectDifficultyBtn.value;
    console.log(numberOfQuestion, selectCategory, selectDifficulty);
    document.querySelector(".count-down").style.display = "block";

    countDown();
    getQuestionFromApi(numberOfQuestion, selectCategory, selectDifficulty);



}

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
async function recursion(arr) {
    document.querySelector(".select-form").style.display = "none";
    if (arr.length == 0) {
        document.querySelector(".count-down").style.display = "none";
        return document.querySelector(".quiz-container").style.display = "block";
    }
    if (arr.length == 5) {
        await timeout(100);
    } else {
        await timeout(1000);
    }

    document.querySelector(".count-down h1").innerHTML = arr.pop();
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
    console.log(data);
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
    document.querySelector("#score").innerHTML = `Score : ${correctNumber} / ${numberOfQuestionForDetail}`;
    document.querySelector("#question").innerHTML = `Question : ${level + 1} / ${numberOfQuestionForDetail}`;
}

const addAnswer = (correctAnswer, incorrectAnswers) => {

    console.log(correctAnswer, incorrectAnswers)

    const randomNumber = Math.floor(Math.random() * 3);
    console.log(randomNumber)

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



        if (selectedAnswerForControl.innerHTML == data.results[level].correct_answer) {
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
        console.log("bitti");
        document.querySelector(".quiz-container").style.display = "none";
        document.querySelector(".game-finished-container").style.display = "block";
        document.querySelector("#end-game-score").innerHTML = `Your Score : ${correctNumber}/${numberOfQuestionForDetail}`
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





