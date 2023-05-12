import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [questionInput, setQuestionInput] = useState("");
  const [clearInput, setClearInput] = useState(false);
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clear: clearInput, question: questionInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      
      setResult(data.result.map((item, key) => {
        if(item.role == "system") {
          return
        }
        return <li key={key}>{item.role == "assistant" ? "Creepy AI" : item.role}: {item.content}</li>
    }));
      setQuestionInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Creepy AI</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="question"
            placeholder="How can I creep you out?"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          <label>
          <input 
            type="checkbox" 
            name="clear"
            value={clearInput}
            onChange={(c) => setClearInput(c.target.checked)}
          />
            Clear History
          </label>
          <input type="submit" value="Send" />
        </form>
        <div className={styles.result}>
          <ul>{result}</ul>
        </div>
      </main>
    </div>
  );
}
