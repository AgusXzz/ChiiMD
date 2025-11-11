console.log('🐾 Starting...')

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import { createInterface } from 'readline'

// https://stackoverflow.com/a/50052194
const __dirname = dirname(fileURLToPath(import.meta.url))
const rl = createInterface(process.stdin, process.stdout)

let isRunning = false
let restartTimer = null

/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
	if (isRunning) return
	isRunning = true

	const args = [join(__dirname, file), ...process.argv.slice(2)]
	setupMaster({
		exec: args[0],
		args: args.slice(1),
	})
	const p = fork()

	if (restartTimer) {
		clearTimeout(restartTimer)
		restartTimer = null
	}

	p.on('message', (data) => {
		console.log('[RECEIVED]', data)
		switch (data) {
			case 'reset':
				p.process.kill()
				isRunning = false
				start.apply(this, arguments)
				break
			case 'uptime':
				p.send(process.uptime())
				break
		}
	})

	p.on('exit', (_, code) => {
		isRunning = false
		console.error('[❗] Exited with code:', code)
		if (code === 0) return

		restartTimer = setTimeout(
			() => {
				console.log('[⏰] Restarting automatically...')
				process.send('reset')
			},
			30 * 60 * 1000
		)

		watchFile(args[0], () => {
			unwatchFile(args[0])
			start(file)
		})
	})

	if (!rl.listenerCount('line')) {
		rl.on('line', (line) => {
			const cmd = line.trim().toLowerCase()
			if (!cmd) return
			if (cmd === 'exit') {
				console.log('[🛑] Exiting manually...')
				try {
					p.process.kill()
				} catch {}
				process.exit(0)
			} else p.send(cmd)
		})
	}
}

start('main.js')
