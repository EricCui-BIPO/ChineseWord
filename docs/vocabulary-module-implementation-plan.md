# 词语学习模块 - 实现计划

**项目**: ChineseWord - 词语学习模块
**版本**: 1.0
**日期**: 2025-11-07
**预计周期**: 3 周

---

## 📅 项目时间线

### 第 1 周：核心框架搭建

#### 第 1-2 天：数据和类型
- [ ] 创建 `types/vocabulary.ts`（类型定义）
- [ ] 生成初始 100 个测试词汇（中文小学常用词）
- [ ] 创建 `data/vocabulary.json`（初始 100 条数据）
- [ ] 验证数据结构和完整性

**交付物**:
- 类型定义文件
- 100 条测试数据

**验证**:
```bash
npm run type-check  # 确保类型检查通过
```

#### 第 3-4 天：状态管理和业务逻辑
- [ ] 创建 `stores/vocabularyProgressStore.ts`（进度追踪）
- [ ] 创建 `stores/vocabularyGameStore.ts`（游戏状态）
- [ ] 创建 `composables/useVocabularyData.ts`（数据访问）
- [ ] 创建 `composables/useVocabularyGame.ts`（游戏逻辑）
- [ ] 单元测试（覆盖 > 80%）

**交付物**:
- Pinia stores (2 个)
- Composables (2 个)
- 测试用例

**验证**:
```bash
npm run test:unit   # 单元测试通过率 > 80%
```

#### 第 5-7 天：UI 组件
- [ ] 创建 `views/VocabularyHome.vue`（学习首页）
- [ ] 创建 `games/vocabularyGame/components/VocabularyGameMain.vue`（游戏主容器）
- [ ] 创建 `games/vocabularyGame/components/VocabularyGameBoard.vue`（网格布局）
- [ ] 创建 `games/vocabularyGame/components/VocabularyAnswerCard.vue`（答案卡片）
- [ ] 创建 `views/VocabularyGame.vue`（路由视图）
- [ ] 样式调整（Tailwind CSS + Elsa 主题）

**交付物**:
- 4 个 Vue 组件
- 样式文件

**验证**:
- 页面渲染无错误
- 样式与 Elsa 主题一致

---

### 第 2 周：游戏核心逻辑

#### 第 1-2 天：游戏循环和计时
- [ ] 实现 `useGameLoop.ts`（倒计时逻辑）
- [ ] 实现答题循环（生成题目 → 显示 → 收集答案 → 检验）
- [ ] 实现计分系统（基础分 + 奖励 + 惩罚）
- [ ] 实现连击追踪

**交付物**:
- 完整的游戏循环

**验证**:
- 倒计时准确
- 分数计算正确
- 连击逻辑正确

#### 第 3-5 天：题目生成和选择
- [ ] 创建 `games/vocabularyGame/utils/vocabularySelector.ts`（词汇选择算法）
- [ ] 实现三种题目类型（释义 / 拼音 / 例句）
- [ ] 实现随机选题逻辑
- [ ] 实现难度递进逻辑

**交付物**:
- 题目生成器

**验证**:
- 题目多样化（各类型均衡）
- 选项随机无重复
- 难度递进符合预期

#### 第 6-7 天：游戏反馈和动画
- [ ] 实现正确/错误反馈动画
- [ ] 实现分数浮动显示
- [ ] 实现连击指示器
- [ ] 实现游戏结束界面

**交付物**:
- 完整的游戏反馈系统

**验证**:
- 动画流畅 (60 FPS)
- 反馈及时清晰

---

### 第 3 周：集成、优化和发布

#### 第 1-2 天：路由和首页集成
- [ ] 更新 `src/router/index.ts`（添加词语模块路由）
- [ ] 更新 `src/views/Home.vue`（添加词语学习卡片）
- [ ] 实现页面导航流
- [ ] 测试路由跳转

**交付物**:
- 集成完整的路由系统

**验证**:
```bash
npm run dev          # 导航成功，页面加载正常
```

#### 第 3-4 天：进度页面和统计
- [ ] 创建 `views/VocabularyProgress.vue`（进度统计页）
- [ ] 实现进度条组件
- [ ] 实现统计数据计算
- [ ] 实现过滤和搜索

**交付物**:
- 完整的进度统计系统

#### 第 5-6 天：性能优化和测试
- [ ] 运行 `npm run type-check`（确保无错误）
- [ ] 运行 `npm run build`（生产构建）
- [ ] 检查包大小（< 80 KB gzipped）
- [ ] 性能测试（FPS, 加载时间）
- [ ] 跨浏览器兼容测试
- [ ] 响应式设计测试

**交付物**:
- 性能报告
- 优化完成

#### 第 7 天：数据扩展至 1000
- [ ] 生成完整 1000 条词汇数据
- [ ] 验证数据质量
- [ ] 数据分类标注
- [ ] 最终集成测试
- [ ] 发布 v1.0

**交付物**:
- 完整 1000 条词汇数据

---

## 🔨 实现细节和 Checklist

### Phase 1: 数据准备

**Task 1.1: 创建类型定义**
```typescript
// src/types/vocabulary.ts

✅ VocabularyItem 接口
✅ VocabularyProgress 接口
✅ GameSession 接口
✅ GAME_CONFIG 常量
✅ 导出所有类型
```

**验证**:
```bash
cd src/types
cat vocabulary.ts | wc -l  # 检查文件大小
```

**Task 1.2: 生成初始 100 个词汇**

词汇来源和选择标准：
- 来自小学语文教学大纲
- 按难度分配：简单 40 个，中等 40 个，困难 20 个
- 按年级分配：1-3 年级 50 个，4-6 年级 50 个
- 按主题分配：动物 20，植物 15，食物 20，日常 20，学校 15，其他 10

**示例数据**:
```json
{
  "id": "vocab-0001",
  "word": "蝴蝶",
  "pinyin": "hú dié",
  "meaning": "一种昆虫，有彩色的翅膀",
  "exampleSentence": "花园里飞着许多美丽的蝴蝶。",
  "synonym": ["彩蝶"],
  "category": "动物",
  "grade": 2,
  "difficulty": 1,
  "themes": ["动物", "昆虫"]
}
```

**验证**:
```bash
npm run type-check
# 确保 JSON 格式正确且无类型错误
```

### Phase 2: 状态管理

**Task 2.1: 创建进度追踪 Store**

参考现有 `progressStore.ts` 的模式：
```typescript
✅ useVocabularyProgressStore 定义
✅ 状态：progressMap, stats
✅ 方法：getProgress, markLearned, markMastered, etc.
✅ localStorage 同步
```

**单元测试**:
```typescript
✅ markLearned() 更新状态
✅ markMastered() 标记掌握
✅ getReviewItems() 返回需复习项
✅ localStorage 同步
```

**Task 2.2: 创建游戏状态 Store**

参考现有 `whackAMoleStore.ts` 的模式：
```typescript
✅ useVocabularyGameStore 定义
✅ 游戏状态管理（idle/playing/paused/finished）
✅ 分数追踪
✅ 题目管理
✅ 计时管理
```

**单元测试**:
```typescript
✅ startGame() 初始化游戏
✅ handleAnswer() 处理答案
✅ endGame() 结束游戏
✅ 分数计算正确
```

**Task 2.3: 创建数据访问 Composable**

```typescript
✅ useVocabularyData() 定义
✅ 数据加载和缓存
✅ 导航：nextItem, prevItem, randomItem
✅ 过滤：setFilter, filteredItems
✅ 搜索：按关键词搜索
```

**Task 2.4: 创建游戏逻辑 Composable**

```typescript
✅ useVocabularyGame() 定义
✅ 游戏启动和停止
✅ 计时器管理
✅ 答题处理
✅ 进度同步
```

### Phase 3: 前端组件

**Task 3.1: 创建词语学习首页**

`views/VocabularyHome.vue`:
```vue
✅ 模块介绍
✅ 游戏化学习卡片
✅ 难度选择按钮（简单/中等/困难）
✅ 开始游戏按钮
✅ 进度统计卡片
✅ 传统学习链接（可选）
```

**样式检查**:
- [ ] 背景：Elsa 主题渐变
- [ ] 卡片：白色圆角，蓝色阴影
- [ ] 按钮：蓝色填充，白色文字
- [ ] 文本：黑色标题，灰色副文本
- [ ] 响应式：Mobile/Tablet/Desktop 适配

**交互测试**:
```
✅ 点击难度按钮选择
✅ 点击"开始游戏"导航到游戏页
✅ 点击进度卡片展示详情
```

**Task 3.2: 创建游戏主容器**

`games/vocabularyGame/components/VocabularyGameMain.vue`:
```vue
✅ 顶部状态栏（返回/计时/分数）
✅ 题目显示区域
✅ 游戏网格容器
✅ 游戏反馈区域
✅ 连击指示器
✅ 游戏控制（暂停/继续）
```

**Task 3.3: 创建游戏网格**

`games/vocabularyGame/components/VocabularyGameBoard.vue`:
```vue
✅ 3x3 网格布局
✅ 自适应卡片大小
✅ 响应式列数调整（Mobile: 3x3, Tablet: 3x4, Desktop: 3x3）
✅ 卡片间距和对齐
```

**Task 3.4: 创建答案卡片**

`games/vocabularyGame/components/VocabularyAnswerCard.vue`:
```vue
✅ 卡片内容显示
✅ 触碰反馈（高亮/按下）
✅ 正确/错误状态样式
✅ 动画效果
✅ 无障碍支持（aria-label）
```

**样式细节**:
```css
✅ 默认：白色背景，蓝色边框
✅ 悬停：浅蓝背景，阴影增强
✅ 按下：深蓝背景，文字白色
✅ 正确：绿色背景，勾选图标
✅ 错误：红色背景，X 图标
```

### Phase 4: 游戏逻辑

**Task 4.1: 实现游戏循环**

```typescript
游戏流程：
1. 初始化（重置计分/计时）
2. 启动计时器
3. 生成第一题
4. 循环：
   a. 显示题目
   b. 等待用户答题
   c. 验证答案
   d. 更新分数/连击
   e. 显示反馈 (1 秒)
   f. 生成下一题
5. 60 秒倒计时结束
6. 游戏结束，保存结果
```

**验证测试**:
```typescript
✅ 计时准确（每秒递减）
✅ 题目按时生成
✅ 答案及时验证
✅ 分数实时更新
```

**Task 4.2: 实现题目生成器**

`games/vocabularyGame/utils/vocabularySelector.ts`:
```typescript
✅ VocabularySelector 类
✅ selectQuestion() 返回题目
✅ 三种题目类型随机轮换
✅ 选项随机生成（无重复）
✅ 难度递进逻辑
```

**题目类型**:
1. **释义题** (Meaning)
   - 显示释义 → 选择对应词汇
   - 示例：「一种昆虫，有彩色的翅膀」→ 选择 [蝴蝶]

2. **拼音题** (Pinyin)
   - 显示拼音 → 选择对应词汇
   - 示例：「hú dié」→ 选择 [蝴蝶]

3. **例句填空题** (Example)
   - 显示例句和空白 → 选择对应词汇
   - 示例：「花园里飞着许多___」→ 选择 [蝴蝶]

**验证**:
```typescript
✅ 各类型题目均衡出现
✅ 选项多样且无重复
✅ 难度适应玩家水平
```

**Task 4.3: 实现计分系统**

```typescript
基础分数：
- 简单: +5 分
- 中等: +10 分
- 困难: +15 分
- 错误: -1 分

奖励：
- 连击 3 个: +20 分
- 连击 6 个: +50 分
- 连击 9 个: +100 分

验证：
✅ 分数计算准确
✅ 奖励条件正确
✅ 实时显示更新
```

**Task 4.4: 实现游戏反馈**

动画和视觉反馈：
```typescript
✅ 正确：卡片变绿 + 勾选图标 + 分数浮动
✅ 错误：卡片变红 + X 图标 + 1 秒后显示正确答案
✅ 连击：显示「连击 X 次 [🔥]」
✅ 奖励：连击达到时闪烁 + 显示「+20 分奖励」
```

**性能要求**:
- 动画帧率 60 FPS
- 反馈延迟 < 100ms
- 动画时长 0.5-1 秒

### Phase 5: 集成和优化

**Task 5.1: 路由集成**

更新 `src/router/index.ts`:
```typescript
✅ 添加 /vocabulary/home 路由
✅ 添加 /vocabulary 游戏路由
✅ 添加 /vocabulary/progress 进度路由
✅ 配置懒加载
```

**Task 5.2: Home 页面集成**

更新 `src/views/Home.vue`:
```vue
✅ 添加词语学习卡片
✅ 设置卡片图标（📚）
✅ 设置卡片颜色（蓝色主题）
✅ 设置路由链接（to="/vocabulary/home"）
✅ 配置响应式布局
```

**Task 5.3: 性能优化**

```bash
✅ npm run type-check 通过
✅ npm run build 通过
✅ 检查包体积：dist/assets 增加 < 80 KB (gzip)
✅ 检查首屏加载时间 < 2 秒
✅ 检查游戏 FPS 稳定在 60
✅ 检查内存占用稳定 < 100 MB
```

**Task 5.4: 响应式测试**

```
设备测试:
✅ iPhone 12 (390x844)
✅ iPad (768x1024)
✅ MacBook Pro (1920x1080)
✅ 桌面浏览器 (1920x1440)

功能测试:
✅ 触碰操作（移动端）
✅ 键盘导航（桌面端）
✅ 屏幕旋转适配
```

**Task 5.5: 浏览器兼容性**

```
✅ Chrome 90+
✅ Safari 14+
✅ Firefox 88+
✅ Edge 90+

检查项:
✅ CSS Grid/Flexbox 布局
✅ ES6+ JavaScript 功能
✅ 动画流畅性
```

### Phase 6: 数据扩展

**Task 6.1: 生成完整 1000 词汇数据**

创建数据生成脚本 `scripts/generate-vocabulary.js`:
```javascript
✅ 从词库中选择 1000 个小学常用词
✅ 分配年级（1-6 年级均衡分布）
✅ 分配难度（简单/中等/困难）
✅ 分配主题分类
✅ 生成拼音（使用 pinyin-pro）
✅ 编写例句
✅ 添加近义词/反义词
✅ 生成 data/vocabulary.json
```

**词汇来源**:
- 小学语文教学大纲
- 常用成语词典
- 现代汉语字典

**数据质量检查**:
```typescript
✅ 每个词汇有 id, word, pinyin, meaning
✅ 拼音格式一致
✅ 例句清晰易懂
✅ 无重复 ID
✅ 数据量 == 1000
```

**Task 6.2: 数据验证**

```bash
node scripts/validate-vocabulary.js

检查项:
✅ JSON 格式有效
✅ 所有必填字段存在
✅ 数据类型正确
✅ 拼音格式有效
✅ 无重复词汇
✅ 统计分布合理
```

---

## 🧪 测试策略

### 单元测试

**Store 测试** (`tests/stores/`):
```typescript
✅ vocabularyProgressStore.spec.ts
  - markLearned() 更新状态
  - markMastered() 标记掌握
  - getReviewItems() 返回需复习项
  - localStorage 同步

✅ vocabularyGameStore.spec.ts
  - startGame() 初始化
  - handleAnswer() 正确/错误处理
  - 分数计算
  - 计时管理
```

**Composable 测试** (`tests/composables/`):
```typescript
✅ useVocabularyData.spec.ts
  - 数据加载
  - 导航（next/prev/random）
  - 过滤和搜索
  - 当前项指针

✅ useVocabularyGame.spec.ts
  - 游戏启动/停止
  - 计时准确性
  - 答题处理
```

**工具函数测试** (`tests/utils/`):
```typescript
✅ vocabularySelector.spec.ts
  - 题目生成
  - 选项多样性
  - 难度递进
```

**覆盖率目标**: > 80%

### 集成测试

`tests/integration/vocabularyGameFlow.spec.ts`:
```typescript
✅ 完整游戏流程
  1. 进入首页
  2. 选择难度
  3. 开始游戏
  4. 完成一局
  5. 查看分数
  6. 返回首页

✅ 数据持久化
  - 进度保存到 localStorage
  - 刷新页面后数据恢复
```

### E2E 测试

`cypress/vocabulary.cy.ts`:
```typescript
✅ 用户场景 1：新用户学习
✅ 用户场景 2：回访用户继续学习
✅ 用户场景 3：查看学习进度
```

### 手动测试清单

**功能测试**:
- [ ] 能进入词语学习模块
- [ ] 能选择学习难度
- [ ] 游戏能成功启动
- [ ] 能答题和获得分数反馈
- [ ] 60 秒后游戏结束
- [ ] 能查看游戏结果
- [ ] 能返回主页
- [ ] 进度能保存到 localStorage

**UI/UX 测试**:
- [ ] 页面布局美观
- [ ] 文字清晰易读
- [ ] 按钮易点击
- [ ] 动画流畅
- [ ] 颜色搭配合理

**性能测试**:
- [ ] 首页加载 < 2 秒
- [ ] 游戏运行 60 FPS
- [ ] 内存占用稳定
- [ ] 无内存泄漏

**兼容性测试**:
- [ ] Chrome, Safari, Firefox 都能正常运行
- [ ] 手机、平板、桌面都能适配
- [ ] 纵向和横向屏幕都能适配

---

## 📊 质量指标

| 指标 | 目标 | 验证方法 |
|------|------|----------|
| TypeScript 错误 | 0 | npm run type-check |
| 单元测试覆盖率 | > 80% | npm run test:unit |
| 集成测试通过率 | 100% | npm run test:integration |
| 包体积增加 | < 80 KB (gzip) | npm run build + analysis |
| 首屏加载时间 | < 2 秒 | Chrome DevTools |
| 游戏帧率 | 60 FPS | React DevTools Profiler |
| 内存占用 | < 100 MB | Chrome Memory Profiler |
| 浏览器兼容性 | Chrome 90+, Safari 14+, Firefox 88+ | Manual testing |
| 响应式设计 | 375px - 1920px | Manual testing |
| 无障碍评分 | > 90 | Lighthouse |

---

## 🚀 发布清单

发布前需完成：

```
代码质量:
☑️ npm run type-check 通过
☑️ npm run lint 通过
☑️ npm run test:unit 覆盖 > 80%
☑️ npm run build 成功
☑️ 无 console.log 或 debugger

功能完整性:
☑️ 词语学习首页完成
☑️ 游戏核心逻辑完成
☑️ 进度追踪完成
☑️ 所有页面响应式适配
☑️ 返回/导航按钮可用

性能验证:
☑️ 包体积 < 原本 + 80 KB
☑️ 首屏加载 < 2 秒
☑️ 游戏运行 60 FPS
☑️ 无内存泄漏

测试覆盖:
☑️ 单元测试 > 80% 覆盖
☑️ 核心功能手动测试通过
☑️ 三个设备尺寸适配测试通过
☑️ 三个浏览器兼容性测试通过

文档完善:
☑️ 代码注释完整
☑️ API 文档完善
☑️ README 已更新
☑️ 实现报告已生成

用户体验:
☑️ 游戏界面美观
☑️ 操作流畅无卡顿
☑️ 进度反馈清晰
☑️ 视觉效果吸引人
```

---

## 📝 知识转移

### 代码规范参考

**参考现有模块**:
- 字符学习模块: `src/views/StudyMode.vue`
- 成语模块: `src/stores/idiomProgressStore.ts`
- 打地鼠游戏: `src/games/whackAMole/`

**风格指南**:
- 使用 Vue 3 Composition API
- 使用 TypeScript 严格模式
- 使用 Tailwind CSS 做样式
- 使用 Pinia 管理状态
- 组件名使用 PascalCase
- 文件名使用 kebab-case

---

## 🔄 风险管理

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 1000 词汇生成耗时 | 中 | 使用脚本批量生成，并行处理 |
| 游戏性不足 | 中 | 早期用户测试，迭代改进 |
| 性能下降 | 中 | 定期性能测试，及早优化 |
| 浏览器兼容问题 | 低 | 使用标准 Web API，early testing |

---

**文档版本**: 1.0
**最后更新**: 2025-11-07
**下一步**: 开始实现（Phase 1）
