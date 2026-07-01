let questions = [];
let currentIndex = 0;
let progress = {};

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const explanationEl = document.getElementById("explanation");
const answerSection = document.getElementById("answerSection");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

async function init() {
  const res = await fetch("questions.json");
  questions = await res.json();

  loadProgress();
  showQuestion();
  updateProgressUI();
}

function loadProgress() {
  const saved = localStorage.getItem("progress");
  if (saved) {
    progress = JSON.parse(saved);
  }
}

function saveProgress() {
  localStorage.setItem("progress", JSON.stringify(progress));
}

function getCurrentQuestion() {
  return questions[currentIndex];
}

function showQuestion() {
  const q = getCurrentQuestion();

  questionEl.textContent = q.question;
  answerEl.textContent = q.answers.join(" / ");
  explanationEl.textContent = q.explanation_fr;

  answerSection.classList.add("hidden");
}

document.getElementById("showAnswerBtn").addEventListener("click", () => {
  answerSection.classList.remove("hidden");
});

document.querySelectorAll(".ratings button").forEach(btn => {
  btn.addEventListener("click", () => {
    const score = Number(btn.dataset.score);
    updateProgress(getCurrentQuestion().id, score);
    nextQuestion();
  });
});

function updateProgress(id, score) {
  if (!progress[id]) {
    progress[id] = { seen: 0, score: 0 };
  }

  progress[id].seen += 1;
  progress[id].score = score;

  saveProgress();
  updateProgressUI();
}

function nextQuestion() {
  currentIndex = (currentIndex + 1) % questions.length;
  showQuestion();
}

function updateProgressUI() {
  const total = questions.length;
  const seen = Object.keys(progress).length;

  const percent = Math.round((seen / total) * 100);

  progressFill.style.width = percent + "%";
  progressText.textContent = `${seen} / ${total} questions seen`;
}

init();
