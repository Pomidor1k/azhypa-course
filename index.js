// app.js

const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Устанавливаем middleware для обработки статических файлов
app.use(express.static(path.join(__dirname, '')));

// Определяем маршрут для обработки запроса на video.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '', 'video.html'));
});

// Запускаем сервер на порту 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
