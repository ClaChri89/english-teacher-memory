const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'ClaChri89/english-teacher-memory';
const FILE_PATH = 'progresso.md';

app.get('/leggi-progresso', async (req, res) => {
  const response = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
  );
  const data = await response.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');
  res.send(content);
});

app.post('/aggiorna-progresso', async (req, res) => {
  const { contenuto } = req.body;
  const getRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
  );
  const getData = await getRes.json();

  await fetch(
    `https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`,
    {
      method: 'PUT',
      headers: { Authorization: `token ${GITHUB_TOKEN}` },
      body: JSON.stringify({
        message: 'Aggiornamento sessione inglese',
        content: Buffer.from(contenuto).toString('base64'),
        sha: getData.sha
      })
    }
  );
  res.json({ status: 'ok' });
});

app.listen(3000, () => console.log('Server avviato'));
