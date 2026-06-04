/**
 * 生成 GitHub Actions 工作流配置
 * 自动更新 Profile README 中的统计数据
 */

export function startWorkflow(username: string): string {
  return `# ReadmeForge — 自动更新 Profile README
# 此文件由 ReadmeForge 自动生成
# 每天 UTC 0:00 自动运行，也可手动触发

name: 🔄 ReadmeForge Auto Update

on:
  schedule:
    # 每天 UTC 0:00 运行（北京时间早上 8:00）
    - cron: '0 0 * * *'
  workflow_dispatch:
    # 允许手动触发
  push:
    branches:
      - main
      - master

jobs:
  update-readme:
    name: Update Profile README
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install ReadmeForge
        run: npm install -g readmeforge

      - name: Generate README
        run: |
          readmeforge generate \\
            --username ${username} \\
            --theme professional \\
            --output ./ \\
            --no-interactive \\
            || echo "README generation skipped (interactive mode not available in CI)"

      - name: Commit & Push Changes
        run: |
          git config --global user.name 'readmeforge[bot]'
          git config --global user.email 'readmeforge[bot]@users.noreply.github.com'
          git add README.md
          git diff --staged --quiet || git commit -m "🔄 Auto-update README [skip ci]"
          git push
`;
}
