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
  console.log(
    chalk.dim('  ✨ 一键生成惊艳的 GitHub Profile README\n')
  );
}

// 主题选项
type Theme = 'professional' | 'minimal' | 'creative' | 'terminal' | 'cyberpunk';

interface UserAnswers {
  username: string;
  name: string;
  tagline: string;
  theme: Theme;
  skills: string;
  socials: string;
  showStats: boolean;
  showTrophy: boolean;
  showVisitorBadge: boolean;
  outputDir: string;
}

// 交互式问题收集
async function askQuestions(): Promise<UserAnswers> {
  // 清屏
  console.clear();
  showBanner();

  const questions: prompts.PromptObject[] = [
    {
      type: 'text',
      name: 'username',
      message: '👤 你的 GitHub 用户名是？',
      validate: (value: string) =>
        value.trim().length > 0 ? true : '用户名不能为空',
    },
    {
      type: 'text',
      name: 'name',
      message: '📛 你希望展示的名字？',
      initial: (prev: string) => prev,
    },
    {
      type: 'text',
      name: 'tagline',
      message: '💬 一句话介绍自己（Tagline）？',
      initial: 'Full-Stack Developer | Open Source Enthusiast 🚀',
    },
    {
      type: 'select',
      name: 'theme',
      message: '🎨 选择一个主题风格：',
      choices: [
        {
          title: chalk.blue('Professional') + '  — 专业、全面、适合求职',
          value: 'professional',
        },
        {
          title: chalk.gray('Minimal') + '     — 极简风格，Less is More',
          value: 'minimal',
        },
        {
          title: chalk.magenta('Creative') + '    — 多彩、动感、令人印象深刻',
          value: 'creative',
        },
        {
          title: chalk.green('Terminal') + '    — 终端风格，Geek 专属',
          value: 'terminal',
        },
        {
          title: chalk.yellow('Cyberpunk') + '   — 霓虹色赛博朋克风',
          value: 'cyberpunk',
        },
      ],
      initial: 0,
    },
    {
      type: 'list',
      name: 'skills',
      message: '🛠️ 你的技术栈（逗号分隔）：',
      initial: 'JavaScript, TypeScript, React, Node.js, Python, Docker',
    },
    {
      type: 'list',
      name: 'socials',
      message: '🔗 社交媒体链接（格式: 平台:链接, 逗号分隔）：',
      initial: 'Twitter:https://twitter.com/username, LinkedIn:https://linkedin.com/in/username, Blog:https://yourblog.com',
    },
    {
      type: 'confirm',
      name: 'showStats',
      message: '📊 是否显示 GitHub 统计卡片？',
      initial: true,
    },
    {
      type: 'confirm',
      name: 'showTrophy',
      message: '🏆 是否显示 GitHub 奖杯？',
      initial: true,
    },
    {
      type: 'confirm',
      name: 'showVisitorBadge',
      message: '👀 是否显示访客计数徽章？',
      initial: true,
    },
    {
      type: 'text',
      name: 'outputDir',
      message: '📁 输出目录路径：',
      initial: './output',
    },
  ];

  const answers = await prompts(questions, {
    onCancel: () => {
      console.log(chalk.red('\n❌ 已取消操作。'));
      process.exit(0);
    },
  });

  return answers as UserAnswers;
}

// 主命令
program
  .name('readmeforge')
  .description('🎨 一键生成惊艳的 GitHub Profile README')
  .version('1.0.0')
  .action(async () => {
    const answers = await askQuestions();

    const outputDir = path.resolve(answers.outputDir);
    const spinner = ora({
      text: chalk.cyan('🔨 正在生成你的专属 README...'),
      spinner: 'dots',
    });

    try {
      spinner.start();

      // 确保输出目录存在
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // 生成 README 内容
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
            const [platform, url] = s.split(':').map((p) => p.trim());
            return { platform, url };
          }),
        showStats: answers.showStats,
        showTrophy: answers.showTrophy,
        showVisitorBadge: answers.showVisitorBadge,
      });

      // 写入文件
      const readmePath = path.join(outputDir, 'README.md');
      fs.writeFileSync(readmePath, readmeContent, 'utf-8');

      // 生成 GitHub Action 工作流
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

      spinner.succeed(chalk.green('✅ README 生成成功！'));

      // 显示结果
      console.log('\n' + chalk.bold('📋 生成的文件：'));
      console.log(chalk.cyan(`   📄 ${readmePath}`));
      console.log(
        chalk.cyan(
          `   🔧 ${path.join(outputDir, '.github', 'workflows', 'readmeforge-update.yml')}`
        )
      );

      console.log('\n' + chalk.bold('🚀 下一步：'));
      console.log(
        chalk.white(
          `   1. 查看生成的 ${chalk.cyan('README.md')} 预览效果`
        )
      );
      console.log(
        chalk.white(
          `   2. 将 ${chalk.cyan('README.md')} 放到你的 GitHub Profile 仓库根目录`
        )
      );
      console.log(
        chalk.white(
          `   3. 将 ${chalk.cyan('.github/workflows/')} 也推送到仓库，启用自动更新`
        )
      );
      console.log(
        chalk.white(
          `   4. 创建一个同名仓库（如 ${chalk.cyan('your-username/your-username')}）`
        )
      );

      // 预览片段
      console.log('\n' + chalk.bold('👀 README 预览（前 15 行）：'));
      console.log(chalk.dim('─'.repeat(60)));
      const lines = readmeContent.split('\n').slice(0, 15);
      lines.forEach((line) => console.log(chalk.dim(line)));
      if (readmeContent.split('\n').length > 15) {
        console.log(chalk.dim('... (更多内容请查看生成的文件)'));
      }
      console.log(chalk.dim('─'.repeat(60)) + '\n');

      console.log(chalk.green('⭐ 如果觉得好用，给 ReadmeForge 点个 Star！\n'));
    } catch (error) {
      spinner.fail(chalk.red('生成失败！'));
      console.error(chalk.red((error as Error).message));
      process.exit(1);
    }
  });

// 列出主题命令
program
  .command('themes')
  .description('查看所有可用主题')
  .action(() => {
    showBanner();
    console.log(chalk.bold('\n🎨 可用主题预览：\n'));

    const themes = [
      {
        name: 'Professional',
        desc: '专业全面 — 包含统计、技能进度条、项目展示。适合求职和技术博主。',
        color: chalk.blue,
      },
      {
        name: 'Minimal',
        desc: '极简设计 — 去除冗余信息，只留精髓。Less is More。',
        color: chalk.gray,
      },
      {
        name: 'Creative',
        desc: '多彩动感 — 动画、渐变、Emoji。让人过目不忘。',
        color: chalk.magenta,
      },
      {
        name: 'Terminal',
        desc: '终端风格 — ASCII Art、打字动画、暗色系。Geek 首选。',
        color: chalk.green,
      },
      {
        name: 'Cyberpunk',
        desc: '霓虹赛博 — 霓虹色彩、发光效果。绝对吸睛。',
        color: chalk.yellow,
      },
    ];

    themes.forEach((t) => {
      console.log(`  ${t.color('◆ ' + t.name)}`);
      console.log(chalk.dim(`    ${t.desc}\n`));
    });

    console.log(chalk.dim('运行 readmeforge 开始创建你的专属 README！\n'));
  });

program.parse(process.argv);
