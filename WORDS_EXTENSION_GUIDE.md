# 汉字数据扩展指南

## 📊 当前状态

- **现有汉字数**：20个（示例数据）
- **目标汉字数**：3000个

## 🎯 快速开始扩展

由于手动输入3000个完整汉字数据（包含拼音、意思、组词）工作量巨大，我建议以下方案：

### 方案A：使用我创建的扩展文件（推荐）

我已经创建了一个包含更多常用汉字的基础结构文件。您可以：

1. 使用拼音转换库自动生成拼音
2. 从字典API获取意思和组词
3. 批量处理生成完整数据

### 方案B：分批次手动添加

逐步添加常用汉字，每次添加50-100个。

## 🔧 技术实现

### 推荐工具

```bash
# 安装拼音转换库
npm install pinyin-pro --save-dev
```

### 示例脚本（扩展汉字到3000个）

创建文件 `scripts/extend-words.js`：

```javascript
const { pinyin } = require('pinyin-pro');
const fs = require('fs');

// 常用汉字字符列表（从《现代汉语常用字表》提取）
const commonChars = '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞';

// 读取现有数据
const existingWords = JSON.parse(fs.readFileSync('src/data/words.json', 'utf-8'));
let nextId = existingWords.length + 1;

// 生成新汉字数据
const newWords = [];
const uniqueChars = [...new Set(commonChars.split(''))];
const charsToAdd = Math.min(3000 - existingWords.length, uniqueChars.length);

for (let i = 0; i < charsToAdd; i++) {
  const char = uniqueChars[i];
  // 跳过已存在的汉字
  if (existingWords.some(w => w.character === char)) {
    continue;
  }
  
  const id = `word-${String(nextId++).padStart(4, '0')}`;
  
  // 自动生成拼音
  const pinyinText = pinyin(char, { toneType: 'symbol' });
  
  // 分类和难度（这里简化处理，实际应该根据汉字常用度）
  let category = '一年级';
  let difficulty = 1;
  if (i > 400) category = '二年级', difficulty = 2;
  if (i > 800) category = '三年级', difficulty = 2;
  if (i > 1200) category = '四年级', difficulty = 3;
  if (i > 1600) category = '五年级', difficulty = 3;
  if (i > 2000) category = '六年级', difficulty = 4;
  
  newWords.push({
    id,
    character: char,
    pinyin: pinyinText,
    meaning: `${char}的意思（需从字典获取）`, // 需要从字典API获取
    words: [`${char}字`, `${char}词`], // 需要从字典API获取
    category,
    difficulty
  });
}

// 合并数据
const allWords = [...existingWords, ...newWords];

// 保存
fs.writeFileSync('src/data/words.json', JSON.stringify(allWords, null, 2));
console.log(`成功添加 ${newWords.length} 个汉字，总计 ${allWords.length} 个`);
console.log('注意：拼音已自动生成，但意思和组词需要从字典API获取并更新');
```

### 运行脚本

```bash
node scripts/extend-words.js
```

## 📝 下一步

1. **获取完整数据**：
   - 使用字典API获取每个汉字的意思和组词
   - 更新 `words.json` 文件

2. **验证数据**：
   - 检查拼音准确性
   - 检查意思解释是否合适
   - 检查组词是否合理

3. **优化性能**：
   - 如果数据文件过大，考虑使用分页加载
   - 或使用数据库存储

## 💡 建议

- 先扩展到500个常用汉字进行测试
- 确认功能正常后再扩展到3000个
- 使用自动化工具处理批量数据

---

**提示**：完整的3000个汉字数据文件可能较大（几MB），请确保应用性能能够承受。

