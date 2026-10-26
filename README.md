# ExPermit · Windows 桌面版

ExPermit 实验记录本的 **Windows 打包仓**。应用源码（网页层 + 数据模型 + 同步）在
[expermit-eln](https://github.com/fengtong2001-ui/expermit-eln)，本仓只负责壳的打包与发布。

## 结构

```
app/                  # 运行时由 scripts/fetch-core.mjs 生成，不入库
  www/                #   核心仓的网页包（www-<ver>.zip）
  shell/              #   核心仓的 Electron 壳（shell-<ver>.zip）
resources/update-config.json  # 指定“完整安装包/下载页”指向本仓
electron-builder.yml  # Windows 打包配置（NSIS 安装版 + 免安装版）
scripts/fetch-core.mjs        # 从核心 Release 取制品（或 --core 指向本地核心仓）
scripts/selftest.mjs          # 打包后无头自检，必须 SELFTEST OK
```

## 本地构建

```bash
npm install
node scripts/fetch-core.mjs --ver 0.1.4      # 或 --core ../expermit-eln 用本地产物
npx electron-builder --win
node scripts/selftest.mjs
```

产物在 `release/`：`ExPermit-Setup-<ver>.exe`、`ExPermit-Portable-<ver>.exe`。

## 发版

在 GitHub → Actions → **Build Windows** → Run workflow，填核心版本号。
它会取核心制品、打包、自检、把两个安装包上传到本仓 Release。

## 约定

- 网页层问题 → 改核心仓，不要在本仓改网页代码。
- 壳（`electron/main.cjs`）也属于核心仓，本仓只做打包。
- 升级机制：热更新（下载核心仓的网页包，秒级生效）→ 壳变更时回落本仓完整安装包。
  本仓的 `resources/update-config.json` 决定“下载页/安装包”指向哪个仓库。
