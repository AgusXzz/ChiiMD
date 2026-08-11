/*import cp, { exec as _exec } from 'child_process';
import { promisify } from 'util';
let exec = promisify(_exec).bind(cp);

let handler = async (m, { usedPrefix, command, text }) => {
	let ar = Object.keys(plugins);
	let ar1 = ar.map((v) => v.replace('.js', ''));
	if (!text) throw `uhm.. where the text?\n\nexample:\n${usedPrefix + command} info`;
	if (!ar1.includes(text)) throw `*🗃️ NOT FOUND!*\n==================================\n\n${ar1.map((v) => ' ' + v).join`\n`}`;
	let o;
	try {
		o = await exec('cat plugins/' + text + '.js');
	} catch (e) {
		o = e;
	} finally {
		let { stdout, stderr } = o;
		if (stdout.trim()) m.reply(stdout);
		if (stderr.trim()) m.reply(stderr);
	}
};
handler.help = ['getplugin'].map((v) => v + ' <text>');
handler.tags = ['owner'];
handler.command = /^(getplugin|gp)$/i;
handler.owner = true;

export default handler;*/
import fs from 'fs';
import path from 'path';
import { generateWAMessageFromContent } from 'baileys';
function getFileIcon(filename) {
  const ext = path.extname(filename).toLowerCase();
  const icons = {
    '.js': '📜', '.mjs': '📜', '.cjs': '📜',
    '.ts': '📘', '.json': '📋', '.md': '📝',
    '.txt': '📄', '.yml': '⚙️', '.yaml': '⚙️'
  };
  return icons[ext] || '📄';
}
function listAllPlugins(baseDir) {
  let availablePlugins = [];
  const items = fs.readdirSync(baseDir);
  for (const item of items) {
    const itemPath = path.join(baseDir, item);
    try {
      if (fs.statSync(itemPath).isDirectory()) {
        const subItems = fs.readdirSync(itemPath);
        for (const subItem of subItems) {
          if (subItem.endsWith('.js')) {
            availablePlugins.push(`${item}/${subItem.replace('.js', '')}`);
          }
        }
      } else if (item.endsWith('.js')) {
        availablePlugins.push(item.replace('.js', ''));
      }
    } catch (e) {
      continue;
    }
  }
  return availablePlugins.sort();
}

function searchPluginsByContent(baseDir, query) {
  const results = [];
  const queryLower = query.toLowerCase();
  const items = fs.readdirSync(baseDir);

  const checkFile = (fullPath, pluginName) => {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.toLowerCase().includes(queryLower)) {
        results.push(pluginName);
      }
    } catch (e) {
      
    }
  };

  for (const item of items) {
    const itemPath = path.join(baseDir, item);
    try {
      if (fs.statSync(itemPath).isDirectory()) {
        const subItems = fs.readdirSync(itemPath);
        for (const subItem of subItems) {
          if (subItem.endsWith('.js')) {
            checkFile(path.join(itemPath, subItem), `${item}/${subItem.replace('.js', '')}`);
          }
        }
      } else if (item.endsWith('.js')) {
        checkFile(itemPath, item.replace('.js', ''));
      }
    } catch (e) {
      continue;
    }
  }

  return results.sort();
}
async function sendPluginListMessage(conn, m, { bodyText, listTitle, pluginNames, usedPrefix, command }) {
  const rows = pluginNames.map((v) => {
    const name = v.includes('/') ? v.split('/').pop() : v;
    const folder = v.includes('/') ? v.split('/')[0] : null;
    return {
      title: name,
      description: folder ? `📁 ${folder}` : '',
      id: `${usedPrefix + command} ${v}`
    };
  });

  const sections = [];
  for (let i = 0; i < rows.length; i += 10) {
    sections.push({
      title: `Hasil ${i + 1}-${Math.min(i + 10, rows.length)}`,
      rows: rows.slice(i, i + 10)
    });
  }

  await conn.sendButton(m.chat, {
    body: bodyText,
    footer: `📊 ${pluginNames.length} plugin ditemukan`,
    buttons: [
      {
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: listTitle,
          sections
        })
      }
    ]
  }, { quoted: m });
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      "📦 *Ambil Plugin*\n\n" +
      "Cara penggunaan:\n" +
      `• ${usedPrefix + command} tools/ping\n` +
      `• ${usedPrefix + command} ping\n` +
      `• ${usedPrefix + command} ai/chatgpt\n\n` +
      "Plugin akan ditampilkan dalam format preview kode (full)."
    );
  }

  const input = text.trim();
  const baseDir = path.join(process.cwd(), 'plugins');
  let filePath = null;
  let pluginName = input;

  if (input.includes('/')) {
    filePath = path.join(baseDir, input + '.js');
    pluginName = input.split('/').pop();
  } else {
    const folders = fs.readdirSync(baseDir);
    for (const folder of folders) {
      const possible = path.join(baseDir, folder, input + '.js');
      if (fs.existsSync(possible)) {
        filePath = possible;
        pluginName = `${folder}/${input}`;
        break;
      }
    }

    if (!filePath) {
        const rootPossible = path.join(baseDir, input + '.js');
        if (fs.existsSync(rootPossible)) {
            filePath = rootPossible;
            pluginName = input;
        }
    }
  }

  if (!filePath || !fs.existsSync(filePath)) {
    const availablePlugins = listAllPlugins(baseDir);
    const matches = searchPluginsByContent(baseDir, input);
    if (matches.length > 0) {
      return sendPluginListMessage(conn, m, {
        bodyText: `🔍 Plugin *${input}* tidak ditemukan persis, tapi teks itu ada di isi plugin berikut. Pilih salah satu:`,
        listTitle: 'Lihat Hasil',
        pluginNames: matches,
        usedPrefix,
        command
      });
    }

    return sendPluginListMessage(conn, m, {
      bodyText: `❌ Plugin *${input}* tidak ditemukan.\n\nBerikut daftar semua plugin yang tersedia:`,
      listTitle: 'Daftar Plugin',
      pluginNames: availablePlugins,
      usedPrefix,
      command
    });
  }

  let code = fs.readFileSync(filePath, 'utf8');
  const stats = fs.statSync(filePath);
  const linesCount = code.split('\n').length;
  const fileSize = stats.size;
  
  const sizeText = fileSize < 1024 ? `${fileSize} B` : 
                  fileSize < 1024 * 1024 ? `${(fileSize / 1024).toFixed(1)} KB` : 
                  `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
  
  const icon = getFileIcon(pluginName);
  
  const codeBlocks = [];
  const lines = code.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let highlightType = 0;
    let trimmed = line.trim();
    
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      highlightType = 1;
    } else if (/\b(export|return|case|break|default|command|tags|help)\b/.test(trimmed)) {
      highlightType = 3;
    } else if (/\b(import|const|let|var|async|await|function|if|else|for|while|switch|try|catch|class|new|typeof)\b/.test(trimmed)) {
      highlightType = 2;
    }
    
    codeBlocks.push({
      highlightType: highlightType,
      codeContent: line + '\n'
    });
  }
  
  const subcontent = [
    {
      messageType: 5,
      codeMetadata: {
        codeLanguage: "javascript",
        codeBlocks: codeBlocks
      }
    }
  ];
  
  const msg = generateWAMessageFromContent(
    m.chat,
    {
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            submessages: subcontent,
            contextInfo: {
              forwardingScore: 999,
              isForwarded: true,
              forwardedAiBotMessageInfo: {
                botJid: "867051314767696@bot"
              },
              forwardOrigin: 4
            }
          }
        }
      }
    },
    {
      userJid: conn.user.id,
      quoted: m
    }
  );
  
  await conn.relayMessage(m.chat, msg.message, {
    messageId: msg.key.id
  });
};

handler.help = ['getplugin', 'gp'];
handler.tags = ['owner'];
handler.command = /^(gp|gplugin|getplugin)$/i;
handler.owner = true;

export default handler;
	  
