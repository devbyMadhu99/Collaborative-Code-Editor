
import Editor from "@monaco-editor/react";
import "../App.css";

function EditorPanel({
  code,
  language,
  handleCodeChange,
  handleLanguageChange,
}) {
  return (
    <section className="editor-section">
      <div className="editor-heading">
        <h2>Code Editor</h2>

        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      <div className="monaco-container">
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            automaticLayout: true,
          }}
        />
      </div>
    </section>
  );
}

export default EditorPanel;
