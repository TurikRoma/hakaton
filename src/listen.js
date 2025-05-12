const { Client } = require("pg");
const axios = require("axios");

console.log("DATABASE_URL:", process.env.DATABASE_URL);

// Строка подключения к базе данных
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function listenForMessages() {
  await client.connect();

  // Подписка на канал 'new_message'
  await client.query("LISTEN new_message");

  console.log("🟢 Listening to new messages...");

  // Обработка уведомлений
  client.on("notification", async (msg) => {
    try {
      const response = await axios.get("http://localhost:3000/messages");
    } catch (err) {
      console.error("Ошибка парсинга:", err);
    }
  });

  // На случай ошибок
  client.on("error", (err) => {
    console.error("Ошибка подключения к PostgreSQL:", err);
  });
}

module.exports = { listenForMessages };
