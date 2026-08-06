<p align="center">
  <img src="media/thumbnail.jpg" alt="ChiiBot Banner" width="400"/>
</p>

<h1 align="center">ChiiBot - Bot WhatsApp Multi-Device</h1>

<p align="center">
  <a href="https://github.com/AgusXzz/ChiiMD"><img src="https://img.shields.io/github/stars/AgusXzz/ChiiMD?style=for-the-badge&logo=github&color=ffc107" alt="Stars"></a>
  <a href="https://github.com/AgusXzz/ChiiMD/network/members"><img src="https://img.shields.io/github/forks/AgusXzz/ChiiMD?style=for-the-badge&logo=github&color=9c27b0" alt="Forks"></a>
  <a href="https://github.com/AgusXzz/ChiiMD/issues"><img src="https://img.shields.io/github/issues/AgusXzz/ChiiMD?style=for-the-badge&logo=github&color=red" alt="Issues"></a>
  <a href="https://github.com/AgusXzz/ChiiMD/blob/main/LICENSE"><img src="https://img.shields.io/github/license/AgusXzz/ChiiMD?style=for-the-badge&logo=github&color=blue" alt="License"></a>
</p>

<p align="center">
  <a href="https://chat.whatsapp.com/ELDiJRVGKAk5BpQ0o9cSr9?mode=hqrc"><img src="https://img.shields.io/badge/GROUP%20WHATSAPP-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Group WhatsApp"></a>
  <a href="https://whatsapp.com/channel/0029Vb5rT77Ae5Vqi7s27P3L"><img src="https://img.shields.io/badge/CHANNEL%20WHATSAPP-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Channel WhatsApp"></a>
</p>

<p align="center">
  <strong>ChiiBot</strong> adalah bot WhatsApp modern yang dibangun menggunakan <strong><a href="https://github.com/WhiskeySockets/Baileys">Baileys</a></strong> (multi-device). Ringan, mudah dikembangkan, dan dilengkapi <strong>game RPG lengkap</strong> dengan dunia fantasi <strong>Atheria</strong> yang hidup.
</p>

---

## 📝 Daftar Isi

- [✨ Fitur Utama](#-fitur-utama)
- [🎮 Dunia RPG: Atheria](#-dunia-rpg-atheria)
- [🚀 Instalasi & Penggunaan](#-instalasi--penggunaan)
- [💡 Cara Main RPG](#-cara-main-rpg)
- [📋 Daftar Command](#-daftar-command)
- [🔧 Konfigurasi](#-konfigurasi)
- [🗄️ Penyimpanan & Backup](#️-penyimpanan--backup)
- [📂 Struktur Proyek](#-struktur-proyek)
- [🛠️ Pengembangan](#️-pengembangan)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🤝 Kontribusi](#-kontribusi)
- [📄 Lisensi](#-lisensi)
- [🙏 Acknowledgments](#-acknowledgments)
- [📞 Kontak & Dukungan](#-kontak--dukungan)

---

## ✨ Fitur Utama

| Kategori           | Deskripsi                                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **AI**             | Percakapan cerdas via Deepseek, GPT, dan lainnya (`deepseek`)                                                                                          |
| **Downloader**     | Unduh dari TikTok, Instagram, YouTube (MP3/MP4), MediaFire, Sfile, Dafont, dan lainnya                                                                 |
| **Hiburan**        | `cekkhodam`, `truth`, `dare`, `gantengcek`, `akinator`, dan game interaktif lainnya                                                                    |
| **Manajemen Grup** | `hidetag`, `totag`, add/kick/promote/demote, buka/tutup grup, custom welcome/bye, antidelete                                                           |
| **Utilitas**       | Stiker, QR code, `hd`, ssweb, cekresi, read-view-once, dan lainnya                                                                                     |
| **RPG**            | Game RPG adventure/fantasy lengkap: kelas, battle turn-based, dungeon & boss, produksi, craft, guild, party, duel, pet, market, invasi, story campaign |
| **Sistem XP**      | Registrasi (`daftar`), level-up, role, leaderboard                                                                                                     |
| **Owner**          | Ban, premium, broadcast, backup, exec, restart, dan lainnya                                                                                            |

Semua fitur terorganisir sebagai **plugin** — setiap command adalah satu file di `plugins/` dan bisa di-hot-reload tanpa restart bot.

---

## 🎮 Dunia RPG: Atheria

Bot ini punya game RPG penuh yang terhubung dengan semua sistem lain. Dunia game-nya bernama **Atheria**, dengan kampung awal **Riverwood**.

### Kelas Karakter (`.kelas`)

| Kelas         | Peran                          | Skill                  |
| ------------- | ------------------------------ | ---------------------- |
| 🛡️ **Knight** | Seimbang, ATK & DEF tinggi     | Slash (serangan keras) |
| 🧱 **Tanker** | HP & DEF raksasa               | Shield Bash            |
| 🔮 **Mage**   | Damage sihir tembus pertahanan | Fireball               |
| 🏹 **Archer** | Critical tinggi                | Rapid Shot             |

### Area & Bos

| Area                 | Bos               |
| -------------------- | ----------------- |
| 🌲 Hutan Evermore    | King Thorne       |
| 🕳️ Gua Shadowdeep    | Grottak the Troll |
| 🏰 Kastil Duskhollow | Lord Vadrik       |
| 😈 Alam Netherrealm  | Malakor           |

### Sistem Utama

- **Kampanye Cerita (`.story`)** — 4 bab grindy yang mengikat semua sistem: kalahkan monster, kumpulkan material, craft item, kalahkan bos. Hadiah: item cerita eksklusif, gelar, dan **buff permanen +5%** (gelar _Pahlawan Atheria_).
- **NPC (`.npc`)** — dunia terasa hidup: 5 NPC layanan di Riverwood (Pandai Besi, Alkemis, Pelatih, Penyembuh, Pedagang) + NPC area yang memberi lore & petunjuk cerita. Saat `.explore` kamu juga bisa bertemu NPC acak.
- **Invasi Iblis (`.invasi`)** — bos raksasa spawn tiap beberapa jam; semua pemain bisa menyerang, reward dibagi sesuai kontribusi, plus drop item event-only.
- **Achievements (`.ach`)** — 16 pencapaian milestone dengan reward.
- **Pet (`.pet`)** — dari crate/story, bisa di-feed hingga Lv.10, memberi buff stat pasif.
- **Guild (`.guild`)** — standalone + kode undangan, XP guild → level → perk bonus.
- **Party (`.party`)** — co-op 4 pemain di grup melawan monster.

### Item yang Benar-benar Berguna

- **Rarity** — Common → Uncommon → Rare → Epic → Legendary → Mythic.
- **Stat permanen** — buku/tome stat (`.use`) & training (`.npc aldric`) menambah stat selamanya.
- **Buff berbasis babak** — ramuan/elixir memberi buff selama beberapa giliran battle (`.use`).
- **Equipment trait** — aktif di battle: `lifesteal`, `thorns`, `dodge`, `regen`, `xpBoost`, `goldFind`, `critBoost`.
- **Item eksklusif** — hanya bisa didapat dari sumber tertentu:
    - **Craft-only**: Pedang Api, Tombak Pemburu, Baju Es, dll (`.craft`).
    - **Boss-only**: Taring King Thorne, Tengkorak Grottak, dll (drop bos).
    - **Event-only**: Pedang Kegelapan, Kristal Iblis (dari `.invasi`).
    - **Story-only**: Biji Ajaib, Kristal Kegelapan, Cincin Naga.

---

## 🚀 Instalasi & Penggunaan

### Prasyarat

- **Node.js** v20 atau lebih tinggi (dibutuhkan Baileys)
- **bun** (direkomendasikan) **atau** npm/yarn sebagai package manager
- **Git** untuk cloning repository
- Koneksi internet yang stabil

### Langkah Instalasi

1. **Clone repository:**

    ```bash
    git clone https://github.com/AgusXzz/ChiiMD.git
    cd ChiiMD
    ```

2. **Install dependensi** (disarankan bun, karena proyek memakai `bun.lock`):

    ```bash
    bun install
    ```

    atau dengan npm:

    ```bash
    npm install
    ```

3. **Konfigurasi bot:**

    Edit `config.js` — set `global.owner` (nomor WhatsApp kamu) dan `global.pairingNumber`.

4. **Jalankan bot:**

    ```bash
    npm start
    ```

    atau langsung:

    ```bash
    node index.js
    ```

    Untuk produksi bisa dipantau dengan **PM2**:

    ```bash
    pm2 start index.js --name chii
    ```

5. **Hubungkan ke WhatsApp:**

    Kode pairing akan muncul di terminal. Buka WhatsApp → _Settings → Linked Devices → Link a Device_ → masukkan kode tersebut.

---

## 💡 Cara Main RPG

1. **Registrasi:** ketik `.daftar Nama.umur` (contoh: `.daftar Budi.17`)
2. **Pilih kelas:** `.kelas` → pilih Knight/Tanker/Mage/Archer (tombol)
3. **Jelajah:** `.explore` — bisa ketemu monster, harta, perangkap, atau NPC acak
4. **Bertarung:** battle turn-based via tombol (Attack / Skill / Defend / Potion / Flee)
5. **Produksi:** `.mine`, `.buru`, `.mancing`, `.nebang`, `.farm` untuk mengumpulkan material
6. **Craft & upgrade:** `.craft`, `.upgrade` (atau lewat NPC `.npc garrick`)
7. **Cerita:** `.story` — ikuti bab demi bab sampai jadi _Pahlawan Atheria_
8. **Sosial:** `.guild`, `.party`, `.duel`
9. **Naikkan stat:** `.use buku_kekuatan`, `.use ramuan_kekuatan`, `.npc aldric`, `.npc sera`
10. **Ikut event:** `.invasi` saat bos invasi muncul

Tips: periksa `.profile` untuk stat lengkap, `.inv` untuk item, `.ach` untuk pencapaian, dan `.top` untuk leaderboard.

---

## 📋 Daftar Command

Prefix default: `.` (karakter prefix lengkap ada di `main.js` → `global.prefix`).

### RPG

| Command                                      | Fungsi                                     |
| -------------------------------------------- | ------------------------------------------ |
| `.daftar Nama.umur` / `.profile`             | Registrasi & profil                        |
| `.kelas`                                     | Pilih kelas                                |
| `.explore`                                   | Jelajah area (monster/harta/perangkap/NPC) |
| `.attack` `.skill` `.defend` `.heal` `.flee` | Aksi battle                                |
| `.dungeon` / `.boss`                         | Dungeon 5 stage / tantang bos              |
| `.farm` `.tanam` `.panen`                    | Bertani                                    |
| `.mine` `.buru` `.mancing` `.nebang`         | Produksi material                          |
| `.craft` `.recipes`                          | Crafting                                   |
| `.upgrade`                                   | Naikkan level equipment/alat               |
| `.inv` `.use` `.equip` `.unequip`            | Inventori & item                           |
| `.shop` `.buy` `.sell`                       | Beli/jual ke NPC (termasuk `.buy limit`)   |
| `.market`                                    | Market antar pemain (escrow + fee)         |
| `.bank` `.deposit` `.withdraw`               | Bank                                       |
| `.transfer`                                  | Transfer money antar pemain                |
| `.open`                                      | Buka crate                                 |
| `.pet`                                       | Pelihara pet                               |
| `.duel`                                      | Duel 1v1 (dengan bet opsional)             |
| `.guild`                                     | Kelola guild                               |
| `.party`                                     | Party co-op grup                           |
| `.quest` `.daily` `.weekly`                  | Quest harian/mingguan                      |
| `.story`                                     | Kampanye cerita                            |
| `.npc`                                       | Ngobrol dengan NPC                         |
| `.invasi`                                    | Event Invasi Iblis                         |
| `.ach`                                       | Achievement                                |
| `.top`                                       | Leaderboard                                |

### Umum

| Command                                                                      | Fungsi                                        |
| ---------------------------------------------------------------------------- | --------------------------------------------- |
| `.menu`                                                                      | Menu utama                                    |
| `.afk [alasan]`                                                              | Set AFK                                       |
| `.sticker`                                                                   | Buat stiker dari media                        |
| `.qrcode <teks>`                                                             | Buat QR code                                  |
| `.hd` / `.hdr`                                                               | Tingkatkan kualitas gambar                    |
| `.tiktok` `.igdl` `.ytmp3` `.ytmp4` `.yts`                                   | Downloader                                    |
| `.deepseek`                                                                  | AI chat                                       |
| `.hidetag` `.totag` `.add` `.kick` `.promote` `.demote` `.opengc` `.closegc` | Manajemen grup                                |
| `.setwelcome` `.setbye` `.setpromote` `.setdemote`                           | Custom pesan grup                             |
| `.enable` / `.disable`                                                       | Atur fitur (welcome, detect, antidelete, dll) |
| `.rvo`                                                                       | Baca pesan view-once                          |
| `.ssweb`                                                                     | Screenshot website                            |
| `.cekkhodam` `.truth` `.dare` `.akinator`                                    | Hiburan                                       |

### Owner

| Command                                 | Fungsi                                |
| --------------------------------------- | ------------------------------------- |
| `.backup`                               | Backup data + sessions manual         |
| `.broadcast <teks>`                     | Kirim pesan massal (group/user/owner) |
| `.plugin list/enable/disable`           | Kelola plugin                         |
| `.ban` `.unban` `.banchat` `.unbanchat` | Ban user/chat                         |
| `.addprem` `.delprem` `.listpremium`    | Manajemen premium                     |
| `.exec` / `$`                           | Eksekusi kode                         |
| `.restart`                              | Restart bot                           |
| `.simulate`                             | Simulasi pesan                        |

---

## 🔧 Konfigurasi

Konfigurasi utama ada di `config.js` — semuanya adalah assignment ke **`global.*`** (bukan `module.exports`):

```javascript
global.pairingNumber = 6285955111472; // Nomor untuk pairing code
global.owner = [['6287701656619', 'Agus', true]]; // [nomor, nama, isDeveloper]
global.namebot = 'ChiiBOT - MD';
```

**Parameter penting:**

- `global.owner` — daftar owner `[nomor, nama, isDeveloper]` (developer menerima log error via WhatsApp)
- `global.pairingNumber` — nomor tujuan pairing code saat login
- `global.prefix` (di `main.js`, bukan `config.js`) — karakter prefix command
- `global.emoji` — peta emoji item RPG (satu sumber kebenaran untuk semua emoji item)
- `global.multiplier` — tingkat kesulitan leveling XP
- `global.pakasir.apikey` — bisa dioverride via env `PAKASIR_APIKEY`

---

## 🗄️ Penyimpanan & Backup

- **Data bot** disimpan di SQLite: `data/database.db` dengan satu tabel per collection:
  `users`, `chats`, `settings`, `stats`, `sticker`, `guilds`, `market` (satu baris per entitas, bukan blob JSON).
  Akses via `global.db.data.*` yang berupa Proxy in-memory dengan **deep-track** — mutasi bersarang
  (mis. `user.inventory.iron++`) otomatis tersimpan.
- **Sesi WhatsApp** ada di `sessions/` (SQLite).
- **Backup otomatis** berjalan tiap 6 jam ke `backup/` (menyimpan 5 backup terakhir) — atau manual via `.backup`.

Kedua folder (`data/`, `sessions/`, `backup/`, `tmp/`) sudah di-gitignore.

---

## 📂 Struktur Proyek

```
ChiiMD/
├── plugins/          # Semua fitur (satu file per command/plugin, hot-reload)
├── lib/              # Helper & library
│   ├── simple.js     # Wrapper Baileys socket (smsg, sendFile, sendButton, dll)
│   ├── database.js   # Store SQLite + Proxy deep-track + default shape user
│   ├── rpg.js        # Engine game RPG (item, kelas, area, resep, cerita, dll)
│   ├── backup.js     # Backup data + sessions
│   ├── levelling.js  # Rumus XP/level
│   ├── converter.js  # Konversi media (ffmpeg)
│   └── ...           # exif, print, store, useSQLite
├── media/            # Aset statis (gambar, dll)
├── data/             # Database SQLite bot (data/database.db)
├── sessions/         # Sesi autentikasi WhatsApp
├── backup/           # Backup otomatis
├── config.js         # Konfigurasi utama (global.*)
├── index.js          # Supervisor (worker thread, restart otomatis)
├── main.js           # Worker utama (socket, DB, loader plugin)
├── handler.js        # Dispatcher pesan → plugin
└── package.json      # Dependensi & skrip
```

---

## 🛠️ Pengembangan

### Menambah Command

Buat file `plugins/<nama>.js`:

```javascript
let handler = async (m) => {
	m.reply('halo!');
};
handler.help = ['halo'];
handler.tags = ['info'];
handler.command = ['halo'];
export default handler;
```

- `.command` huruf kecil tanpa prefix. Plugin **hot-reload** otomatis saat file disimpan.
- `this` di dalam handler adalah socket Baileys; `m` adalah pesan ter-serialisasi (`m.reply`, `m.react`, `m.sender`, `m.isGroup`).
- File berawalan `_` adalah logic non-command (guard/helper).

### Perintah Berguna

```bash
npm run lint    # ESLint
npm run format  # Prettier --write .
npm start       # Jalankan bot
```

Tidak ada test suite — verifikasi dengan `node --check <file>` + `npm run lint`.

### Gotcha

- Konfigurasi memakai `global.*` (bukan `module.exports` seperti README versi lama).
- Prefix command di-hardcode di `main.js`, bukan di `config.js`.
- `main.js` di working tree adalah versi **deobfuscated**; versi di git masih obfuscated — kerjakan dari working tree.

---

## 🛠️ Troubleshooting

### Bot tidak bisa terhubung ke WhatsApp

- Pastikan pairing code benar dan nomor `global.pairingNumber` sesuai
- Periksa koneksi internet
- Hapus folder `sessions/` lalu jalankan ulang untuk pairing baru

### Error saat instalasi dependensi (better-sqlite3)

`better-sqlite3` kadang butuh rebuild untuk arsitektur tertentu:

```bash
npm rebuild better-sqlite3
```

### Bot crash atau error

- Periksa log terminal / PM2 (`pm2 logs chii`)
- Pastikan Node.js v20+ dan semua dependensi terinstall
- Data tidak hilang — `data/` dan `sessions/` di-backup otomatis ke `backup/`

---

## 🤝 Kontribusi

Kontribusi sangat diterima!

1. **Fork repository ini**
2. **Buat branch:**
    ```bash
    git checkout -b fix/nama-bug
    ```
3. **Commit:** `git commit -m "Fix: deskripsi singkat"`
4. **Push:** `git push origin fix/nama-bug`
5. **Buka Pull Request**

**Guidelines:** commit message jelas, ikuti style code yang ada, test sebelum PR, dan update dokumentasi bila perlu.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- [Baileys](https://github.com/WhiskeySockets/Baileys) — library WhatsApp Web API
- Semua kontributor yang telah membantu mengembangkan proyek ini
- Komunitas open source yang terus memberikan dukungan

---

## 📞 Kontak & Dukungan

- **Group WhatsApp:** [Join Group](https://chat.whatsapp.com/ELDiJRVGKAk5BpQ0o9cSr9?mode=hqrc)
- **Channel WhatsApp:** [Follow Channel](https://whatsapp.com/channel/0029Vb5rT77Ae5Vqi7s27P3L)
- **Issues:** [GitHub Issues](https://github.com/AgusXzz/ChiiMD/issues)

---

<p align="center">
  <em>Dibuat dengan ❤️ oleh <a href="https://github.com/AgusXzz">AgusXzz</a></em>
</p>

<p align="center">
  <strong>⭐ Jika proyek ini bermanfaat, jangan lupa berikan star! ⭐</strong>
</p>
