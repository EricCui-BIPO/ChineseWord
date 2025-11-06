import { mergeAllGradesData, getDataSummary } from './src/data/allWord'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 生成整合数据
const allWordsData = mergeAllGradesData()

// 生成统计信息
const summary = getDataSummary()

// 输出统计信息
console.log('=== 数据整合结果 ===')
console.log(`总字符数: ${summary.totalCharacters}`)
console.log('\n按年级统计:')
summary.byGrade.forEach(item => {
  console.log(`  ${item.grade}: ${item.count} 个字`)
})
console.log(`\n ID 范围: ${summary.idRange}`)

// 保存为 JSON 文件
const outputPath = join(__dirname, 'src/data/words-generated.json')
try {
  writeFileSync(outputPath, JSON.stringify(allWordsData, null, 2), 'utf-8')
  console.log(`\n✓ 已生成文件: ${outputPath}`)
  console.log(`\n前 5 条数据预览:`)
  console.log(JSON.stringify(allWordsData.slice(0, 5), null, 2))
} catch (error) {
  console.error('生成文件失败:', error)
}

export { allWordsData, summary }
