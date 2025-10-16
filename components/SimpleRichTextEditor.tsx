import React, { useRef, useEffect } from 'react';

interface SimpleRichTextEditorProps {
  value: string;
  onChange: (newValue: string) => void;
}

// A button that doesn't steal focus from the editor when clicked.
const ToolbarButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    type="button"
    onMouseDown={(e) => {
      e.preventDefault(); // Prevent editor from losing focus on button click
      onClick();
    }}
    className={`p-2 rounded hover:bg-gray-200 bg-gray-100`}
  >
    {children}
  </button>
);

const SimpleRichTextEditor: React.FC<SimpleRichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const savedRange = useRef<Range | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  // Set the initial content of the editor only once on mount
  useEffect(() => {
    if (editorRef.current) {
        editorRef.current.innerHTML = value;
    }
  }, []); 

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Saves the current text selection if it's inside the editor
  const saveSelection = () => {
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)) {
        savedRange.current = selection.getRangeAt(0);
      }
    }
  };

  // Restores the saved text selection
  const restoreSelection = () => {
    if (savedRange.current && window.getSelection) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRange.current);
    }
  };

  // Applies a format command to the selection
  const applyFormat = (command: string, commandValue: string | null = null) => {
    editorRef.current?.focus();
    restoreSelection();
    document.execCommand(command, false, commandValue);
    handleInput();
  };

  const fontSizes = [
    { name: 'Small', value: '2' },
    { name: 'Normal', value: '3' },
    { name: 'Large', value: '5' },
    { name: 'Huge', value: '7' },
  ];
  
  const fontFamilies = ['Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New'];

  return (
    <div className="border border-gray-300 rounded-md">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 rounded-t-md">
        <ToolbarButton onClick={() => applyFormat('bold')}>
          <b className="w-5 h-5 block leading-5 text-center">B</b>
        </ToolbarButton>
        <div className="h-6 border-l mx-1"></div>
        
        <select 
          className="p-1.5 border-gray-300 rounded bg-white text-sm focus:ring-mango-orange focus:border-mango-orange"
          onChange={(e) => applyFormat('fontName', e.target.value)}
          onFocus={saveSelection} // Save selection before the dropdown steals focus
          value="" // Act like a button, not a stateful select
        >
          <option value="" disabled>Font</option>
          {fontFamilies.map(font => <option key={font} value={font} style={{fontFamily: font}}>{font}</option>)}
        </select>

        <select
          className="p-1.5 border-gray-300 rounded bg-white text-sm focus:ring-mango-orange focus:border-mango-orange"
          onChange={(e) => applyFormat('fontSize', e.target.value)}
          onFocus={saveSelection} // Save selection before the dropdown steals focus
          value="" // Act like a button, not a stateful select
        >
          <option value="" disabled>Size</option>
          {fontSizes.map(size => <option key={size.name} value={size.value}>{size.name}</option>)}
        </select>

        <div className="relative inline-flex items-center justify-center">
          <ToolbarButton onClick={() => {
            saveSelection(); // Save selection before opening color picker
            colorInputRef.current?.click();
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" /></svg>
          </ToolbarButton>
          <input
            ref={colorInputRef}
            type="color"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
                applyFormat('foreColor', e.target.value);
            }}
          />
        </div>

      </div>
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onBlur={saveSelection} // Fallback to save selection when focus is lost
        className="p-3 min-h-[150px] focus:outline-none"
        style={{ lineHeight: '1.6' }}
      />
    </div>
  );
};
export default SimpleRichTextEditor;