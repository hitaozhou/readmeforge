# Contributing to ReadmeForge / 贡献指南

Thank you for your interest in contributing! 🎉

## How to Contribute / 如何贡献

### 🐛 Bug Reports / 报告 Bug
- Check [existing issues](https://github.com/hitaozhou/readmeforge/issues) first
- Include: OS, Node.js version, error message, steps to reproduce

### 💡 Feature Requests / 功能建议
- Describe what you want and why
- Include mockups or examples if possible

### 🔧 Pull Requests / 提交代码
1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test: `npm run build && npm run dev`
5. Commit: `git commit -m "feat: your feature"`
6. Push: `git push origin feature/your-feature`
7. Open a PR

### 🎨 New Themes / 添加新主题
1. Add your theme function in `src/generator.ts`
2. Register it in the `themeGenerators` map
3. Add it to the CLI choices in `src/index.ts`
4. Test it works with both languages

## Development / 本地开发

```bash
git clone git@github.com:hitaozhou/readmeforge.git
cd readmeforge
npm install
npm run dev
```

## License / 协议
MIT — do whatever you want, attribution appreciated.
