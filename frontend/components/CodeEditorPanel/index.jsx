// frontend/src/components/CodeEditorPanel.js
import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditorPanel = ({
  language,
  setLanguage,
  theme,
  setTheme,
  isRunning,
  handleRunCode,
  handleSaveCode,
  handleEditorDidMount,
  handleEditorChange,
  editorHeight,
  editorWidth,
  onMouseDownEditor,
  children
}) => {
  const editorRef = useRef(null);

  const handleEditorDidMountWrapper = (editor, monaco) => {
    editorRef.current = editor;

    // Define a custom theme based on vs-dark
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark', // Start with the built-in dark theme
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1f2937', // This is the Tailwind CSS bg-gray-800 color
      },
    });

    // Call the original onMount prop if it exists
    if (handleEditorDidMount) {
      handleEditorDidMount(editor, monaco);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'vs-dark' ? 'light' : 'vs-dark';
    setTheme(newTheme);

    // Apply the new theme to the editor instance
    if (editorRef.current) {
      const monaco = editorRef.current.getModel()._languageId.monaco;
      monaco.editor.setTheme(newTheme === 'vs-dark' ? 'custom-dark' : 'light');
    }
  };

  return (
    <section className="flex-grow flex flex-col relative" style={{ width: editorWidth }}>
      <div className="p-4 bg-gray-900 text-white flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-lg font-mono">Code Editor</h2>
        <div className="flex gap-2">
          <button
            onClick={handleSaveCode}
            className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors shadow"
          >
            Save
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className={`px-4 py-2 text-white font-semibold rounded-md transition-colors shadow ${isRunning ? 'opacity-50 cursor-not-allowed bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 bg-gray-800 text-white rounded-md shadow cursor-pointer"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          <button
            onClick={toggleTheme}
            className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors shadow"
          >
            {theme === 'vs-dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      <div className="flex-grow flex flex-col relative">
        <div style={{ height: editorHeight }} className="relative flex-shrink-0">
          <Editor
            height="100%"
            language={language}
            theme={theme === 'vs-dark' ? 'custom-dark' : 'light'}
            onMount={handleEditorDidMountWrapper}
            onChange={handleEditorChange}
            options={{
              automaticLayout: true,
              minimap: { enabled: false }
            }}
          />
        </div>
        <div
          className="w-full h-2 cursor-row-resize bg-gray-700 hover:bg-gray-500 transition-colors"
          onMouseDown={onMouseDownEditor}
        />
        <div className="flex-grow overflow-auto">
          {children}
        </div>
      </div>
    </section>
  );
};

export default CodeEditorPanel;
