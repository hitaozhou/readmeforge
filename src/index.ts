#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import ora from 'ora';
import prompts from 'prompts';
import { generateReadme } from './generator';
import { startWorkflow } from './workflow';
import path from 'path';
import fs from 'fs';

const program = new Command();

// ============================================================
// 双语字典
// ============================================================
type Lang = 'zh' | 'en';

const dict = {
  banner_subtitle: {
    zh: '  ✨ 一键生成惊艳的 GitHub Profile README\n   🌍 同时面向中国 & 海外开发者\n',
    en: '  ✨ Generate stunning GitHub Profile READMEs\n   🌍 For Chinese & Global developers\n',
  },
  language_question: { zh: '🌍 选择语言 / Choose Language', en: '🌍 选择语言 / Choose Language' },
  cancel: { zh: '❌ 已取消操作。', en: '❌ Cancelled.' },
  username: { zh: '👤 你的 GitHub 用户名是？', en: '👤 What is your GitHub username?' },
  username_error: { zh: '用户名不能为空', en: 'Username cannot be empty' },
  name: { zh: '📛 你希望展示的名字？', en: '📛 What name do you want to display?' },
  tagline: { zh: '💬 一句话介绍自己（Tagline）？', en: '💬 One-line tagline to describe yourself?' },
  tagline_default: {
    zh: '全栈开发者 | 开源爱好者 🚀',
    en: 'Full-Stack Developer | Open Source Enthusiast 🚀',
  },
  theme: { zh: '🎨 选择一个主题风格：', en: '🎨 Choose a theme:' },
  theme_professional: {
    zh: chalk.blue('Professional') + '  — 专业、全面、适合求职',
    en: chalk.blue('Professional') + '  — Clean, comprehensive, job-ready',
  },
  theme_minimal: {
    zh: chalk.gray('Minimal') + '     — 极简风格，Less is More',
    en: chalk.gray('Minimal') + '     — Minimalist, Less is More',
  },
  theme_creative: {
    zh: chalk.magenta('Creative') + '    — 多彩、动感、令人印象深刻',
    en: chalk.magenta('Creative') + '    — Colorful, dynamic, memorable',
  },
  theme_terminal: {
    zh: chalk.green('Terminal') + '    — 终端风格，Geek 专属',
    en: chalk.green('Terminal') + '    — Terminal style, for geeks',
  },
  theme_cyberpunk: {
    zh: chalk.yellow('Cyberpunk') + '   — 霓虹色赛博朋克风',
    en: chalk.yellow('Cyberpunk') + '   — Neon cyberpunk aesthetics',
  },
  skills: {
    zh: '🛠️ 你的技术栈（逗号分隔）：',
    en: '🛠️ Your tech stack (comma separated):',
  },
  socials: {
    zh: '🔗 社交媒体链接（格式: 平台:链接, 逗号分隔）：',
    en: '🔗 Social links (format: Platform:URL, comma separated):',
  },
  socials_default: {
    zh: 'GitHub:https://github.com/username, Twitter:https://twitter.com/username, Blog:https://yourblog.com',
    en: 'GitHub:https://github.com/username, Twitter:https://twitter.com/username, Blog:https://yourblog.com',
  },
  showStats: {
    zh: '📊 是否显示 GitHub 统计卡片？',
    en: '📊 Show GitHub stats cards?',
  },
  showTrophy: {
    zh: '🏆 是否显示 GitHub 奖杯？',
    en: '🏆 Show GitHub trophy?',
  },
  showVisitorBadge: {
    zh: '👀 是否显示访客计数徽章？',
    en: '👀 Show visitor counter badge?',
  },
  outputDir: {
    zh: '📁 输出目录路径：',
    en: '📁 Output directory:',
  },
  generating: {
    zh: '🔨 正在生成你的专属 README...',
    en: '🔨 Generating your custom README...',
  },
  success: { zh: '✅ README 生成成功！', en: '✅ README generated successfully!' },
  generated_files: { zh: '📋 生成的文件：', en: '📋 Generated files:' },
  next_steps: { zh: '🚀 下一步：', en: '🚀 Next steps:' },
  step1: {
    zh: `   1. 查看生成的 ${chalk.cyan('README.md')} 预览效果`,
    en: `   1. Check the generated ${chalk.cyan('README.md')} preview`,
  },
  step2: {
    zh: `   2. 将 ${chalk.cyan('README.md')} 放到你的 GitHub Profile 仓库根目录`,
    en: `   2. Place ${chalk.cyan('README.md')} in your GitHub Profile repo root`,
  },
  step3: {
    zh: `   3. 将 ${chalk.cyan('.github/workflows/')} 也推送到仓库，启用自动更新`,
    en: `   3. Push ${chalk.cyan('.github/workflows/')} too, to enable auto-updates`,
  },
  step4: {
    zh: `   4. 创建一个同名仓库（如 ${chalk.cyan('your-username/your-username')}）`,
    en: `   4. Create a repo with the same name as your username`,
  },
  preview: {
    zh: '👀 README 预览（前 15 行）：',
    en: '👀 README preview (first 15 lines):',
  },
  more_content: {
    zh: '... (更多内容请查看生成的文件)',
    en: '... (more content in the generated file)',
  },
  star_msg: {
    zh: '⭐ 如果觉得好用，给 ReadmeForge 点个 Star！',
    en: '⭐ If you like it, star ReadmeForge on GitHub!',
  },
  fail: { zh: '生成失败！', en: 'Generation failed!' },
  themes_title: { zh: '🎨 可用主题预览：', en: '🎨 Available themes:' },
  themes: [
    {
      name: 'Professional',
      desc: {
        zh: '专业全面 — 包含统计、技能进度条、项目展示。适合求职和技术博主。',
        en: 'Clean & comprehensive — stats, skill progress bars, project showcase. Perfect for job seekers & tech bloggers.',
      },
      color: chalk.blue,
    },
    {
      name: 'Minimal',
      desc: {
        zh: '极简设计 — 去除冗余信息，只留精髓。Less is More。',
        en: 'Minimal design — cut the noise, keep the essence. Less is More.',
      },
      color: chalk.gray,
    },
    {
      name: 'Creative',
      desc: {
        zh: '多彩动感 — 动画、渐变、Emoji。让人过目不忘。',
        en: 'Colorful & dynamic — animations, gradients, emojis. Unforgettable.',
      },
      color: chalk.magenta,
    },
    {
      name: 'Terminal',
      desc: {
        zh: '终端风格 — ASCII Art、打字动画、暗色系。Geek 首选。',
        en: 'Terminal style — ASCII Art, typing animation, dark mode. Geek favorite.',
      },
      color: chalk.green,
    },
    {
      name: 'Cyberpunk',
      desc: {
        zh: '霓虹赛博 — 霓虹色彩、发光效果。绝对吸睛。',
        en: 'Cyberpunk — neon colors, glowing effects. Eye-catching.',
      },
      color: chalk.yellow,
    },
  ],
  themes_footer: {
    zh: '运行 readmeforge 开始创建你的专属 README！',
    en: 'Run readmeforge to create your custom README!',
  },
  cli_desc: {
    zh: '🎨 一键生成惊艳的 GitHub Profile README（中英双语）',
    en: '🎨 One-click stunning GitHub Profile README (CN/EN bilingual)',
  },
  themes_cmd_desc: {
    zh: '查看所有可用主题',
    en: 'View all available themes',
  },
};

function t(lang: Lang, entry: { zh: string; en: string }): string {
  return entry[lang];
}

let currentLang: Lang = 'zh';

// 显示 Banner
function showBanner(): void {
  console.log('\n');
  console.log(
    chalk.cyan(
      figlet.textSync('ReadmeForge', {
        font: 'Standard',
        horizontalLayout: 'full',
      })
    )
  );
  console.log(chalk.dim(t(currentLang, dict.banner_subtitle)));
}

// ============================================================
// 交互式问答
// ============================================================

interface UserAnswers {
  username: string;
  name: string;
  tagline: string;
  theme: 'professional' | 'minimal' | 'creative' | 'terminal' | 'cyberpunk';
  skills: string;
  socials: string;
  showStats: boolean;
  showTrophy: boolean;
  showVisitorBadge: boolean;
  outputDir: string;
  language: Lang;
}

async function askLanguage(): Promise<Lang> {
  const { lang } = await prompts({
    type: 'select',
    name: 'lang',
    message: t('zh', dict.language_question),
    choices: [
      { title: '🇨🇳 中文', value: 'zh' },
      { title: '🇺🇸 English', value: 'en' },
    ],
    initial: 0,
  });
  return lang || 'zh';
}

async function askQuestions(): Promise<UserAnswers> {
  console.clear();
  showBanner();

  const language = await askLanguage();
  currentLang = language;

  const questions: prompts.PromptObject[] = [
    {
      type: 'text',
      name: 'username',
      message: t(language, dict.username),
      validate: (value: string) =>
        value.trim().length > 0 ? true : t(language, dict.username_error),
    },
    {
      type: 'text',
      name: 'name',
      message: t(language, dict.name),
      initial: (prev: string) => prev,
    },
    {
      type: 'text',
      name: 'tagline',
      message: t(language, dict.tagline),
      initial: t(language, dict.tagline_default),
    },
    {
      type: 'select',
      name: 'theme',
      message: t(language, dict.theme),
      choices: [
        { title: t(language, dict.theme_professional), value: 'professional' },
        { title: t(language, dict.theme_minimal), value: 'minimal' },
        { title: t(language, dict.theme_creative), value: 'creative' },
        { title: t(language, dict.theme_terminal), value: 'terminal' },
        { title: t(language, dict.theme_cyberpunk), value: 'cyberpunk' },
      ],
      initial: 0,
    },
    {
      type: 'list',
      name: 'skills',
      message: t(language, dict.skills),
      initial: 'JavaScript, TypeScript, React, Node.js, Python, Docker',
    },
    {
      type: 'list',
      name: 'socials',
      message: t(language, dict.socials),
      initial: t(language, dict.socials_default),
    },
    {
      type: 'confirm',
      name: 'showStats',
      message: t(language, dict.showStats),
      initial: true,
    },
    {
      type: 'confirm',
      name: 'showTrophy',
      message: t(language, dict.showTrophy),
      initial: true,
    },
    {
      type: 'confirm',
      name: 'showVisitorBadge',
      message: t(language, dict.showVisitorBadge),
      initial: true,
    },
    {
      type: 'text',
      name: 'outputDir',
      message: t(language, dict.outputDir),
      initial: './output',
    },
  ];

  const answers = await prompts(questions, {
    onCancel: () => {
      console.log(chalk.red(`\n${t(language, dict.cancel)}`));
      process.exit(0);
    },
  });

  return { ...answers, language } as UserAnswers;
}

// ============================================================
// 主命令
// ============================================================

program
  .name('readmeforge')
  .description('🎨 Generate stunning GitHub Profile README — CN/EN bilingual')
  .version('1.0.0')
  .option('-l, --lang <lang>', 'Language: zh or en', 'zh')
  .action(async (options) => {
    const answers = await askQuestions();
    const lang = answers.language || options.lang as Lang;

    const outputDir = path.resolve(answers.outputDir);
    const spinner = ora({
      text: chalk.cyan(t(lang, dict.generating)),
      spinner: 'dots',
    });

    try {
      spinner.start();

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const readmeContent = generateReadme({
        username: answers.username,
        name: answers.name,
        tagline: answers.tagline,
        theme: answers.theme,
        skills: answers.skills
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean),
        socials: answers.socials
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean)
          .map((s: string) => {
            const idx = s.indexOf(':');
            if (idx === -1) return { platform: s, url: '#' };
            return {
              platform: s.substring(0, idx).trim(),
              url: s.substring(idx + 1).trim(),
            };
          }),
        showStats: answers.showStats,
        showTrophy: answers.showTrophy,
        showVisitorBadge: answers.showVisitorBadge,
        language: lang,
      });

      const readmePath = path.join(outputDir, 'README.md');
      fs.writeFileSync(readmePath, readmeContent, 'utf-8');

      const workflowContent = startWorkflow(answers.username);
      const workflowDir = path.join(outputDir, '.github', 'workflows');
      if (!fs.existsSync(workflowDir)) {
        fs.mkdirSync(workflowDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(workflowDir, 'readmeforge-update.yml'),
        workflowContent,
        'utf-8'
      );

      spinner.succeed(chalk.green(t(lang, dict.success)));

      console.log('\n' + chalk.bold(t(lang, dict.generated_files)));
      console.log(chalk.cyan(`   📄 ${readmePath}`));
      console.log(
        chalk.cyan(
          `   🔧 ${path.join(outputDir, '.github', 'workflows', 'readmeforge-update.yml')}`
        )
      );

      console.log('\n' + chalk.bold(t(lang, dict.next_steps)));
      console.log(chalk.white(t(lang, dict.step1)));
      console.log(chalk.white(t(lang, dict.step2)));
      console.log(chalk.white(t(lang, dict.step3)));
      console.log(chalk.white(t(lang, dict.step4)));

      console.log('\n' + chalk.bold(t(lang, dict.preview)));
      console.log(chalk.dim('─'.repeat(60)));
      const lines = readmeContent.split('\n').slice(0, 15);
      lines.forEach((line) => console.log(chalk.dim(line)));
      if (readmeContent.split('\n').length > 15) {
        console.log(chalk.dim(t(lang, dict.more_content)));
      }
      console.log(chalk.dim('─'.repeat(60)) + '\n');

      console.log(chalk.green(t(lang, dict.star_msg) + '\n'));
    } catch (error) {
      spinner.fail(chalk.red(t(lang, dict.fail)));
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// ============================================================
// themes 命令
// ============================================================

program
  .command('themes')
  .description('🎨 View all available themes / 查看所有可用主题')
  .option('-l, --lang <lang>', 'Language / 语言: zh or en', 'zh')
  .action((options) => {
    const lang: Lang = options.lang || 'zh';
    currentLang = lang;
    showBanner();
    console.log(chalk.bold(`\n${t(lang, dict.themes_title)}\n`));

    dict.themes.forEach((theme) => {
      console.log(`  ${theme.color('◆ ' + theme.name)}`);
      console.log(chalk.dim(`    ${theme.desc[lang]}\n`));
    });

    console.log(chalk.dim(t(lang, dict.themes_footer) + '\n'));
  });

program.parse(process.argv);
