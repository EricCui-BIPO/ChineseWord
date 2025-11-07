# 词语学习模块 - 快速开始指南

**项目**: ChineseWord - 词语学习模块
**版本**: 1.0
**日期**: 2025-11-07
**状态**: BMAD 框架设计完成，准备实现

---

## 📚 项目概览

### 模块目标
为 6-12 岁小学生提供**游戏化的词语学习体验**，帮助他们掌握 1,000 个小学常用词汇。

### 关键特性
✅ **游戏化学习** - 类似打地鼠的互动游戏
✅ **1000 个词汇** - 小学一至六年级常用词汇
✅ **自动进度追踪** - 本地 localStorage 持久化
✅ **智能难度递进** - 根据答题情况自适应
✅ **Elsa 主题** - 与现有应用视觉一致
✅ **完美响应式** - 手机、平板、桌面全支持

---

## 📋 BMAD 设计文档

项目使用 **BMAD 企业级开发框架** 完成需求分析、设计和规划，已生成 4 份详细文档：

### 1. 产品需求文档 (PRD)
📄 `docs/vocabulary-module-prd.md`

**包含内容**:
- 执行总结和业务目标
- 用户画像（小学生、家长、教师）
- 功能需求详解
  - 词语库管理（1000 个词汇按年级/主题/难度组织）
  - 游戏化学习模式（词语消消乐、拼音配对、主题闯关）
  - 传统学习模式（顺序学习、复习、详情页）
  - 进度追踪和个性化学习路径
- UI/交互需求（3 个关键页面的布局设计）
- 内容标准和质量要求
- 发布计划（3 周 MVP）
- 成功指标和验收标准

**快速链接**: [查看完整 PRD](docs/vocabulary-module-prd.md)

---

### 2. UX 设计规格
📄 `docs/vocabulary-module-ux-design.md`

**包含内容**:
- **设计系统**
  - Elsa 冰雪主题色彩体系
  - 字体、圆角、间距、阴影标准

- **用户旅程地图**
  - 新用户流程
  - 回访用户流程

- **详细页面设计**
  - 词语学习首页 (VocabularyHome)
  - 词语游戏界面 (VocabularyGame)
  - 游戏结束页 (GameResult)
  - 进度统计页 (Progress)

- **组件库设计**
  - 按钮、卡片、进度条、答案卡片等

- **交互和动画**
  - 悬停效果、按下效果、反馈动画
  - 卡片翻转、淡入淡出、微交互

- **响应式设计**
  - Mobile (375px), Tablet (640px), Desktop (1024px+)
  - 字体、按钮、网格的响应式调整

- **无障碍设计**
  - 键盘导航、屏幕阅读器支持、高对比度模式

**快速链接**: [查看完整 UX 设计](docs/vocabulary-module-ux-design.md)

---

### 3. 技术架构设计
📄 `docs/vocabulary-module-architecture.md`

**包含内容**:
- **高层架构**
  - 应用层、表现层、业务层、状态层、数据层、持久化层

- **目录结构**
  ```
  src/
  ├── data/vocabulary.json
  ├── types/vocabulary.ts
  ├── stores/(vocabularyProgressStore, vocabularyGameStore)
  ├── composables/(useVocabularyData, useVocabularyGame)
  ├── games/vocabularyGame/(components, utils)
  ├── views/(VocabularyHome, VocabularyGame, VocabularyProgress)
  └── router/ (路由配置)
  ```

- **核心模块设计** (6 个模块)
  1. 类型定义 (types/vocabulary.ts)
  2. 进度追踪 Store (vocabularyProgressStore)
  3. 游戏状态 Store (vocabularyGameStore)
  4. 数据访问 Composable (useVocabularyData)
  5. 游戏逻辑 Composable (useVocabularyGame)
  6. 词语选择算法 (vocabularySelector)

- **数据流**
  - 应用启动 → 数据加载 → 游戏开始 → 答题循环 → 游戏结束 → 结果保存

- **持久化策略**
  - localStorage: `vocabulary-progress` (200 KB, 完全足够)
  - `vocabulary-game-history` (可选)

- **性能指标**
  - 初始加载 < 2 秒
  - 游戏 FPS 60
  - 内存占用 < 100 MB
  - 包体积增加 < 80 KB (gzipped)

**快速链接**: [查看完整架构设计](docs/vocabulary-module-architecture.md)

---

### 4. 实现计划
📄 `docs/vocabulary-module-implementation-plan.md`

**包含内容**:
- **3 周实现计划**
  - 第 1 周：核心框架搭建（数据、类型、状态管理、UI 组件）
  - 第 2 周：游戏核心逻辑（循环、题目生成、计分、反馈）
  - 第 3 周：集成、优化、发布（路由、性能、响应式、数据扩展）

- **详细任务分解** (25+ 个子任务)
  - 每个任务都有具体的 checklist
  - 包含验证方法和通过标准

- **测试策略**
  - 单元测试 (> 80% 覆盖率)
  - 集成测试 (完整流程)
  - E2E 测试 (用户场景)
  - 手动测试清单

- **质量指标** (7 个关键指标)
  - TypeScript 错误: 0
  - 单元测试覆盖: > 80%
  - 包体积增加: < 80 KB
  - 首屏加载: < 2 秒
  - 游戏 FPS: 60
  - 浏览器兼容: Chrome 90+, Safari 14+, Firefox 88+

- **发布前检查清单** (15+ 项)

**快速链接**: [查看完整实现计划](docs/vocabulary-module-implementation-plan.md)

---

## 🎮 游戏玩法简介

### 游戏模式：词语消消乐 (推荐首选)

```
┌─────────────────────────────┐
│ ← ⏰ 45秒  💯 分数: 240    │  <- 状态栏
├─────────────────────────────┤
│  题目: 一种昆虫，有彩色的  │
│  翅膀，喜欢在花朵上飞舞    │  <- 动态题目（三种类型轮换）
├─────────────────────────────┤
│  ┌─────┬─────┬─────┐       │
│  │蝴蝶 │蜜蜂 │蜻蜓 │       │  <- 3x3 网格（9 个答案）
│  ├─────┼─────┼─────┤       │
│  │老鼠 │松鼠 │兔子 │       │
│  ├─────┼─────┼─────┤       │
│  │狐狸 │ 狼  │ 熊  │       │
│  └─────┴─────┴─────┘       │
├─────────────────────────────┤
│  点击正确的答案              │
└─────────────────────────────┘
```

### 计分系统

```
基础分数：
- 简单词汇: +5 分
- 中等词汇: +10 分
- 困难词汇: +15 分
- 错误答案: -1 分

奖励：
- 连击 3 个: +20 分
- 连击 6 个: +50 分
- 连击 9 个: +100 分
```

### 题目类型（三种轮换）

1. **释义题** - 显示词汇释义，选择对应词汇
   - 例：「一种昆虫，有彩色的翅膀」→ 选择 蝴蝶

2. **拼音题** - 显示拼音，选择对应词汇
   - 例：「hú dié」→ 选择 蝴蝶

3. **例句题** - 显示例句空白，选择填空词汇
   - 例：「花园里飞着许多___」→ 选择 蝴蝶

---

## 📊 数据结构

### 词语项目 (VocabularyItem)

```json
{
  "id": "vocab-0001",
  "word": "蝴蝶",
  "pinyin": "hú dié",
  "meaning": "一种昆虫，有彩色的翅膀，喜欢在花朵上飞舞",
  "exampleSentence": "花园里飞着许多美丽的蝴蝶。",
  "synonym": ["彩蝶"],
  "antonym": [],
  "category": "动物",
  "grade": 2,
  "difficulty": 1,
  "themes": ["动物", "昆虫"],
  "imageUrl": "assets/images/vocab/butterfly.png"
}
```

### 进度记录 (VocabularyProgress)

```json
{
  "vocab-0001": {
    "vocabId": "vocab-0001",
    "learned": true,
    "mastered": false,
    "reviewCount": 2,
    "firstLearnedAt": 1699338000000,
    "lastReviewAt": 1699424400000,
    "correctInGame": 5,
    "wrongInGame": 2
  }
}
```

---

## 🚀 快速启动

### 第一步：理解设计

1. **阅读 PRD** (10 分钟)
   - 了解产品目标和用户需求
   - [docs/vocabulary-module-prd.md](docs/vocabulary-module-prd.md)

2. **浏览 UX 设计** (15 分钟)
   - 查看页面设计和交互流程
   - [docs/vocabulary-module-ux-design.md](docs/vocabulary-module-ux-design.md)

3. **学习架构设计** (20 分钟)
   - 理解技术实现方案
   - [docs/vocabulary-module-architecture.md](docs/vocabulary-module-architecture.md)

4. **查看实现计划** (10 分钟)
   - 了解 3 周的实现路线图
   - [docs/vocabulary-module-implementation-plan.md](docs/vocabulary-module-implementation-plan.md)

### 第二步：开发环境准备

```bash
# 进入项目目录
cd /Users/ericcui/WebstormProjects/ChineseWord

# 检查 Node.js 版本
node --version  # 需要 14+ 或 16+

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问应用
http://localhost:3000
```

### 第三步：开始实现

根据 [实现计划](docs/vocabulary-module-implementation-plan.md) 分阶段推进：

**Phase 1** (第 1 周)：
```bash
# 1. 创建类型定义
touch src/types/vocabulary.ts

# 2. 生成初始 100 个测试词汇
# (使用脚本或手工添加到 src/data/vocabulary.json)

# 3. 创建 Pinia stores
touch src/stores/vocabularyProgressStore.ts
touch src/stores/vocabularyGameStore.ts

# 4. 创建 composables
touch src/composables/useVocabularyData.ts
touch src/composables/useVocabularyGame.ts

# 5. 创建 Vue 组件
mkdir -p src/games/vocabularyGame/components
touch src/views/VocabularyHome.vue
touch src/views/VocabularyGame.vue
```

**Phase 2** (第 2 周)：
```bash
# 1. 完善游戏循环和计分
# 2. 实现题目生成器
# 3. 实现反馈动画
```

**Phase 3** (第 3 周)：
```bash
# 1. 集成到路由
# 2. 集成到 Home 页面
# 3. 性能优化和测试
# 4. 扩展至 1000 词汇
```

---

## ✅ 验证清单

在开始实现前，请确保理解以下内容：

- [ ] 了解 1000 个小学词汇的数据结构
- [ ] 明白游戏玩法（词语消消乐）和计分规则
- [ ] 理解 3 种题目类型的实现方式
- [ ] 掌握 Pinia store 的模式（参考现有 progressStore）
- [ ] 掌握 Vue 3 Composition API 的用法
- [ ] 了解 Tailwind CSS 的响应式断点
- [ ] 知道如何使用 localStorage 持久化数据
- [ ] 理解页面导航和路由配置

---

## 📞 参考资源

### 现有模块参考

**学习模块参考** (words/idioms):
- 数据结构: `src/types/word.ts`, `src/types/idiom.ts`
- Store 模式: `src/stores/progressStore.ts`, `src/stores/idiomProgressStore.ts`
- Composable 模式: `src/composables/useWordData.ts`
- UI 组件: `src/components/WordCard.vue`, `src/views/StudyMode.vue`

**游戏模块参考** (whack-a-mole):
- 架构: `src/games/whackAMole/`
- Store: `src/games/whackAMole/stores/whackAMoleStore.ts`
- 组件: `src/games/whackAMole/components/`
- 工具: `src/games/whackAMole/utils/problemGenerator.ts`

**路由和集成参考**:
- 路由配置: `src/router/index.ts`
- Home 页面: `src/views/Home.vue`

### 外部资源

- Vue 3 官方文档: https://vuejs.org
- Pinia 官方文档: https://pinia.vuejs.org
- Tailwind CSS: https://tailwindcss.com
- TypeScript 手册: https://www.typescriptlang.org/docs/

---

## 🎯 成功指标

项目完成后的预期成果：

✅ **功能完整**
- 1000 个小学词汇完整准确
- 游戏模式完全可玩，无卡顿
- 进度追踪准确实时
- 响应式设计完美适配

✅ **用户体验优秀**
- 游戏界面吸引人
- 学习过程自然流畅
- 进度反馈清晰有激励

✅ **性能达成**
- 首屏加载 < 2 秒
- 游戏帧率恒定 60 FPS
- 内存占用 < 100 MB

✅ **测试通过**
- 单元测试覆盖 > 80%
- 集成测试 100% 通过
- 手动 QA 完全通过
- 浏览器兼容性验证

---

## 📝 文档导航

| 文档 | 目的 | 受众 |
|------|------|------|
| [PRD](docs/vocabulary-module-prd.md) | 产品需求和目标 | PM, 设计师, 开发 |
| [UX 设计](docs/vocabulary-module-ux-design.md) | UI/交互设计详解 | 设计师, 前端开发 |
| [架构设计](docs/vocabulary-module-architecture.md) | 技术实现方案 | 前端开发, 架构师 |
| [实现计划](docs/vocabulary-module-implementation-plan.md) | 3 周实现路线图 | 项目经理, 开发 |
| [本文件](VOCABULARY-MODULE-QUICKSTART.md) | 快速开始指南 | 所有人 |

---

## 🎉 结语

这份设计使用 **BMAD 企业级开发框架** 精心策划，为词语学习模块提供了：

1. **清晰的产品愿景** (PRD) - 知道要做什么
2. **优秀的用户体验** (UX Design) - 知道怎么做得好看
3. **可靠的技术方案** (Architecture) - 知道怎么做得稳定
4. **详细的实现路线** (Implementation Plan) - 知道怎么按时做完

现在，你有了一份完整的、经过充分设计的蓝图。只需按照计划逐步实现，就能交付一个优质的词语学习模块。

**祝你实现顺利！🚀**

---

**文档版本**: 1.0
**最后更新**: 2025-11-07
**下一步**: 按照[实现计划](docs/vocabulary-module-implementation-plan.md)开始编码
