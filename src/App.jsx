import React, { useState } from 'react';
import { extractTextFromBlob } from './extractedText';

export default function App() {
  const [file, setFile]     = useState(null);
  const [output, setOutput] = useState('');

  const handleExtract = async () => {
    if (!file) return;
    setOutput('…working…');
    try {
      const text = await extractTextFromBlob(file);
      setOutput(text);
    } catch (err) {
      console.error(err);
      setOutput('❌ Extraction failed');
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'sans-serif',
        maxWidth: 600,
        margin: 'auto',
        background: '#e0e0e0', // <-- light grey background
        minHeight: '100vh',    // optional: makes background fill the viewport
      }}
    >
      <h1>Handwritten → Text</h1>
      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files?.[0] || null)}
      />
      {file && (
        <div style={{ margin: '1rem 0' }}>
          <img
            src={URL.createObjectURL(file)}
            alt="Preview"
            style={{ maxWidth: '100%', maxHeight: 300, border: '1px solid #ccc', borderRadius: 8 }}
          />
        </div>
      )}
      <button
        onClick={handleExtract}
        disabled={!file}
        style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
      >
        Extract Text
      </button>
      <pre style={{ marginTop: '1rem', background: '#f3f3f3', padding: '1rem', whiteSpace: 'pre-wrap' }}>
        {output}
      </pre>
    </div>
  );
}
