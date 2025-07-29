import TelegramBot from './bot.js';

export default {
  async fetch(request, env) {
    if (request.method === 'POST') {
      try {
        const update = await request.json();
        const bot = new TelegramBot(env.7616969823:AAFglRaOaVE0ek0u0QbYXYgI6JY8IUN4M6E);
        return bot.handleUpdate(update);
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    return new Response('Method not allowed', { status: 405 });
  }
};
