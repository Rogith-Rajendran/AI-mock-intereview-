import { useState } from "react";

function CodeEditor() {

  const [code, setCode] = useState(
`let name = "Student";

console.log(name);`
  );

  const [output, setOutput] = useState("");

  const runCode = () => {

    try {

      const logs = [];

      const customConsole = {
        log: (...values) => {
          logs.push(
            values
              .map(value => String(value))
              .join(" ")
          );
        }
      };

      const run = new Function(
        "console",
        code
      );

      run(customConsole);

      setOutput(
        logs.join("\n") || "Code executed successfully."
      );

    } catch (error) {

      setOutput(
        "Error: " + error.message
      );

    }

  };


  const resetCode = () => {

    setCode(
`let name = "Student";

console.log(name);`
    );

    setOutput("");

  };


  return (
    <div className="code-editor">

      <div className="editor-header">

        <span>
          JavaScript Editor
        </span>

        <div>

          <button
            onClick={resetCode}
            className="editor-reset"
          >
            Reset
          </button>

          <button
            onClick={runCode}
            className="editor-run"
          >
            Run Code
          </button>

        </div>

      </div>


      <textarea
        className="code-input"
        value={code}
        onChange={(event) =>
          setCode(event.target.value)
        }
        spellCheck="false"
      />


      <div className="output-section">

        <div className="output-title">
          Output
        </div>

        <pre>
          {output || "Run your code to see the output."}
        </pre>

      </div>

    </div>
  );
}

export default CodeEditor;