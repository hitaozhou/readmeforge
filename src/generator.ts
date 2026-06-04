export interface GenerateOptions {
  username: string;
  name: string;
  tagline: string;
  theme: 'professional' | 'minimal' | 'creative' | 'terminal' | 'cyberpunk';
  skills: string[];
  socials: { platform: string; url: string }[];
  showStats: boolean;
  showTrophy: boolean;
  showVisitorBadge: boolean;
  language: 'zh' | 'en';
}

// 中英双语辅助函数
function t(lang: 'zh' | 'en', zh: string, en: string): string {
  return lang === 'zh' ? zh : en;
}

function bilingual(lang: 'zh' | 'en', zh: string, en: string): string {
  if (lang === 'zh') {
    return `${zh}\n> ${en}`;
  }
  return `${en}\n> ${zh}`;
}

// ============================================================
// 技术栈 → shields.io 徽章映射
// ============================================================
const SKILL_BADGES: Record<string, string> = {
  JavaScript: 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black',
  TypeScript: 'https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white',
  Python: 'https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white',
  React: 'https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB',
  'Node.js': 'https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white',
  Docker: 'https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white',
  Kubernetes: 'https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white',
  Go: 'https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white',
  Rust: 'https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white',
  'C++': 'https://img.shields.io/badge/C++-00599C?style=for-the-badge&logo=cplusplus&logoColor=white',
  Java: 'https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white',
  'Vue.js': 'https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D',
  Angular: 'https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white',
  GraphQL: 'https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white',
  MongoDB: 'https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white',
  PostgreSQL: 'https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white',
  Redis: 'https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white',
  AWS: 'https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white',
  Linux: 'https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black',
  Git: 'https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white',
  'VS Code': 'https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white',
  Figma: 'https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white',
  Nextjs: 'https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white',
  Tailwind: 'https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white',
  Svelte: 'https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white',
  Flutter: 'https://img.shields.io/badge/Flutter-02569B?style=for-the-badge&logo=flutter&logoColor=white',
  Swift: 'https://img.shields.io/badge/Swift-F05138?style=for-the-badge&logo=swift&logoColor=white',
  PHP: 'https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white',
  Ruby: 'https://img.shields.io/badge/Ruby-CC342D?style=for-the-badge&logo=ruby&logoColor=white',
  'C#': 'https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white',
  Kotlin: 'https://img.shields.io/badge/Kotlin-7F52FF?style=for-the-badge&logo=kotlin&logoColor=white',
};

function getSkillBadge(skill: string): string {
  const match = Object.entries(SKILL_BADGES).find(
    ([key]) => key.toLowerCase() === skill.toLowerCase()
  );
  if (match) return match[1];
  const encoded = encodeURIComponent(skill);
  return `https://img.shields.io/badge/${encoded}-333333?style=for-the-badge&logoColor=white`;
}

function generateSkillBadges(skills: string[]): string {
  return skills.map((s) => `![${s}](${getSkillBadge(s)})`).join('\n');
}

function generateSocialLinks(
  socials: { platform: string; url: string }[]
): string {
  const icons: Record<string, string> = {
    Twitter: '🐦',
    X: '🐦',
    LinkedIn: '💼',
    Blog: '📝',
    Website: '🌐',
    YouTube: '📺',
    Twitch: '🎮',
    Discord: '💬',
    Instagram: '📷',
    Dev: '👨‍💻',
    Medium: '📚',
    Email: '📧',
    微博: '📢',
    知乎: '💡',
    掘金: '⛏️',
    GitHub: '🐙',
    GitLab: '🦊',
    Bilibili: '📺',
  };

  return socials
    .map((s) => {
      const icon = icons[s.platform] || '🔗';
      return `[${icon} ${s.platform}](${s.url})`;
    })
    .join(' &nbsp;|&nbsp; ');
}

// ============================================================
// 通用组件
// ============================================================

function generateStatsBlock(username: string): string {
  return `
<!-- GitHub Stats / 统计 -->
<div align="center">
  <img height="180em" src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight&include_all_commits=true&count_private=true"/>
  <img height="180em" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&langs_count=8&theme=tokyonight"/>
</div>`;
}

function generateStreakBlock(username: string): string {
  return `
<!-- GitHub Streak / 连续提交 -->
<div align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=tokyonight" alt="GitHub Streak"/>
</div>`;
}

function generateTrophyBlock(username: string): string {
  return `
<!-- GitHub Trophy / 奖杯 -->
<div align="center">
  <img src="https://github-profile-trophy.vercel.app/?username=${username}&theme=nord&column=7&margin-w=15&margin-h=15" alt="GitHub Trophy"/>
</div>`;
}

function generateQuoteBlock(): string {
  return `
<!-- Random Dev Quote / 随机名言 -->
<div align="center">
  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight" alt="Random Dev Quote"/>
</div>`;
}

function generateActivityGraph(username: string): string {
  return `
<!-- Contribution Graph / 贡献图 -->
<div align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=react-dark&hide_border=true&area=true" alt="Contribution Graph"/>
</div>`;
}

function generateVisitorBadge(username: string, color: string, style: string, label: string): string {
  return `
<p align="center">
  <img src="https://komarev.com/ghpvc/?username=${username}&color=${color}&style=${style}&label=${encodeURIComponent(label)}" alt="Visitor Badge"/>
</p>`;
}

function generateFooter(opts: GenerateOptions): string {
  return `<p align="center">
  <i>⭐️ ${t(opts.language, '来自', 'From')} <a href="https://github.com/${opts.username}">${opts.name}</a> — ${t(opts.language, '由', 'Generated with')} <a href="https://github.com/hitaozhou/readmeforge">ReadmeForge</a> ${t(opts.language, '生成', '')}</i>
</p>`;
}

// ============================================================
// 主题模板
// ============================================================

function themeProfessional(opts: GenerateOptions): string {
  const hi = t(opts.language, '你好', "Hi, I'm");
  return `# 👋 ${hi} ${opts.name}

<!-- Typing SVG -->
<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=24&duration=3000&pause=1000&color=2196F3&center=true&vCenter=true&width=600&lines=${encodeURIComponent(opts.tagline)}" alt="Typing SVG" />
</p>

<p align="center">
  ${generateSocialLinks(opts.socials)}
</p>

---

## 🚀 ${t(opts.language, '关于我', 'About Me')}

${t(
  opts.language,
  '我是一名充满热情的开发者，热爱构建有意义的产品。我喜欢研究前沿技术，并为开源社区做贡献。',
  "I'm a passionate developer who loves building things that make a difference. I enjoy working with cutting-edge technologies and contributing to open source projects."
)}

- 🔭 ${t(opts.language, '我正在进行：', "I'm currently working on:")} **${t(opts.language, '酷炫的开源项目', 'awesome open source projects')}**
- 🌱 ${t(opts.language, '我正在学习：', "I'm currently learning:")} **${t(opts.language, '前沿技术', 'new technologies')}**
- 👯 ${t(opts.language, '我期待合作：', "I'm looking to collaborate on:")} **${t(opts.language, '有创意的想法', 'innovative ideas')}**
- 💬 ${t(opts.language, '问我关于：', 'Ask me about:')} **${opts.skills.slice(0, 3).join(', ')}**
- 📫 ${t(opts.language, '联系我：', 'How to reach me:')} **${t(opts.language, '通过上方社交链接', 'via social links above')}**
- ⚡ ${t(opts.language, '小趣事：', 'Fun fact:')} **${t(opts.language, '我把咖啡变成代码 ☕', 'I turn coffee into code ☕')}**

${opts.showStats ? generateStatsBlock(opts.username) : ''}

## 🛠️ ${t(opts.language, '技术栈', 'Tech Stack')}

<p align="center">
  ${generateSkillBadges(opts.skills)}
</p>

${opts.showTrophy ? generateTrophyBlock(opts.username) : ''}

${generateActivityGraph(opts.username)}

${opts.showVisitorBadge ? generateVisitorBadge(opts.username, '0e75b6', 'flat', t(opts.language, '个人主页访问量', 'Profile Views')) : ''}

---

${generateFooter(opts)}`;
}

function themeMinimal(opts: GenerateOptions): string {
  return `# ${opts.name}

> ${opts.tagline}

${generateSocialLinks(opts.socials)}

---

${t(
  opts.language,
  '### 👤 关于我\n\n热爱编程，追求极简。\n',
  '### 👤 About Me\n\nCode lover. Minimalist.\n'
)}

${generateSkillBadges(opts.skills)}

${opts.showStats ? generateStatsBlock(opts.username) : ''}

${generateActivityGraph(opts.username)}

${opts.showVisitorBadge ? `![${t(opts.language, '访问量', 'Profile Views')}](https://komarev.com/ghpvc/?username=${opts.username}&style=flat-square)` : ''}

---

<i>${t(opts.language, '由 ReadmeForge 生成', 'Generated with ReadmeForge')}</i>`;
}

function themeCreative(opts: GenerateOptions): string {
  return `<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=${encodeURIComponent(opts.name)}&fontSize=60&fontAlignY=35&animation=fadeIn" alt="Header"/>
</div>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=FF6E96&center=true&vCenter=true&width=500&lines=${encodeURIComponent(opts.tagline)}" alt="Typing SVG" />
</p>

<p align="center">
  ${generateSocialLinks(opts.socials)}
</p>

---

### ✨ ${t(opts.language, '关于我', 'About Me')} ✨

\`\`\`python
class Developer:
    def __init__(self):
        self.name = "${opts.name}"
        self.role = "${t(opts.language, '开发者 & 创造者', 'Developer & Creator')}"
        self.skills = ${JSON.stringify(opts.skills)}
        self.motto = "${opts.tagline}"
        self.languages = ["${t(opts.language, '中文', 'Chinese')}", "English"]

    def say_hi(self):
        print("${t(opts.language, '感谢来访！一起创造精彩！', "Thanks for visiting! Let's build something amazing together!")}")

me = Developer()
me.say_hi()
\`\`\`

${opts.showStats ? generateStatsBlock(opts.username) : ''}

${generateStreakBlock(opts.username)}

### 🎨 ${t(opts.language, '技能调色板', 'Skill Palette')}

<p align="center">
  ${generateSkillBadges(opts.skills)}
</p>

${opts.showTrophy ? generateTrophyBlock(opts.username) : ''}

${generateQuoteBlock()}

${generateActivityGraph(opts.username)}

${opts.showVisitorBadge ? generateVisitorBadge(opts.username, 'ff69b4', 'for-the-badge', t(opts.language, '✨ 来访者', '✨ Visitors')) : ''}

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" alt="Footer"/>
</div>

${generateFooter(opts)}`;
}

function themeTerminal(opts: GenerateOptions): string {
  const whoamiLabel = t(opts.language, '你是谁？', 'whoami');
  const skillsLabel = t(opts.language, '技能', 'skills');
  const uptimeVal = t(opts.language, '从: 出生那年', 'Coding since: forever');
  const motdLabel = t(opts.language, '今日格言', 'motd');
  const titleLabel = t(opts.language, '技术兵器库', 'Tech Arsenal');

  return `# 👨‍💻 ~/${opts.username}

\`\`\`console
┌───────────────────────────────────────────────────────────┐
│  $ ${whoamiLabel}                                                 │
│  > ${opts.name}                                           │
│                                                           │
│  $ cat /etc/${motdLabel}                                        │
│  > ${opts.tagline}                                        │
│                                                           │
│  $ ls -la ~/${skillsLabel}/                                     │
│  > ${opts.skills.slice(0, 4).join('  ')}${opts.skills.length > 4 ? '  ...' : ''}                │
│                                                           │
│  $ uptime                                                 │
│  > ${uptimeVal}                                    │
└───────────────────────────────────────────────────────────┘
\`\`\`

<p align="center">
  ${generateSocialLinks(opts.socials)}
</p>

---

### ⚡ ${titleLabel}

<p align="center">
  ${generateSkillBadges(opts.skills)}
</p>

${opts.showStats ? generateStatsBlock(opts.username) : ''}

${generateActivityGraph(opts.username)}

${opts.showVisitorBadge ? `\n![${t(opts.language, '连接数', 'CONNECTIONS')}](https://komarev.com/ghpvc/?username=${opts.username}&color=00ff00&style=flat-square&label=${t(opts.language, '连接', 'CONNECTIONS').toUpperCase()})` : ''}

---

\`\`\`
> ${t(opts.language, '❤️ 由 ReadmeForge 生成', 'Generated with ❤️ using ReadmeForge')}
> https://github.com/hitaozhou/readmeforge
\`\`\``;
}

function themeCyberpunk(opts: GenerateOptions): string {
  const systemOnline = t(opts.language, '系统在线', 'SYSTEM ONLINE');
  const neuralActivated = t(opts.language, '神经接口已激活', 'NEURAL INTERFACE ACTIVATED');
  const readyToCode = t(opts.language, '准备编程', 'READY TO CODE');
  const neuralInterface = t(opts.language, '神经接口', 'Neural Interface');
  const skillMatrix = t(opts.language, '技能矩阵', 'Skill Matrix');
  const mission = t(opts.language, '构建未来，每次提交都改变世界', 'Build the future, one commit at a time');
  const fullyCharged = t(opts.language, '⚡ 充满能量', '⚡ Fully Charged');

  return `<div align="center">

  ![Neon City](https://capsule-render.vercel.app/api?type=venom&color=0:00ffff,100:ff00ff&height=200&text=${encodeURIComponent(opts.name)}&fontSize=60&fontColor=ffffff&stroke=00ffff&strokeWidth=2)

</div>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=800&size=20&duration=2000&pause=500&color=00FFFF&center=true&vCenter=true&width=500&lines=${encodeURIComponent(opts.tagline)}" alt="Typing" />
</p>

<p align="center">
  ${generateSocialLinks(opts.socials)}
</p>

---

> \`\`\`diff
> + ${systemOnline}
> + ${neuralActivated}
> + ${readyToCode}
> \`\`\`

### 🔮 ${neuralInterface}

\`\`\`javascript
const dev = {
  identity: "${opts.name}",
  status: "${fullyCharged}",
  core: [${opts.skills.map(s => `"${s}"`).join(', ')}],
  mission: "${mission}",
  powerLevel: Infinity,
  languages: ["中文", "English"]
};
\`\`\`

${opts.showStats ? generateStatsBlock(opts.username) : ''}

${generateStreakBlock(opts.username)}

### 💾 ${skillMatrix}

<p align="center">
  ${generateSkillBadges(opts.skills)}
</p>

${opts.showTrophy ? generateTrophyBlock(opts.username) : ''}

${generateActivityGraph(opts.username)}

${opts.showVisitorBadge ? generateVisitorBadge(opts.username, 'ff00ff', 'for-the-badge', t(opts.language, '神经连接', 'NEURAL CONNECTIONS')) : ''}

---

<div align="center">

  \`\`\`
  ╔══════════════════════════════════════╗
  ║   ◈ CYBERPUNK THEME / 赛博朋克 ◈     ║
  ║   Generated by ReadmeForge          ║
  ╚══════════════════════════════════════╝
  \`\`\`

</div>

${generateFooter(opts)}`;
}

// ============================================================
// 生成器入口
// ============================================================

export function generateReadme(opts: GenerateOptions): string {
  const themeGenerators: Record<string, (opts: GenerateOptions) => string> = {
    professional: themeProfessional,
    minimal: themeMinimal,
    creative: themeCreative,
    terminal: themeTerminal,
    cyberpunk: themeCyberpunk,
  };

  const generator = themeGenerators[opts.theme] || themeGenerators.professional;
  return generator(opts);
}
