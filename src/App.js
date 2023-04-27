import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";
import { isDisabled } from "@testing-library/user-event/dist/utils";

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

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: facts, error } = await query.limit(1000).eq("");
        if (!error) {
          setFacts(facts);
        } else {
          alert("There was a problem getting data");
        }
        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ showForm, setShowForm }) {
  const appTitle = "TODAY I LEARNED";
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Today I learned! logo" />
        <h1>{appTitle}</h1>
      </div>

      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "CLOSE" : "SHARE A FACT"}
      </button>
    </header>
  );
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
console.log("http://example.com: " + isValidHttpUrl("https://example.com"));
console.log("example.com: " + isValidHttpUrl("example.com"));

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("https://example.com");
  const [category, setCategory] = useState("");
  const [isUploading, setIsLoading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    e.preventDefault();
    if (text && isValidHttpUrl(source) && category && textLength <= 200) {
      // const newFact = {
      //   id: uuidv4(),
      //   text,
      //   source,
      //   category: categories,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };
      // Upload fact to Supabase
      setIsLoading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsLoading(false);
      if (!error) setFacts((facts) => [newFact[0], ...facts]);
      setText("");
      setSource("");
      setCategory("");
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        value={source}
        type="text"
        placeholder="Trustworthy source..."
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        name=""
        id=""
        disabled={isUploading}
      >
        <option value="">Choose Category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-categories"
              onClick={() => setCurrentCategory(cat.name)}
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

function FactList({ facts, setFacts }) {
  if (facts.length === 0) {
    return (
      <p className="message">
        There are {facts.length} facts for this category. Add your own!
      </p>
    );
  }
  return (
    <section>
      <ul className="facts-list">
        {facts.map((facts) => (
          <Fact key={facts.id} fact={facts} setFacts={setFacts} />
        ))}
      </ul>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesinteresting + fact.votesformindblowing < fact.votesFalse;
  // async function handleVote() {
  //   setIsUpdating(true);
  //   const { data: updatedFact, error } = await supabase
  //     .from("facts")
  //     .update({ votesInteresting: fact.votesInteresting + 1 })
  //     .eq("id", fact.id)
  //     .select();
  //   setIsUpdating(false);
  //   if (!error)
  //     setFacts((facts) =>
  //       facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
  //     );
  // }
  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }
  return (
    <li key={fact.id} className="fact">
      <p>
        {isDisputed ? <span className="disputed">[⛔ DISPUTED]</span> : null}
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesinteresting")}
          disabled={isUpdating}
        >
          👍 {fact.votesinteresting}
        </button>
        <button
          onClick={() => handleVote("votesformindblowing")}
          disabled={isUpdating}
        >
          🤯 {fact.votesformindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
