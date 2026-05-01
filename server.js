import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/opposite", async (req, res) => {
  const { text } = req.body;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "user",
          content: `Convert this into opposite meaning: ${text}`,
        },
      ],
    }),
  });

  const data = await response.json();
  res.json({ result: data.choices[0].message.content });
});

app.listen(3000, () => console.log("Server running"));
