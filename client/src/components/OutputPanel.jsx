
import "../App.css";

function OutputPanel({ output }) {
  return (
    <>
      <h3>Output:</h3>
      <pre className="output-box">{output}</pre>
    </>
  );
}

export default OutputPanel;
