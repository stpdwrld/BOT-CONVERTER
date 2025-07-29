import TelegramBot from './bot.js';

const TOKEN = '7616969823:AAFglRaOaVE0ek0u0QbYXYgI6JY8IUN4M6E';

const bot = new TelegramBot(TOKEN);

let offset = 0;

async function poll() {
  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${offset + 1}&timeout=30`);
      const data = await res.json();

      if (!data.ok) {
        console.error('Telegram API Error:', data);
        await new Promise(r => setTimeout(r, 5000));
        continue;
      }

      for (const update of data.result) {
        offset = update.update_id;
        await bot.handleUpdate(update);
      }
    } catch (e) {
      console.error('Polling error:', e);
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

poll();
console.log('Bot polling started...');
