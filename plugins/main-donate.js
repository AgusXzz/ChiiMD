import axios from 'axios'
import { delay } from 'baileys'

let handler = async (m, { text }) => {
	const nominal = parseInt(text)
	if (!nominal) return m.reply('Jumlahnya berapa?')
	if (nominal < 1000) return m.reply('Minimal 1.000 ya.')
	if (nominal > 1000000) return m.reply('Emg bneran?')

	if (!global.pakasir || !pakasir.slug || !pakasir.apikey) return m.reply('`pakasir.slug` dan `pakasir.apikey` belum di isi.')

	const cqris = await createQris(pakasir.slug, pakasir.apikey, nominal)
	const expiredAt = new Date(cqris.expired_at)
	expiredAt.setHours(expiredAt.getHours() - 1)
	expiredAt.setMinutes(expiredAt.getMinutes() + (global.pakasir.expired || 1))
	const expiredTime = expiredAt.toLocaleTimeString('id-ID', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: 'Asia/Jakarta',
	})

	const sQris = await conn.sendMessage(
		m.chat,
		{
			image: { url: `https://quickchart.io/qr?text=${encodeURIComponent(cqris.payment_number)}` },
			caption:
				`💳 *QRIS DONASI ${global.namebot || 'BOT'}*\n\n` +
				`🕓 *Expired:* ${expiredTime} WIB\n` +
				`💸 *Biaya Admin:* Rp${cqris.fee.toLocaleString('id-ID')}\n` +
				`💰 *Total:* Rp${cqris.total_payment.toLocaleString('id-ID')}\n` +
				`📦 *Order ID:* #${cqris.order_id}`,
		},
		{ quoted: m }
	)

	let status = ''
	while (status !== 'completed') {
		if (new Date() >= expiredAt) {
			await conn.sendMessage(m.chat, { delete: sQris.key })
			return m.reply('⚠️ QRIS sudah *expired*, silakan buat ulang.')
		}

		const res = await checkStatus(pakasir.slug, pakasir.apikey, cqris.order_id, nominal)
		if (res && res.status === 'completed') {
			status = 'completed'
			await conn.sendMessage(m.chat, { delete: sQris.key })
			m.reply('✅ Pembayaran berhasil!\nTerima kasih sudah donasi 🙏')
			break
		}

		await delay(5000)
	}
}

handler.help = ['donate']
handler.tags = ['main']
handler.command = /^(donate|donasi|traktir)$/i
export default handler

async function createQris(project, apikey, amount) {
	try {
		const res = await axios.post(
			'https://app.pakasir.com/api/transactioncreate/qris',
			{
				project,
				order_id: (global.namebot || 'BOT').replace(/\s/g, '_') + '-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
				amount,
				api_key: apikey,
			},
			{ headers: { 'Content-Type': 'application/json' } }
		)

		if (!res.data?.payment) throw new Error('Gagal membuat QRIS.')
		return res.data.payment
	} catch (e) {
		throw e
	}
}

async function checkStatus(project, apikey, orderId, amount) {
	try {
		const res = await axios.get(`https://app.pakasir.com/api/transactiondetail?project=${project}&amount=${amount}&order_id=${orderId}&api_key=${apikey}`)
		return res.data.transaction
	} catch (e) {
		throw e
	}
}
