
import "../App.css";

function OutputPanel({ output }) {
  return (
    <section className="output-section">
      <div className="output-heading">
        <span className="output-status"></span>
        <h3>Console Output</h3>
      </div>

      <pre className="output-box">{output || "Output will appear here..."}</pre>
    </section>
  );
}

export default OutputPanel;
