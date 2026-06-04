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
}

// 技术栈 → shields.io 徽章映射
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
};

function getSkillBadge(skill: string): string {
  const match = Object.entries(SKILL_BADGES).find(
    ([key]) => key.toLowerCase() === skill.toLowerCase()
  );
  if (match) return match[1];

  // 生成通用徽章
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
  };

  return socials
    .map((s) => {
      const icon = icons[s.platform] || '🔗';
      return `[${icon} ${s.platform}](${s.url})`;
    })
    .join(' &nbsp;|&nbsp; ');
}

function generateStatsBlock(username: string): string {
  return `
<!-- GitHub Stats -->
<div align="center">
  <img height="180em" src="https://github-readme-stats.vercel.app/api?username=${username}&show_icons=true&theme=tokyonight&include_all_commits=true&count_private=true"/>
  <img height="180em" src="https://github-readme-stats.vercel.app/api/top-langs/?username=${username}&layout=compact&langs_count=8&theme=tokyonight"/>
</div>`;
}

function generateStreakBlock(username: string): string {
  return `
<!-- GitHub Streak -->
<div align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=tokyonight" alt="GitHub Streak"/>
</div>`;
}

function generateTrophyBlock(username: string): string {
  return `
<!-- GitHub Trophy -->
<div align="center">
  <img src="https://github-profile-trophy.vercel.app/?username=${username}&theme=nord&column=7&margin-w=15&margin-h=15" alt="GitHub Trophy"/>
</div>`;
}

function generateQuoteBlock(): string {
  return `
<!-- Random Dev Quote -->
<div align="center">
  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=tokyonight" alt="Random Dev Quote"/>
</div>`;
}

function generateActivityGraph(username: string): string {
  return `
<!-- Contribution Graph -->
<div align="center">
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=react-dark&hide_border=true&area=true" alt="Contribution Graph"/>
</div>`;
}

// ============================================================
// 主题模板
// ============================================================

function themeProfessional(opts: GenerateOptions): string {
  return `# 👋 Hi, I'm ${opts.name}

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=24&duration=3000&pause=1000&color=2196F3&center=true&vCenter=true&width=600&lines=${encodeURIComponent(opts.tagline)}" alt="Typing SVG" />
</p>

<p align="center">
  ${generateSocialLinks(opts.socials)}
</p>

---

## 🚀 About Me

I'm a passionate developer who loves building things that make a difference. I enjoy working with cutting-edge technologies and contributing to open source projects.

- 🔭 I'm currently working on **awesome open source projects**
- 🌱 I'm currently learning **new technologies**
- 👯 I'm looking to collaborate on **innovative ideas**
- 💬 Ask me about **${opts.skills.slice(0, 3).join(', ')}**
- 📫 How to reach me: **via social links above**
- ⚡ Fun fact: **I turn coffee into code ☕**

${opts.showStats ? generateStatsBlock(opts.username) : ''}

## 🛠️ Tech Stack

<p align="center">
  ${generateSkillBadges(opts.skills)}
</p>

${opts.showTrophy ? generateTrophyBlock(opts.username) : ''}

${generateActivityGraph(opts.username)}

${opts.showVisitorBadge ? `
<p align="center">
  <img src="https://komarev.com/ghpvc/?username=${opts.username}&label=Profile%20Views&color=0e75b6&style=flat" alt="Profile Views" />
</p>` : ''}

---

<p align="center">
  <i>⭐️ From <a href="https://github.com/${opts.username}">${opts.name}</a> — Generated with <a href="https://github.com/your-username/readmeforge">ReadmeForge</a></i>
</p>`;
}

function themeMinimal(opts: GenerateOptions): string {
  return `# ${opts.name}

> ${opts.tagline}

${generateSocialLinks(opts.socials)}

---

${generateSkillBadges(opts.skills)}

${opts.showStats ? generateStatsBlock(opts.username) : ''}

${generateActivityGraph(opts.username)}

${opts.showVisitorBadge ? `![Profile Views](https://komarev.com/ghpvc/?username=${opts.username}&style=flat-square)` : ''}`;
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

### ✨ About Me ✨

\`\`\`python
class Developer:
    def __init__(self):
        self.name = "${opts.name}"
        self.role = "Developer & Creator"
        self.skills = ${JSON.stringify(opts.skills)}
        self.motto = "${opts.tagline}"

    def say_hi(self):
        print("Thanks for visiting! Let's build something amazing together!")

me = Developer()
me.say_hi()
\`\`\`

${opts.showStats ? generateStatsBlock(opts.username) : ''}

${generateStreakBlock(opts.username)}

### 🎨 Skill Palette

<p align="center">
  ${generateSkillBadges(opts.skills)}
</p>

${opts.showTrophy ? generateTrophyBlock(opts.username) : ''}

${generateQuoteBlock()}

${generateActivityGraph(opts.username)}

${opts.showVisitorBadge ? `
<p align="center">
  <img src="https://komarev.com/ghpvc/?username=${opts.username}&color=ff69b4&style=for-the-badge&label=✨+Visitors" alt="Visitor Badge"/>
</p>` : ''}

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" alt="Footer"/>
</div>`;
}

function themeTerminal(opts: GenerateOptions): string {
  return `# 👨‍💻 ~/${opts.username}

\`\`\`console
┌─────────────────────────────────────────────────────┐
│  $ whoami                                           │
│  > ${opts.name}                                     │
│                                                     │
│  $ cat /etc/motd                                    │
│  > ${opts.tagline}                                  │
│                                                     │
│  $ ls -la ~/skills/                                 │
│  > ${opts.skills.slice(0, 4).join('  ')}${opts.skills.length > 4 ? '  ...' : ''}          │
│                                                     │
│  $ uptime                                            │
│  > Coding since: forever                             │
└─────────────────────────────────────────────────────┘
\`\`\`

<p align="center">
  ${generateSocialLinks(opts.socials)}
</p>

---

### ⚡ Tech Arsenal

<p align="center">
  ${generateSkillBadges(opts.skills)}
</p>

${opts.showStats ? generateStatsBlock(opts.username) : ''}

${generateActivityGraph(opts.username)}

${opts.showVisitorBadge ? `\n![Profile Views](https://komarev.com/ghpvc/?username=${opts.username}&color=00ff00&style=flat-square&label=CONNECTIONS)` : ''}

---

\`\`\`
> Generated with ❤️ using ReadmeForge
> https://github.com/your-username/readmeforge
\`\`\``;
}

function themeCyberpunk(opts: GenerateOptions): string {
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
> + SYSTEM ONLINE
> + NEURAL INTERFACE ACTIVATED
> + READY TO CODE
> \`\`\`

### 🔮 Neural Interface

\`\`\`javascript
const dev = {
  identity: "${opts.name}",
  status: "⚡ Fully Charged",
  core: [${opts.skills.map(s => `"${s}"`).join(', ')}],
  mission: "Build the future, one commit at a time",
  powerLevel: Infinity
};
\`\`\`

${opts.showStats ? generateStatsBlock(opts.username) : ''}

${generateStreakBlock(opts.username)}

### 💾 Skill Matrix

<p align="center">
  ${generateSkillBadges(opts.skills)}
</p>

${opts.showTrophy ? generateTrophyBlock(opts.username) : ''}

${generateActivityGraph(opts.username)}

${opts.showVisitorBadge ? `
<p align="center">
  <img src="https://komarev.com/ghpvc/?username=${opts.username}&color=ff00ff&style=for-the-badge&label=NEURAL+CONNECTIONS" alt="Visitors"/>
</p>` : ''}

---

<div align="center">

  \`\`\`
  ╔══════════════════════════════════╗
  ║   ◈ CYBERPUNK THEME ◈         ║
  ║   Generated by ReadmeForge     ║
  ╚══════════════════════════════════╝
  \`\`\`

</div>`;
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
