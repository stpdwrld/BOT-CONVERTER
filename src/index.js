import TelegramBot from './bot.js';

const TOKEN = '7616969823:AAFglRaOaVE0ek0u0QbYXYgI6JY8IUN4M6E'; // Ganti dengan token botmu

const bot = new TelegramBot(TOKEN);

let offset = 0;

async function poll() {
  console.log('Starting polling...');
  while (true) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${offset + 1}&timeout=30`);
      const data = await res.json();

      if (!data.ok) {
        console.error('Telegram API error:', data);
        await new Promise(r => setTimeout(r, 5000)); // Delay retry
        continue;
      }

      if (data.result.length > 0) {
        for (const update of data.result) {
          console.log('New update:', JSON.stringify(update));
          offset = update.update_id;
          await bot.handleUpdate(update);
        }
      } else {
        // No updates received
        // Optional: log or just skip
      }
    } catch (err) {
      console.error('Polling error:', err);
      await new Promise(r => setTimeout(r, 5000)); // Delay retry
    }
  }
}

poll();
