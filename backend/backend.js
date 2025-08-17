import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const OLLAMA_URL = "http://localhost:11434/api/generate";

app.post('/analyze', async (req, res) => {
  const prompt = req.body.prompt || "";

  if (!prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const response = await axios.post(OLLAMA_URL, {
      model: "mistral-small3.1:24b-instruct-2503-q4_K_M",
      prompt: prompt,
      stream: false
    });

    const feedback = response.data.response || "";
    res.json({ feedback });
  } catch (error) {
    console.error('Error contacting Ollama:', error.message);
    res.status(500).json({ error: 'Failed to get feedback from model.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});