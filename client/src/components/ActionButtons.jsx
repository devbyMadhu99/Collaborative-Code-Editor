
import "../App.css";

function ActionButtons({ runCode, saveCode, loadCode, saving }) {
  return (
    <div className="editor-toolbar">
      <button onClick={runCode}>Run Code</button>

      <button onClick={saveCode} disabled={saving}>
        {saving ? "Saving..." : "Save Code"}
      </button>

      <button onClick={loadCode}>Load Saved Code</button>
    </div>
  );
}

export default ActionButtons;
