import React, { useState } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Paper,
  Box,
  CircularProgress,
  Stack,
} from '@mui/material';
import SummarizeIcon from '@mui/icons-material/Notes';
import DownloadIcon from '@mui/icons-material/Download';

function App() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  // Send the article text to the Flask backend and retrieve the summary
  const handleSummarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post('http://127.0.0.1:8000/summarize', { text });
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      alert('Error summarizing text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Request the Flask backend to generate and stream a PDF version of the summary
  const downloadPDF = async () => {
    try {
      const { data } = await axios.post(
        'http://127.0.0.1:8000/download-pdf',
        { summary },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'summary.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error(err);
      alert('Failed to download PDF.');
    }
  };

  return (
    <>
      {/* Header */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <SummarizeIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AI Blog Summarizer
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
          <Stack spacing={3}>
            <Typography variant="subtitle1" color="text.secondary">
              Paste your blog or article text below — get a concise, AI‑generated summary in seconds.
            </Typography>

            {/* Input Field */}
            <TextField
              label="Article Text"
              placeholder="Paste your content here..."
              multiline
              minRows={8}
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            {/* Summarize Button */}
            <Box>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SummarizeIcon />}
                onClick={handleSummarize}
                disabled={loading || !text.trim()}
              >
                {loading ? 'Summarizing…' : 'Generate Summary'}
              </Button>
            </Box>

            {/* Summary Output */}
            {summary && (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {summary}
                </Typography>
                <Box textAlign="right" mt={2}>
                  <Button variant="outlined" startIcon={<DownloadIcon />} onClick={downloadPDF}>
                    Download as PDF
                  </Button>
                </Box>
              </Paper>
            )}
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

export default App;
