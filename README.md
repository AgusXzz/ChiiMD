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
  <strong>ChiiBot</strong> adalah bot WhatsApp modern yang dibangun menggunakan <strong><a href="https://github.com/WhiskeySockets/Baileys">Baileys</a></strong> dengan dukungan Multi-Device. Bot ini dirancang untuk memberikan pengalaman yang mudah digunakan, ringan, dan mudah dikembangkan.
</p>

---

## 📝 Daftar Isi

- [✨ Fitur Utama](#-fitur-utama)
- [🚀 Instalasi & Penggunaan](#-instalasi--penggunaan)
  - [Prasyarat](#prasyarat)
  - [Langkah Instalasi](#langkah-instalasi)
- [💡 Contoh Penggunaan](#-contoh-penggunaan)
- [🔧 Konfigurasi](#-konfigurasi)
- [📂 Struktur Proyek](#-struktur-proyek)
- [🛠️ Troubleshooting](#️-troubleshooting)
- [🤝 Kontribusi](#-kontribusi)
- [📄 Lisensi](#-lisensi)
- [🙏 Acknowledgments](#-acknowledgments)

---

## ✨ Fitur Utama

Bot ini dilengkapi dengan berbagai fitur yang terorganisir dalam plugin untuk memudahkan pengembangan dan maintenance.

| Kategori           | Deskripsi                                                                    |
| ------------------ | ---------------------------------------------------------------------------- |
| **AI**             | Terintegrasi dengan GPT, Deepseek, dan Kimi untuk percakapan cerdas         |
| **Downloader**     | Unduh media dari Instagram, TikTok, YouTube (MP3/MP4), MediaFire, dan lainnya |
| **Hiburan**        | Perintah seru seperti `cekkhodam`, `truth`, `dare`, dan game interaktif     |
| **Manajemen Grup** | Alat untuk admin seperti `hidetag`, `totag`, dan pengaturan grup            |
| **Utilitas**       | Buat stiker, QR code, tingkatkan kualitas gambar (`hd`), dan banyak lagi    |
| **Sistem XP**      | Sistem registrasi, level-up, dan tracking XP untuk pengguna                 |
| **Owner**          | Perintah khusus untuk pemilik bot (ban, premium, broadcast, dll)            |

---

## 🚀 Instalasi & Penggunaan

### Prasyarat

Pastikan sistem Anda memenuhi requirement berikut:

- **Node.js** v18.x atau lebih tinggi
- **npm** atau **yarn** sebagai package manager
- **Git** untuk cloning repository
- Koneksi internet yang stabil

### Langkah Instalasi

1. **Clone repository ini:**

   ```bash
   git clone https://github.com/AgusXzz/ChiiMD.git
   cd ChiiMD
   ```

2. **Install dependensi:**

   ```bash
   npm install
   ```

   Atau jika menggunakan yarn:

   ```bash
   yarn install
   ```

3. **Konfigurasi bot:**

   Edit file `config.js` sesuai kebutuhan Anda (nomor owner, prefix, dll).

4. **Jalankan bot:**

   ```bash
   npm start
   ```

   Atau:

   ```bash
   node index.js
   ```

5. **Hubungkan ke WhatsApp:**

   Masukkan pairing code yang muncul di terminal menggunakan aplikasi WhatsApp Anda untuk menghubungkan bot.

---

## 💡 Contoh Penggunaan

Berikut adalah beberapa contoh cara menggunakan perintah bot:

### Utilitas

- **Membuat stiker dari gambar:**
  ```
  Kirim gambar dengan caption: .sticker
  ```

- **Membuat QR code:**
  ```
  .qrcode https://example.com
  ```

### Downloader

- **Mengunduh video TikTok:**
  ```
  .tiktok https://www.tiktok.com/@username/video/12345
  ```

- **Mengunduh audio dari YouTube:**
  ```
  .ytmp3 [URL YouTube]
  ```

### AI & Hiburan

- **Menggunakan AI (GPT):**
  ```
  .gpt Siapakah penemu bola lampu?
  ```

- **Mencari tahu khodam Anda:**
  ```
  .cekkhodam
  ```

### Manajemen Grup

- **Hide tag (tag semua anggota):**
  ```
  .hidetag [pesan]
  ```

---

## 🔧 Konfigurasi

Anda dapat menyesuaikan berbagai aspek bot melalui file `config.js`:

```javascript
module.exports = {
  owner: ['62xxx'], // Nomor owner
  prefix: '.', // Prefix command
  botName: 'ChiiBot',
  // ... konfigurasi lainnya
}
```

**Parameter Konfigurasi:**

- `owner`: Array berisi nomor WhatsApp owner
- `prefix`: Karakter prefix untuk perintah bot
- `botName`: Nama bot yang akan ditampilkan
- Dan parameter lainnya sesuai kebutuhan

---

## 📂 Struktur Proyek

```
ChiiMD/
├── plugins/          # Folder utama untuk semua fitur bot
│   ├── ai/          # Plugin AI (GPT, Deepseek, dll)
│   ├── downloader/  # Plugin downloader
│   ├── fun/         # Plugin hiburan
│   └── ...          # Plugin lainnya
├── lib/             # Library dan helper functions
├── media/           # Aset media statis (gambar, audio, dll)
├── database/        # Database storage (optional)
├── config.js        # File konfigurasi utama
├── index.js         # File entri utama aplikasi
├── package.json     # Dependensi dan skrip proyek
└── README.md        # Dokumentasi proyek
```

---

## 🛠️ Troubleshooting

### Bot tidak bisa terhubung ke WhatsApp

- Pastikan Anda menggunakan pairing code yang benar
- Periksa koneksi internet Anda
- Hapus folder `session` dan coba hubungkan ulang

### Error saat instalasi dependensi

```bash
# Hapus node_modules dan package-lock.json
rm -rf node_modules package-lock.json

# Install ulang
npm install
```

### Bot crash atau error

- Periksa log error di terminal
- Pastikan Node.js versi 18.x atau lebih tinggi
- Periksa apakah semua dependensi terinstall dengan benar

---

## 🤝 Kontribusi

Kontribusi sangat diterima dan dihargai! Berikut adalah cara berkontribusi:

### Untuk Bug Fixes & Perbaikan Kecil

1. **Fork repository ini**
2. **Buat branch baru:**
   ```bash
   git checkout -b fix/nama-bug
   ```
3. **Commit perubahan Anda:**
   ```bash
   git commit -m "Fix: deskripsi singkat perbaikan"
   ```
4. **Push ke branch:**
   ```bash
   git push origin fix/nama-bug
   ```
5. **Buka Pull Request**

### Untuk Fitur Baru

1. **Buka issue terlebih dahulu** untuk mendiskusikan fitur yang ingin ditambahkan
2. Setelah disetujui, ikuti langkah yang sama seperti di atas dengan branch:
   ```bash
   git checkout -b feat/nama-fitur
   ```

### Guidelines

- Gunakan commit message yang jelas dan deskriptif
- Pastikan code Anda mengikuti style guide yang ada
- Test fitur Anda sebelum membuat PR
- Update dokumentasi jika diperlukan

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE). Anda bebas menggunakan, memodifikasi, dan mendistribusikan proyek ini sesuai ketentuan lisensi.

---

## 🙏 Acknowledgments

- [Baileys](https://github.com/WhiskeySockets/Baileys) - Library WhatsApp Web API
- Semua kontributor yang telah membantu mengembangkan proyek ini
- Komunitas open source yang terus memberikan dukungan

---

## 📞 Kontak & Dukungan

Jika Anda memiliki pertanyaan atau membutuhkan bantuan:

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
