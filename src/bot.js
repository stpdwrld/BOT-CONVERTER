import {
  generateClashConfig,
  generateNekoboxConfig,
  generateSingboxConfig
} from './configGenerators.js';

export default class TelegramBot {
  constructor(token, apiUrl = 'https://api.telegram.org') {
    this.token = token;
    this.apiUrl = apiUrl;
  }

  async handleUpdate(update) {
    if (!update.message) {
      console.log('⚠️ Unhandled update:', update);
      return new Response('OK', { status: 200 });
    }

    const chatId = update.message.chat.id;
    const text = update.message.text || '';

    if (text.startsWith('/start')) {
      await this.sendMessage(chatId, '🤖 Stupid World Converter Bot\n\nKirimkan saya link konfigurasi V2Ray dan saya akan mengubahnya ke format Singbox, Nekobox, dan Clash.\n\nContoh:\nvless://...\nvmess://...\ntrojan://...\nss://...\n\nCatatan:\n- Maksimal 10 link per permintaan.\n- Disarankan menggunakan Singbox versi 1.10.3 atau 1.11.8 untuk hasil terbaik.\n\nBaca baik-baik dulu sebelum nanya.');
    } else if (text.includes('://')) {
      try {
        const links = text.split('\n').filter(line => line.trim().includes('://'));

        if (links.length === 0) {
          await this.sendMessage(chatId, '⚠️ Tidak ditemukan link valid. Harap kirim link VMess, VLESS, Trojan, atau Shadowsocks.');
          return new Response('OK', { status: 200 });
        }

        if (links.length > 10) {
          await this.sendMessage(chatId, '⚠️ Maksimal 10 link per permintaan. Kurangi jumlah link dan coba lagi.');
          return new Response('OK', { status: 200 });
        }

        // Generate configuration files
        const clashConfig = await generateClashConfig(links, true);
        const nekoboxConfig = await generateNekoboxConfig(links, true);
        const singboxConfig = await generateSingboxConfig(links, true);

        // Send the generated files
        await this.sendDocument(chatId, clashConfig, 'clash.yaml', 'text/yaml');
        await this.sendDocument(chatId, nekoboxConfig, 'nekobox.json', 'application/json');
        await this.sendDocument(chatId, singboxConfig, 'singbox.bpf', 'application/json');

      } catch (error) {
        console.error('❌ Error processing links:', error);
        await this.sendMessage(chatId, `⚠️ Terjadi kesalahan saat mengubah link:\n\n${error.message}`);
      }
    } else {
      await this.sendMessage(chatId, '📥 Silakan kirim link VMess, VLESS, Trojan, atau Shadowsocks untuk diubah.');
    }

    return new Response('OK', { status: 200 });
  }

  async sendMessage(chatId, text) {
    const url = `${this.apiUrl}/bot${this.token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    const result = await response.json();
    if (!result.ok) {
      console.error('❌ Failed to send message:', result);
    }
    return result;
  }

  async sendDocument(chatId, content, filename, mimeType) {
    const formData = new FormData();
    const blob = new Blob([content], { type: mimeType });
    formData.append('document', blob, filename);
    formData.append('chat_id', chatId.toString());

    const response = await fetch(
      `${this.apiUrl}/bot${this.token}/sendDocument`, {
        method: 'POST',
        body: formData
      }
    );

    const result = await response.json();
    if (!result.ok) {
      console.error(`❌ Gagal mengirim ${filename}:`, result.description || result);
      await this.sendMessage(chatId, `Gagal mengirim file ${filename}: ${result.description || 'Unknown error'}`);
    }
    return result;
  }
}
