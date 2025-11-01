# ❄️ 艾莎公主汉字学习应用

一个以艾莎公主为主题的汉字卡片学习应用，帮助孩子测试和记忆汉字。采用卡片式交互设计，支持网页随时随地访问。

## ✨ 功能特性

### 📚 学习模式
- **练习模式**：顺序浏览所有汉字卡片，点击翻转查看拼音、意思和组词
- **测试模式**：随机展示汉字进行测试，记录答对/答错情况
- **复习模式**：重点复习未掌握或标记为困难的汉字

### 📊 进度管理
- 记录已学习和已掌握的汉字
- 跟踪复习次数和最后复习时间
- 学习统计展示（总数、已学习、已掌握、复习次数）
- 所有进度自动保存到本地存储

### 🎨 艾莎主题设计
- 冰雪蓝、淡紫色主题配色
- 卡片翻转动画效果
- 响应式设计，支持移动端和桌面端
- 优雅的UI界面，适合儿童使用

### 📱 数据管理
- 预置常用汉字（20个示例汉字）
- 支持按分类筛选（如：一年级、二年级等）
- 本地存储，无需联网即可使用

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发运行

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
ChineseWord/
├── public/              # 静态资源
├── src/
│   ├── assets/         # 资源文件
│   ├── components/     # Vue组件
│   │   └── WordCard.vue      # 汉字卡片组件
│   ├── composables/    # Composition API 复用逻辑
│   │   ├── useWordData.ts   # 汉字数据管理
│   │   └── useStorage.ts    # 本地存储
│   ├── stores/         # Pinia状态管理
│   │   └── progressStore.ts # 进度数据store
│   ├── types/          # TypeScript类型定义
│   │   └── word.ts          # 汉字数据结构
│   ├── data/           # 汉字数据
│   │   └── words.json       # 汉字库JSON文件
│   ├── styles/         # 全局样式
│   │   └── main.css         # 主题样式
│   ├── views/          # 页面组件
│   │   ├── Home.vue         # 首页
│   │   ├── StudyMode.vue    # 练习模式
│   │   ├── TestMode.vue     # 测试模式
│   │   └── ReviewMode.vue    # 复习模式
│   ├── router/         # 路由配置
│   │   └── index.ts
│   ├── App.vue         # 根组件
│   └── main.ts         # 入口文件
├── package.json
├── vite.config.ts
└── README.md
```

## 🛠 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript超集
- **Vite** - 下一代前端构建工具
- **Pinia** - Vue官方状态管理库
- **Vue Router** - Vue官方路由管理器
- **Tailwind CSS** - 实用优先的CSS框架

## 📝 数据格式

汉字数据结构：

```typescript
interface Word {
  id: string           // 唯一标识
  character: string    // 汉字
  pinyin: string       // 拼音
  meaning: string      // 意思
  words?: string[]     // 组词示例
  category?: string    // 分类（如：一年级）
  difficulty?: number  // 难度等级 (1-5)
}
```

## 🎯 使用说明

1. **首页**：选择学习模式，查看学习统计，选择汉字分类
2. **练习模式**：顺序浏览汉字卡片，点击卡片翻转查看详情，标记学习进度
3. **测试模式**：随机测试汉字，查看答案后标记对错，系统会记录测试结果
4. **复习模式**：重点复习未掌握或标记为困难的汉字

## 🔮 后续计划

- [ ] 语音朗读功能（TTS）
- [ ] 游戏化元素（积分、成就系统）
- [ ] 多种卡片主题切换
- [ ] 导出学习报告
- [ ] 自定义汉字添加功能
- [ ] PWA支持，可添加到主屏幕

## 📄 许可证

MIT License

## 🙏 致谢

感谢艾莎公主的魔法，让学习汉字变得更有趣！

---

**享受学习，享受魔法！** ✨❄️

