/**
 * 生成 ReadmeForge 演示 GIF
 * 模拟终端操作流程，逐帧渲染，ffmpeg 合成
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MAGICK = 'C:/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe';
const FRAMES = path.join(__dirname, '..', 'demo_frames');
const OUTPUT = path.join(__dirname, '..', 'demo.gif');

const W = 800;
const H = 500;
const FONT = 'Consolas';

// 清空帧目录
if (fs.existsSync(FRAMES)) fs.rmSync(FRAMES, { recursive: true });
fs.mkdirSync(FRAMES, { recursive: true });

function exec(c) {
  try { return execSync(c, { encoding: 'utf8', timeout: 30000 }); }
  catch(e) { console.error('CMD FAIL:', c.substring(0,80)); throw e; }
}

// 生成一帧: 给定文本行数组
function makeFrame(index, lines, highlightLine = -1) {
  const name = String(index).padStart(3, '0');

  // SVG 更适合文字渲染，生成 SVG → 转 PNG
  let svgText = '';
  lines.forEach((line, i) => {
    const y = 40 + i * 24;
    let color = '#cccccc';
    if (line.startsWith('## ')) color = '#6C63FF';
    else if (line.startsWith('# ') || line.startsWith('══')) color = '#00d4ff';
    else if (line.includes('✅') || line.includes('✓')) color = '#00ff88';
    else if (line.includes('❌') || line.includes('✗')) color = '#ff4444';
    else if (line.includes('?')) color = '#ffcc00';
    else if (line.startsWith('>') || line.startsWith('│')) color = '#888888';
    else if (line.includes('█')) color = '#00d4ff';

    if (i === highlightLine) color = '#ffffff';

    // 转义 SVG
    const escaped = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    svgText += `<text x="24" y="${y}" font-family="${FONT},monospace" font-size="15" fill="${color}" xml:space="preserve">${escaped}</text>\n`;
  });

  const totalH = lines.length * 24 + 60;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Math.max(totalH, H)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#161b22"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${Math.max(totalH, H)}" fill="url(#bg)"/>
  <!-- 终端顶部栏 -->
  <rect x="0" y="0" width="${W}" height="30" fill="#1a1f2e"/>
  <circle cx="18" cy="15" r="6" fill="#ff5f56"/>
  <circle cx="40" cy="15" r="6" fill="#ffbd2e"/>
  <circle cx="62" cy="15" r="6" fill="#27c93f"/>
  <text x="400" y="20" font-family="${FONT}" font-size="12" fill="#666" text-anchor="middle">readmeforge — PowerShell</text>
  ${svgText}
  <!-- 光标闪烁 -->
  ${highlightLine >= 0 ? `<rect x="24" y="${38 + highlightLine * 24 + 2}" width="10" height="17" fill="#ffffff" opacity="0.8">
    <animate attributeName="opacity" values="0.8;0.2;0.8" dur="0.8s" repeatCount="indefinite"/>
  </rect>` : ''}
</svg>`;

  const svgPath = path.join(FRAMES, `${name}.svg`);
  const pngPath = path.join(FRAMES, `${name}.png`);
  fs.writeFileSync(svgPath, svg);

  // SVG → PNG via ImageMagick
  exec(`"${MAGICK}" "${svgPath}" "${pngPath}"`);
  fs.unlinkSync(svgPath); // 清理 SVG
}

// ============================================================
// 演示场景 — 模拟 readmeforge 运行过程
// ============================================================

const scenes = [
  // Step 1: 运行命令
  { lines: [
    'C:\\Users\\hitaozhou> npx readmeforge',
  ], hl: 0 },

  // Step 2: Banner
  { lines: [
    'C:\\Users\\hitaozhou> npx readmeforge',
    '',
    '   ____             _         _____                ',
    '  |  _ \\ ___ __ _ _| |_ ___  |  ___|__ _ __  __ _ ',
    '  | |_) / _ \\/ _` | | | / _ \\ | |_ / _ \\| \'_ \\/ _` |',
    '  |  _ <  __/ (_| | | ||  __/ |  _| (_) | | | (_| |',
    '  |_| \\_\\___|\\__,_|_|_|\\___| |_|  \\___/|_|  \\__,_|',
    '',
    '  ✨ Generate stunning GitHub Profile README',
    '  🌍 CN/EN bilingual — 中英双语',
  ], hl: -1 },

  // Step 3: 语言选择
  { lines: [
    'C:\\Users\\hitaozhou> npx readmeforge',
    '',
    '   ____             _         _____                ',
    '  |  _ \\ ___ __ _ _| |_ ___  |  ___|__ _ __  __ _ ',
    '  | |_) / _ \\/ _` | | | / _ \\ | |_ / _ \\| \'_ \\/ _` |',
    '  |  _ <  __/ (_| | | ||  __/ |  _| (_) | | | (_| |',
    '  |_| \\_\\___|\\__,_|_|_|\\___| |_|  \\___/|_|  \\__,_|',
    '',
    '  ✨ Generate stunning GitHub Profile README',
    '  🌍 CN/EN bilingual — 中英双语',
    '',
    '? 🌍 选择语言 / Choose Language:',
    '  ❯ 🇨🇳 中文',
    '    🇺🇸 English',
  ], hl: 12 },

  // Step 4: 输入用户名
  { lines: [
    'C:\\Users\\hitaozhou> npx readmeforge',
    '',
    '  ✨ Generate stunning GitHub Profile README',
    '',
    '? 🌍 Choose Language: 🇨🇳 中文  ✓',
    '? 👤 你的 GitHub 用户名是？',
    '  » hitaozhou',
  ], hl: 6 },

  // Step 5: 输入名字
  { lines: [
    'C:\\Users\\hitaozhou> npx readmeforge',
    '',
    '  ✨ Generate stunning GitHub Profile README',
    '',
    '? 🌍 Choose Language: 🇨🇳 中文  ✓',
    '? 👤 你的 GitHub 用户名是？  hitaozhou  ✓',
    '? 📛 你希望展示的名字？',
    '  » Tao Zhou',
  ], hl: 7 },

  // Step 6: Tagline
  { lines: [
    'C:\\Users\\hitaozhou> npx readmeforge',
    '',
    '  ✨ Generate stunning GitHub Profile README',
    '',
    '? 👤 GitHub 用户名: hitaozhou  ✓',
    '? 📛 展示名字: Tao Zhou  ✓',
    '? 💬 一句话介绍自己（Tagline）？',
    '  » 全栈开发者 | 开源爱好者 | AI 探索者 🚀',
  ], hl: 7 },

  // Step 7: 选主题
  { lines: [
    'C:\\Users\\hitaozhou> npx readmeforge',
    '',
    '  ✨ Generate stunning GitHub Profile README',
    '',
    '? 👤 GitHub 用户名: hitaozhou  ✓',
    '? 📛 展示名字: Tao Zhou  ✓',
    '? 💬 Tagline: 全栈开发者 | 开源 | AI 🚀  ✓',
    '? 🎨 选择一个主题风格：',
    '  ❯ 🔵 Professional  — 专业、全面、适合求职',
    '    ⚪ Minimal       — 极简风格',
    '    🟣 Creative      — 多彩动感',
    '    🟢 Terminal       — 终端风格',
    '    🟡 Cyberpunk     — 霓虹赛博朋克',
  ], hl: 09 },

  // Step 8: 输入技能
  { lines: [
    'C:\\Users\\hitaozhou> npx readmeforge',
    '',
    '  ✨ Generate stunning GitHub Profile README',
    '',
    '? 🎨 主题: Professional  ✓',
    '? 🛠️ 你的技术栈（逗号分隔）：',
    '  » TypeScript, React, Node.js, Python, Docker, Go',
  ], hl: 06 },

  // Step 9: 确认选项
  { lines: [
    'C:\\Users\\hitaozhou> npx readmeforge',
    '',
    '  ✨ Generate stunning GitHub Profile README',
    '',
    '? 🛠️ 技术栈: TypeScript, React, Node.js...  ✓',
    '? 🔗 社交媒体链接: GitHub, Twitter, Blog  ✓',
    '? 📊 是否显示 GitHub 统计卡片？  Yes  ✓',
    '? 🏆 是否显示 GitHub 奖杯？  Yes  ✓',
    '? 👀 是否显示访客计数徽章？  Yes  ✓',
    '? 📁 输出目录： ./output',
  ], hl: 10 },

  // Step 10: 生成中
  { lines: [
    'C:\\Users\\hitaozhou> npx readmeforge',
    '',
    '  ✨ Generate stunning GitHub Profile README',
    '',
    '  ⠋ 🔨 正在生成你的专属 README...',
    '',
    '  ████████░░░░░░░░░░  40%',
  ], hl: 05 },

  // Step 11: 生成成功
  { lines: [
    'C:\\Users\\hitaozhou> npx readmeforge',
    '',
    '  ✨ Generate stunning GitHub Profile README',
    '',
    '  ✅ README 生成成功！',
    '',
    '  📋 生成的文件：',
    '    📄 C:\\output\\README.md',
    '    🔧 C:\\output\\.github\\workflows\\readmeforge-update.yml',
  ], hl: -1 },

  // Step 12: 下一步提示
  { lines: [
    'C:\\Users\\hitaozhou> npx readmeforge',
    '',
    '  ✅ README 生成成功！',
    '',
    '  📋 生成的文件：',
    '    📄 C:\\output\\README.md',
    '    🔧 C:\\output\\.github\\workflows\\readmeforge-update.yml',
    '',
    '  🚀 下一步：',
    '    1. 查看生成的 README.md',
    '    2. 放到 GitHub Profile 仓库根目录',
    '    3. 推送 .github/workflows 启用自动更新',
    '',
    '  ⭐ 如果觉得好用，给 ReadmeForge 点个 Star！',
  ], hl: -1 },

  // Step 13: 预览效果 — 展示生成的 README 片段
  { lines: [
    '═══ 生成的 README.md 预览 ═══',
    '',
    '# 👋 你好 Tao Zhou',
    '',
    '  [动态打字 SVG: 全栈开发者 | 开源 | AI 🚀]',
    '',
    '  🐙 GitHub  |  🐦 Twitter  |  📝 Blog',
    '──────────────────────────────────',
    '## 🚀 关于我',
    '  热爱构建有意义的产品，',
    '  喜欢研究前沿技术 & 开源贡献。',
    '  🔭 正在进行：酷炫的开源项目',
    '  💬 问我关于：TypeScript, React, Node.js',
    '  ⚡ 小趣事：我把咖啡变成代码 ☕',
  ], hl: -1 },

  // Step 14: 统计卡片
  { lines: [
    '═══ 生成的 README.md 预览 ═══',
    '',
    '## 🛠️ 技术栈',
    '  [TypeScript] [React] [Node.js] [Python] [Docker]',
    '  [Go] [MongoDB] [AWS]',
    '',
    '## 📊 GitHub Stats',
    '  ┌──────────────┐  ┌──────────────┐',
    '  │  ⭐ Stars     │  │  语言占比     │',
    '  │  📊 Commits   │  │  TS ████░ 40% │',
    '  │  🔥 Streak    │  │  Go ██░░░ 20% │',
    '  │  📈 PR/Issues │  │  Py ██░░░ 15% │',
    '  └──────────────┘  └──────────────┘',
  ], hl: -1 },

  // Step 15: 完成 — 展示多主题
  { lines: [
    '═══ ReadmeForge — 5 种主题，中英双语 ═══',
    '',
    '  🔵 Professional    ✅     专业、全面、适合求职',
    '  ⚪ Minimal          ✅     极简风格，Less is More',
    '  🟣 Creative         ✅     多彩、动感、代码风',
    '  🟢 Terminal          ✅     ASCII Art、Geek 专属',
    '  🟡 Cyberpunk        ✅     霓虹、赛博朋克',
    '',
    '  🌍 中文 / English — 自动双语内容',
    '  🤖 GitHub Actions — 每日自动更新数据',
    '',
    '  ⭐ github.com/hitaozhou/readmeforge',
  ], hl: -1 },
];

// ============================================================
// 生成帧 + 合成 GIF
// ============================================================

console.log(`🎬 生成 ${scenes.length} 帧...`);

scenes.forEach((scene, i) => {
  process.stdout.write(`  帧 ${i + 1}/${scenes.length}... `);
  makeFrame(i, scene.lines, scene.hl);
  console.log('✓');
});

console.log('\n🔧 用 ffmpeg 合成 GIF...');

// 将每帧持续 1-3 秒不等。关键帧停留更久。
// 我们用 ffmpeg 的 fps 控制

// 先将每帧复制多份来模拟持续时间
const frameDurations = [
  0.5,  // 1: 命令
  1.5,  // 2: Banner
  2.0,  // 3: 语言选择
  1.0,  // 4: 用户名
  1.0,  // 5: 名字
  1.0,  // 6: Tagline
  2.5,  // 7: 选主题（选项多）
  1.5,  // 8: 技能
  1.5,  // 9: 确认
  1.5,  // 10: 生成中
  2.0,  // 11: 成功
  2.5,  // 12: 下一步
  2.5,  // 13: 预览1
  2.5,  // 14: 预览2
  3.0,  // 15: 最终展示
];

// ffmpeg concat 方式: 生成文件列表
let concatList = '';
let fileIndex = 0;
frameDurations.forEach((duration, i) => {
  const srcFrame = String(i).padStart(3, '0');
  const srcPath = path.join(FRAMES, `${srcFrame}.png`);

  // 把同一帧复制 N 次（每帧约 0.1s，duration/0.1 次）
  const copies = Math.max(1, Math.round(duration / 0.15));
  for (let c = 0; c < copies; c++) {
    const dstFrame = String(fileIndex).padStart(4, '0');
    const dstPath = path.join(FRAMES, `seq_${dstFrame}.png`);
    fs.copyFileSync(srcPath, dstPath);
    concatList += `file 'seq_${dstFrame}.png'\n`;
    concatList += `duration 0.15\n`;
    fileIndex++;
  }
});

const listPath = path.join(FRAMES, 'frames.txt');
fs.writeFileSync(listPath, concatList);
// 最后一张需要重复以配合 ffmpeg concat
concatList += `file 'seq_${String(fileIndex - 1).padStart(4, '0')}.png'\n`;
fs.writeFileSync(listPath, concatList);

// 合成 GIF
exec(`ffmpeg -y -f concat -safe 0 -i "${listPath}" -vf "fps=10,scale=${W}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5" -loop 0 "${OUTPUT}"`);

// 获取文件大小
const sizeMB = (fs.statSync(OUTPUT).size / (1024 * 1024)).toFixed(2);
console.log(`\n✅ 演示 GIF 生成完毕！`);
console.log(`   📁 ${OUTPUT}`);
console.log(`   📦 ${sizeMB} MB`);
console.log(`   🎞️  ${fileIndex} 帧`);
