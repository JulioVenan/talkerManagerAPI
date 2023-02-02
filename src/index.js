const express = require('express');

const { join } = require('path');
const fs = require('fs').promises;
const tokenGen = require('./utilites/tokengenerator');
const validateEmail = require('./utilites/validateEmail');
const validatePassword = require('./utilites/validatePassword');
const {
  validateToken,
  validateName,
  validateAge,
  validateTalk,
  validateRate,
} = require('./utilites/validateNewTalkers');

const path = join(__dirname, './talker.json');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
//

const readTalker = async () => {
  // const path = './talker.json';
  try {
    const contentFile = await fs.readFile(path, 'utf-8');
    return JSON.parse(contentFile);
  } catch (err) {
    return null;
  }
};

app.get('/talker', async (resq, res) => {
  const content = await readTalker();
  res.status(200).send(content);
});

app.get('/talker/search', validateToken, async (request, response) => {
  const { q } = request.query;
  const content = await readTalker();
  if (!q) {
    return response.status(200).json(content);
  }
  const listFiltered = content.filter((talker) => talker.name.includes(q));
  return response.status(200).json(listFiltered);
});

app.get('/talker/:id', async (reqs, res) => {
  const { id } = reqs.params;
  const content = await readTalker();
  const object = content.find((obj) => obj.id === Number(id));
  if (typeof object === 'object') {
    return res.status(200).send(object);
  }
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', validateEmail, validatePassword, async (req, res) => {
  const token = tokenGen();
  res.status(200).json({ token });
});

app.post('/talker', validateToken, validateName, validateAge, validateTalk, validateRate,
  async (request, response) => {
  const { name, age, talk } = request.body;
  const content = await readTalker();
  const id = content.length + 1;
  const newTalker = {
    id,
    name,
    age,
    talk,
  };
  const newList = [...content, newTalker];
  await fs.writeFile(path, JSON.stringify(newList));
  return response.status(201).json(newTalker);
});

app.put('/talker/:id', validateToken, validateName, validateAge, validateTalk, validateRate, 
async (reqs, res) => {
  const { id } = reqs.params;
  const { name, talk, age } = reqs.body;
  const content = await readTalker();
  const newTalker = {
    id: Number(id),
    name,
    age,
    talk,
  };
  const List = content.filter((talker) => Number(talker.id) !== Number(id));
  List.push(newTalker);
  await fs.writeFile(path, JSON.stringify(List));
  return res.status(200).json(newTalker);
});

app.delete('/talker/:id', validateToken, async (reqs, res) => {
  const { id } = reqs.params;
  const content = await readTalker();
  const newTalkerList = content.filter((talker) => Number(talker.id) !== Number(id));
  await fs.writeFile(path, JSON.stringify(newTalkerList));
  return res.status(204).send();
});

module.exports = app;