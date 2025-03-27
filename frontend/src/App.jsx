import { useEffect, useState } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import axios from "axios";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum() {return 1 + 1}`);
  const [review, setReview] = useState(``);
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setLoading(true); // Start loading
    try {
      const response = await axios.post("https://ai-code-reviewer-backend-71z0.onrender.com/ai/get-review", { code });
      setReview(response.data);
    } catch (error) {
      setReview("❌ Error fetching review. Please try again.");
    }
    setLoading(false); // Stop loading
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          <div onClick={reviewCode} className="review">
            {loading ? "Reviewing..." : "Review"}
          </div>
        </div>
        <div className="right">
          {loading ? (
            <p>🔄 Loading...</p> // Show loading message
          ) : (
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
            {review}
          </Markdown> 
          )}
        </div>
      </main>
    </>
  );
}

export default App;
