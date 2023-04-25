import { useState } from "react";
import "./style.css";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

// function Counter() {
//   const [number, setnumber] = useState(0);
//   return (
//     <div>
//       <span style={{ fontSize: "40px" }}>{number}</span>
//       <button className="btn btn-large" onClick={() => setnumber((c) => c + 1)}>
//         +1
//       </button>
//     </div>
//   );
// }

function App() {
  const [showForm, setShowForm] = useState(false);

  const appTitle = "TODAY I LEARNED";
  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <img src="logo.png" alt="Today I learned! logo" />
          <h1>{appTitle}</h1>
        </div>

        <button
          className="btn btn-large btn-open"
          onClick={() => setShowForm((show) => !show)}
        >
          SHARE A FACT
        </button>
      </header>

      {showForm ? <NewFactForm /> : null}

      <main className="main">
        <CategoryFilter />
        <FactList />
      </main>
    </>
  );
}

function NewFactForm() {
  return <form className="fact-form">Fact Form</form>;
}

function CategoryFilter() {
  return (
    <aside>
      <ul>
        <li className="category">
          <button className="btn btn-all-categories">All</button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-categories"
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList() {
  // Temporary
  const facts = initialFacts;

  return (
    <section>
      <ul className="facts-list">
        {facts.map((facts) => (
          <Fact key={facts.id} facts={facts} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own!</p>
    </section>
  );
}

function Fact({ facts }) {
  return (
    <li key={facts.id} className="fact">
      <p>
        {facts.text}
        <a className="source" href={facts.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === facts.category)
            .color,
        }}
      >
        {facts.category}
      </span>
      <div className="vote-buttons">
        <button>👍 {facts.votesInteresting}</button>
        <button>🤯 {facts.votesMindblowing}</button>
        <button>⛔ {facts.votesFalse}</button>
      </div>
    </li>
  );
}

export default App;
