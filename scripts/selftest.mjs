// 打包后无头自检：跑 win-unpacked 里的 exe，必须输出 SELFTEST OK
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const exe = join(root, 'release', 'win-unpacked', 'ExPermit 实验记录本.exe')
if (!existsSync(exe)) {
  console.error(`找不到 ${exe}，先跑 electron-builder --win`)
  process.exit(1)
}
const out = []
const p = spawn(exe, ['--selftest'], { stdio: ['ignore', 'pipe', 'pipe'] })
p.stdout.on('data', (d) => out.push(String(d)))
p.stderr.on('data', (d) => out.push(String(d)))
const timer = setTimeout(() => {
  console.error('自检超时')
  p.kill()
  process.exit(1)
}, 90000)
p.on('exit', (code) => {
  clearTimeout(timer)
  const text = out.join('')
  console.log(text.trim())
  const ok = code === 0 && /SELFTEST OK/.test(text)
  console.log(ok ? '✓ 自检通过' : `✗ 自检失败（exit ${code}）`)
  process.exit(ok ? 0 : 1)
})
