# 汉字数据整合指南

## 概述

本项目通过 `allWord.ts` 中的数据整合功能，将五个年级的汉字列表转换为标准的 `words.json` 格式。

## 数据统计

| 年级 | 字符数 |
|------|--------|
| 一年级 | 347 |
| 二年级 | 317 |
| 三年级 | 265 |
| 四年级 | 307 |
| 五年级 | 170 |
| **总计** | **1406** |

## 核心方法

### 1. `generateWordData(character, gradeIndex, wordIndex)`
根据单个字符和年级信息生成 Word 对象

**参数:**
- `character` (string): 汉字
- `gradeIndex` (number): 年级索引 (0-4 分别对应一年级至五年级)
- `wordIndex` (number): 在该年级中的位置索引

**返回值:**
```typescript
{
  id: "word-0001",           // 全局唯一ID
  character: "一",           // 汉字
  pinyin: "yī",             // 拼音
  meaning: "一的意思",       // 意思（可自定义）
  words: ["一字", "一词", "用一"],  // 组词示例
  category: "一年级",        // 年级
  difficulty: 1             // 难度（1-5）
}
```

**使用示例:**
```typescript
import { generateWordData } from './src/data/allWord'

// 生成 GRADE_TWO 中第一个字的数据
const wordData = generateWordData('宜', 1, 0)
console.log(wordData)
// { id: "word-0348", character: "宜", pinyin: "pīn yīn", ... }
```

### 2. `mergeAllGradesData()`
整合所有五个年级的字符数据为统一的 Word 数组

**返回值:** `WordData[]` - 包含所有 1406 个字符的数组

**使用示例:**
```typescript
import { mergeAllGradesData } from './src/data/allWord'

const allWords = mergeAllGradesData()
console.log(`总共 ${allWords.length} 个字符`)
console.log('一年级到五年级的所有字符:', allWords)

// 导出为 JSON
import { writeFileSync } from 'fs'
writeFileSync('words.json', JSON.stringify(allWords, null, 2))
```

### 3. `getDataSummary()`
获取数据整合的统计信息

**返回值:**
```typescript
{
  totalCharacters: 1406,
  byGrade: [
    { grade: "一年级", count: 347 },
    { grade: "二年级", count: 317 },
    { grade: "三年级", count: 265 },
    { grade: "四年级", count: 307 },
    { grade: "五年级", count: 170 }
  ],
  idRange: "word-0001 至 word-1406"
}
```

**使用示例:**
```typescript
import { getDataSummary } from './src/data/allWord'

const summary = getDataSummary()
console.log(`总字符数: ${summary.totalCharacters}`)
summary.byGrade.forEach(({ grade, count }) => {
  console.log(`${grade}: ${count} 个字`)
})
```

### 4. `checkDuplicates(arr, arrayName)`
检查数组中是否有重复元素

**使用示例:**
```typescript
import { checkDuplicates, GRADE_ONE } from './src/data/allWord'

const result = checkDuplicates(GRADE_ONE, 'GRADE_ONE')
console.log(result.getMessage())
// ✓ GRADE_ONE: 无重复，共 347 个字符
```

### 5. `validateAllGrades()`
一次性验证所有五个年级的数据重复情况

**使用示例:**
```typescript
import { validateAllGrades } from './src/data/allWord'

validateAllGrades()
// =══════════════════════════════
// ✓ GRADE_ONE: 无重复，共 347 个字符
// ✓ GRADE_TWO: 无重复，共 317 个字符
// ✓ GRADE_THREE: 无重复，共 265 个字符
// ✓ GRADE_FOUR: 无重复，共 307 个字符
// ✓ GRADE_FIVE: 无重复，共 170 个字符
// 总结: 所有数据无重复
```

## 拼音映射

项目内置了常见字符的拼音映射表。如果某个字符不在映射表中，会使用默认值 `'pīn yīn'`。

**扩展拼音映射:**
```typescript
// 在 src/data/allWord.ts 中修改 characterPinyinMap
const characterPinyinMap: Record<string, string> = {
  '新字': 'xīn zì',
  '自定义': 'zì dìng yì',
  // ... 添加更多映射
}
```

## 生成完整数据

项目提供了自动生成脚本：

```bash
# 运行生成脚本，生成 words-generated.json
npx tsx generate-words-data.ts
```

这会生成 `src/data/words-generated.json` 文件，包含所有 1406 个字符的完整数据。

## 数据格式

生成的 JSON 格式符合应用的标准：

```json
[
  {
    "id": "word-0001",
    "character": "一",
    "pinyin": "yī",
    "meaning": "一的意思",
    "words": ["一字", "一词", "用一"],
    "category": "一年级",
    "difficulty": 1
  },
  ...
]
```

## 集成到应用

### 方案 1: 直接使用内存数据
```typescript
import { mergeAllGradesData } from '@/data/allWord'

const words = mergeAllGradesData()
// 在应用启动时加载
```

### 方案 2: 使用生成的 JSON 文件
```typescript
import wordsData from '@/data/words-generated.json'
const words = wordsData
```

### 方案 3: 分年级加载
```typescript
import { GRADE_ONE, GRADE_TWO, GRADE_THREE, GRADE_FOUR, GRADE_FIVE } from '@/data/allWord'

const gradeData = {
  '一年级': GRADE_ONE,
  '二年级': GRADE_TWO,
  '三年级': GRADE_THREE,
  '四年级': GRADE_FOUR,
  '五年级': GRADE_FIVE
}
```

## 常见问题

### Q: 如何更新拼音或意思？
A: 修改 `characterPinyinMap` 或 `generateWordData` 函数中的默认值。

### Q: 为什么有些字符的拼音是 "pīn yīn"？
A: 这些字符不在 `characterPinyinMap` 中。请根据需要添加到映射表中。

### Q: 如何添加自定义的组词？
A: 在 `generateWordData` 函数中修改 `words` 数组的生成逻辑。

### Q: 生成的 ID 是按什么顺序的？
A: ID 按字符在所有年级中的全局位置生成，一年级在 word-0001 到 word-0347，二年级在 word-0348 到 word-0664，依此类推。
