// index.js
import TelegramBot from './bot.js';

// Ganti dengan token bot kamu
const botToken = '7616969823:AAFglRaOaVE0ek0u0QbYXYgI6JY8IUN4M6E';
const bot = new TelegramBot(botToken);

// Polling Loop
let offset = 0;
async function poll() {
  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset + 1}&timeout=30`);
      const data = await res.json();

      for (const update of data.result) {
        offset = update.update_id;
        await bot.handleUpdate(update);
      }
    } catch (err) {
      console.error('Polling error:', err);
      await new Promise(r => setTimeout(r, 3000)); // delay retry
    }
  }
}

poll();
