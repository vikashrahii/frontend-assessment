// textNode.js

import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

// Helper function to extract variables from text ({{ variableName }})
const extractVariables = (text) => {
  const variableRegex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const variables = [];
  let match;
  
  while ((match = variableRegex.exec(text)) !== null) {
    const varName = match[1];
    if (!variables.includes(varName)) {
      variables.push(varName);
    }
  }
  
  return variables;
};

export const TextNode = ({ id, data }) => {
  const { updateNodeField } = useStore();
  const textareaRef = useRef(null);
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);

  // Extract variables whenever text changes
  useEffect(() => {
    const extractedVars = extractVariables(currText);
    setVariables(extractedVars);
    updateNodeField(id, 'text', currText);
    updateNodeField(id, 'variables', extractedVars);
  }, [currText, id, updateNodeField]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.max(60, scrollHeight)}px`;
    }
  }, [currText]);

  const handleTextChange = (e) => {
    setCurrText(e.target.value);
  };

  // Calculate node dimensions based on content
  // Width adjusts based on text length, height adjusts based on textarea and number of variables
  const textWidth = Math.max(200, Math.min(400, currText.length * 8 + 40));
  const baseHeight = 100;
  const variableHandleHeight = variables.length > 0 ? variables.length * 25 : 0;
  const textareaHeight = textareaRef.current ? Math.max(60, textareaRef.current.scrollHeight) : 60;
  const nodeHeight = Math.max(baseHeight, baseHeight + variableHandleHeight + (textareaHeight - 60));

  return (
    <div style={{
      minWidth: textWidth,
      width: textWidth,
      minHeight: nodeHeight,
      height: 'auto',
      padding: '12px',
      border: '1px solid black',
      borderRadius: '4px',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {/* Dynamic Target Handles for variables */}
      {variables.map((varName, index) => (
        <Handle
          key={`target-${varName}-${index}`}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{ 
            top: `${((index + 1) * 100) / (variables.length + 1)}%`
          }}
          label={varName}
        />
      ))}

      <div>
        <span style={{ fontWeight: 'bold' }}>Text</span>
      </div>
      <div>
        <label>
          Text:
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleTextChange}
            placeholder="Enter text. Use {{variableName}} for variables"
            rows={3}
            style={{
              width: '100%',
              padding: '4px',
              marginTop: '4px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: '60px',
              boxSizing: 'border-box'
            }}
          />
        </label>
        {variables.length > 0 && (
          <div style={{ 
            fontSize: '10px', 
            color: '#666', 
            marginTop: '4px',
            fontStyle: 'italic'
          }}>
            Variables detected: {variables.join(', ')}
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
      />
    </div>
  );
}
