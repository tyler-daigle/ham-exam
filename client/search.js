document.getElementsByTagName("form")[0].addEventListener("submit", (e) => {
  getQuestion();
  e.preventDefault();
});

document.getElementById("search_button").addEventListener("click", () => {
  getQuestion();
});

function getQuestion() {
  const questionId = document.getElementById("question_id").value.toUpperCase();
  console.log(questionId);
  fetch(`http://localhost:8080/questions?id=${questionId}`)
    .then((res) => res.json())
    .then((data) => displayQuestion(data));
}
function displayQuestion(questionData) {
  document.getElementById("question-text").innerText =
    questionData.question_text;

  const { choices } = questionData;
  for (let ch of Object.keys(choices)) {
    document.getElementById(`choice-${ch}`).innerText = choices[ch];
  }
}
