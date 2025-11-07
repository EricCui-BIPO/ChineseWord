import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const vocabPath = path.join(__dirname, '../src/data/vocabulary.json')
const data = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'))

console.log('=== 词语JSON问题检测 ===\n')

let issues = {
  genericExamples: [],
  badPinyin: [],
  emptyMeaning: [],
  duplicates: new Map(),
}

data.forEach((item, idx) => {
  // 1. 模板式例句
  if (item.exampleSentence && item.exampleSentence.includes('这是一个包含')) {
    issues.genericExamples.push({ idx, word: item.word, example: item.exampleSentence })
  }

  // 2. 错误拼音（以yīn结尾）
  if (item.pinyin && item.pinyin.endsWith('yīn')) {
    issues.badPinyin.push({ idx, word: item.word, pinyin: item.pinyin })
  }

  // 3. 空或模板式含义
  if (!item.meaning || item.meaning.includes('的含义解释')) {
    issues.emptyMeaning.push({ idx, word: item.word, meaning: item.meaning })
  }

  // 4. 重复词汇
  if (issues.duplicates.has(item.word)) {
    issues.duplicates.get(item.word).push(idx)
  } else {
    issues.duplicates.set(item.word, [idx])
  }
})

const dupCount = Array.from(issues.duplicates.values()).filter(arr => arr.length > 1).length

console.log(`总词汇数: ${data.length}`)
console.log(`❌ 模板式例句: ${issues.genericExamples.length}`)
console.log(`❌ 错误拼音(以yīn结尾): ${issues.badPinyin.length}`)
console.log(`❌ 空/模板式含义: ${issues.emptyMeaning.length}`)
console.log(`❌ 重复词汇: ${dupCount}\n`)

if (issues.genericExamples.length > 0) {
  console.log('=== 模板式例句样本 ===')
  issues.genericExamples.slice(0, 5).forEach(item => {
    console.log(`[${item.idx}] ${item.word}: "${item.example}"`)
  })
  console.log()
}

if (issues.badPinyin.length > 0) {
  console.log('=== 错误拼音样本 ===')
  issues.badPinyin.slice(0, 5).forEach(item => {
    console.log(`[${item.idx}] ${item.word}: "${item.pinyin}"`)
  })
  console.log()
}

if (issues.emptyMeaning.length > 0) {
  console.log('=== 空含义样本 ===')
  issues.emptyMeaning.slice(0, 5).forEach(item => {
    console.log(`[${item.idx}] ${item.word}: "${item.meaning}"`)
  })
  console.log()
}

if (dupCount > 0) {
  console.log('=== 重复词汇样本 ===')
  let count = 0
  for (const [word, indices] of issues.duplicates.entries()) {
    if (indices.length > 1) {
      console.log(`"${word}": ${indices.length}次，索引: ${indices.join(', ')}`)
      count++
      if (count >= 10) break
    }
  }
  console.log()
}

// 统计摘要
const totalIssues =
  issues.genericExamples.length +
  issues.badPinyin.length +
  issues.emptyMeaning.length +
  dupCount

console.log(`\n总计需要修复: ${totalIssues} 个问题`)
