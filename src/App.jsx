// TTSFillGame.jsx
import React, { useState, useRef, useEffect } from "react";
import "./App.css";

const questions = [
  {
    hint: "Aturan sopan santun saat berinteraksi di dunia maya.",
    answer: "NETIKET",
    clue: ["N", "E", null, null, null, null, null]
  },
  {
    hint: "Hasil penerapan ilmu pengetahuan untuk mempermudah kehidupan.",
    answer: "TEKNOLOGI",
    clue: ["T", null, null, null, null, null, null, null, null]
  },
  {
    hint: "Aturan hukum yang mengatur aktivitas di dunia digital.",
    answer: "CYBERLAW",
    clue: ["C", null, null, null, null, null, null, null]
  },
  {
    hint: "Kejahatan yang dilakukan melalui media komputer dan internet.",
    answer: "CYBERCRIME",
    clue: ["C", null, null, null, null, null, null, null, null, null]
  },
  {
    hint: "Kode perilaku yang wajib dijunjung tinggi oleh pekerja ahli.",
    answer: "ETIKAPROFESI",
    clue: ["E", "T", null, null, null, null, null, null, null, null, null, null]
  },
  {
    hint: "Tindakan pemalsuan data secara digital.",
    answer: "DATAFORGERY",
    clue: ["D", null, null, null, null, null, null, null, null, null, null]
  },
  {
    hint: "Nilai benar dan salah yang berlaku di masyarakat.",
    answer: "MORAL",
    clue: ["M", null, null, null, null]
  },
  {
    hint: "Pekerjaan yang memerlukan keahlian dan tanggung jawab khusus.",
    answer: "PROFESI",
    clue: ["P", null, null, null, null, null, null]
  },
  {
    hint: "Teknik mengamankan data agar tidak bisa dibaca pihak lain.",
    answer: "ENKRIPSI",
    clue: ["E", null, null, null, null, null, null, null]
  },
  {
    hint: "Hak individu untuk menjaga dan melindungi informasi pribadinya.",
    answer: "PRIVACY",
    clue: ["P", null, null, null, null, null, null]
  },
];

function TTSFillGame() {
  const [current, setCurrent] = useState(0);
  const [inputs, setInputs] = useState(questions.map(q => q.clue.map(c => c || "")));
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [boxStatus, setBoxStatus] = useState([]);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = questions.map(q =>
      q.answer.split("").map(() => React.createRef())
    );
  }, []);

  useEffect(() => {
    setBoxStatus(
      questions.map(q => q.answer.split("").map(() => ""))
    );
  }, [current]);

  const handleChange = (letterIndex, value) => {
    const val = value.toUpperCase().slice(-1);
    const newInputs = [...inputs];
    const currentRow = [...inputs[current]];
    currentRow[letterIndex] = val;
    newInputs[current] = currentRow;
    setInputs(newInputs);

    if (
      val &&
      letterIndex + 1 < questions[current].answer.length &&
      !questions[current].clue[letterIndex + 1]
    ) {
      inputRefs.current[current][letterIndex + 1].current.focus();
    }
  };

  const handleKeyDown = (e, letterIndex) => {
    if (e.key === "Backspace") {
      if (inputs[current][letterIndex] === "") {
        let prevIndex = letterIndex - 1;
        while (prevIndex >= 0 && questions[current].clue[prevIndex] !== null) {
          prevIndex--;
        }
        if (prevIndex >= 0) {
          inputRefs.current[current][prevIndex].current.focus();
        }
      }
    }
  };

  const handleCheck = () => {
    const joined = inputs[current].join("");
    const correct = questions[current].answer;
    const status = questions[current].answer.split("").map((char, idx) =>
      inputs[current][idx] === char ? "correct" : "wrong"
    );
    setBoxStatus(status);

    if (joined === correct) {
      setScore(score + 1);
      setFeedback("correct");
      setTimeout(() => {
        setFeedback("");
        if (current + 1 < questions.length) {
          setCurrent(current + 1);
        }
      }, 1200);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(""), 1200);
    }
  };

  return (
    <div className={`fill-container themed-bg ${feedback}`}>
      <h2>🧠 Teka-Teki Etika Profesi</h2>
      <div className="question-row">
        <div className="hint">{current + 1}. {questions[current].hint}</div>
        <div className="input-row">
          {questions[current].answer.split("").map((_, i) => (
            <input
              key={i}
              ref={inputRefs.current[current]?.[i]}
              maxLength={1}
              readOnly={questions[current].clue[i] !== null}
              className={`cell ${boxStatus[i] || ""}`}
              value={inputs[current][i] || ""}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
            />
          ))}
        </div>
      </div>
      <button onClick={handleCheck} className="check-button">Kirim Jawaban</button>
      <div className="scoreboard">🔥 Skor Saat Ini: {score} / {questions.length}</div>
    </div>
  );
}

export default TTSFillGame;