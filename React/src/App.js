import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function App() {
const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle summarization request
  // This function sends the text to the Flask backend for summarization
  // and updates the summary state with the response.
  const handleSummarize = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/summarize', { text });
      setSummary(response.data.summary);
    } catch (err) {
      alert('Error summarizing text.');
    } finally {
      setLoading(false);
    }
  };

  // Function to download the summary as a PDF
  // This function sends the summary to the Flask backend, which generates a PDF  
  const downloadPDF = async () => {
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/download-pdf',
        { summary },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'summary.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Failed to download PDF');
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>AI-Powered Blog Summarizer</h2>
      <TextField id="outlined-basic" label="Enter your Summary" variant="outlined"
        placeholder="Paste your blog content here..."
        rows={10}
        style={{ width: '100%', marginBottom: 10 }}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <Button variant="contained" onClick={handleSummarize} disabled={loading}>
        {loading ? 'Summarizing...' : 'Summarize'}
      </Button>

      {summary && (
        <div style={{ marginTop: 30 }}>
          <h3>Summary:</h3>
          <pre>{summary}</pre>
          <button onClick={downloadPDF}>Download PDF</button>
        </div>
      )}
    </div>
  );
}

export default App;
