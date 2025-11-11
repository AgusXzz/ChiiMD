import fs from 'fs'
import path from 'path'

let handler = (m) => m
handler.all = async function (m, { __dirname }) {
	global.thumbnail = fs.readFileSync(path.resolve(__dirname, '../media/thumbnail.jpg'))
	global.pathResolve = (pathh) => path.resolve(__dirname, pathh)
}

export default handler
