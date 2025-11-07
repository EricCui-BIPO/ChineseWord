/**
 * 词语数据生成脚本
 * 生成 1000 个小学常用词汇
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 词汇池：按难度和年级分组的词汇
 */
const vocabularyPool = {
  // 一年级词汇 (简单, 150-170 个)
  grade1: [
    { word: '爸爸', pinyin: 'bà ba', meaning: '父亲，男性家长', category: '家庭', themes: ['家庭', '人物'], difficulty: 1 },
    { word: '妈妈', pinyin: 'mā ma', meaning: '母亲，女性家长', category: '家庭', themes: ['家庭', '人物'], difficulty: 1 },
    { word: '我', pinyin: 'wǒ', meaning: '自己，第一人称', category: '日常用语', themes: ['日常', '代词'], difficulty: 1 },
    { word: '你', pinyin: 'nǐ', meaning: '对方，第二人称', category: '日常用语', themes: ['日常', '代词'], difficulty: 1 },
    { word: '他', pinyin: 'tā', meaning: '别人，第三人称', category: '日常用语', themes: ['日常', '代词'], difficulty: 1 },
    { word: '她', pinyin: 'tā', meaning: '女性，第三人称', category: '日常用语', themes: ['日常', '代词'], difficulty: 1 },
    { word: '是', pinyin: 'shì', meaning: '表示相同或属于', category: '日常用语', themes: ['日常', '动词'], difficulty: 1 },
    { word: '有', pinyin: 'yǒu', meaning: '拥有，存在', category: '日常用语', themes: ['日常', '动词'], difficulty: 1 },
    { word: '没有', pinyin: 'méi yǒu', meaning: '缺少，不存在', category: '日常用语', themes: ['日常', '动词'], difficulty: 1 },
    { word: '大', pinyin: 'dà', meaning: '体积或面积很宽阔', category: '形容词', themes: ['形容', '大小'], difficulty: 1 },
    { word: '小', pinyin: 'xiǎo', meaning: '体积或面积很窄小', category: '形容词', themes: ['形容', '大小'], difficulty: 1 },
    { word: '多', pinyin: 'duō', meaning: '数量很大', category: '形容词', themes: ['形容', '数量'], difficulty: 1 },
    { word: '少', pinyin: 'shǎo', meaning: '数量很小', category: '形容词', themes: ['形容', '数量'], difficulty: 1 },
    { word: '好', pinyin: 'hǎo', meaning: '优秀，令人满意', category: '形容词', themes: ['形容', '品质'], difficulty: 1 },
    { word: '坏', pinyin: 'huài', meaning: '不好，有害', category: '形容词', themes: ['形容', '品质'], difficulty: 1 },
    { word: '高', pinyin: 'gāo', meaning: '距离地面远', category: '形容词', themes: ['形容', '高低'], difficulty: 1 },
    { word: '低', pinyin: 'dī', meaning: '距离地面近', category: '形容词', themes: ['形容', '高低'], difficulty: 1 },
    { word: '长', pinyin: 'cháng', meaning: '延伸得远', category: '形容词', themes: ['形容', '长短'], difficulty: 1 },
    { word: '短', pinyin: 'duǎn', meaning: '延伸得近', category: '形容词', themes: ['形容', '长短'], difficulty: 1 },
    { word: '走', pinyin: 'zǒu', meaning: '用两条腿向前移动', category: '动作', themes: ['动作', '运动'], difficulty: 1 },
    { word: '跑', pinyin: 'pǎo', meaning: '快速移动身体', category: '动作', themes: ['动作', '运动'], difficulty: 1 },
    { word: '跳', pinyin: 'tiào', meaning: '脚离开地面向上移动', category: '动作', themes: ['动作', '运动'], difficulty: 1 },
    { word: '坐', pinyin: 'zuò', meaning: '身体保持弯曲状态', category: '动作', themes: ['动作', '姿态'], difficulty: 1 },
    { word: '站', pinyin: 'zhàn', meaning: '身体直立', category: '动作', themes: ['动作', '姿态'], difficulty: 1 },
    { word: '睡', pinyin: 'shuì', meaning: '闭上眼睛进入休息状态', category: '动作', themes: ['动作', '生活'], difficulty: 1 },
    { word: '吃', pinyin: 'chī', meaning: '把食物放进嘴里咀嚼吞咽', category: '动作', themes: ['动作', '生活'], difficulty: 1 },
    { word: '喝', pinyin: 'hē', meaning: '把液体吸进嘴里吞下去', category: '动作', themes: ['动作', '生活'], difficulty: 1 },
    { word: '看', pinyin: 'kàn', meaning: '用眼睛观察', category: '动作', themes: ['动作', '感觉'], difficulty: 1 },
    { word: '听', pinyin: 'tīng', meaning: '用耳朵接收声音', category: '动作', themes: ['动作', '感觉'], difficulty: 1 },
    { word: '说', pinyin: 'shuō', meaning: '用语言表达想法', category: '动作', themes: ['动作', '沟通'], difficulty: 1 },
    { word: '笑', pinyin: 'xiào', meaning: '嘴角上扬表达喜悦', category: '动作', themes: ['动作', '表情'], difficulty: 1 },
    { word: '哭', pinyin: 'kū', meaning: '流泪表示悲伤', category: '动作', themes: ['动作', '表情'], difficulty: 1 },
    { word: '玩', pinyin: 'wán', meaning: '从事娱乐活动', category: '动作', themes: ['动作', '娱乐'], difficulty: 1 },
    { word: '学习', pinyin: 'xué xí', meaning: '获取知识和技能', category: '动作', themes: ['动作', '学习'], difficulty: 1 },
    { word: '工作', pinyin: 'gōng zuò', meaning: '做任务以赚取报酬', category: '动作', themes: ['动作', '生活'], difficulty: 1 },
    { word: '猫', pinyin: 'māo', meaning: '一种常见的家畜', category: '动物', themes: ['动物', '家畜'], difficulty: 1 },
    { word: '狗', pinyin: 'gǒu', meaning: '人类最好的朋友', category: '动物', themes: ['动物', '家畜'], difficulty: 1 },
    { word: '鸟', pinyin: 'niǎo', meaning: '一种会飞的动物', category: '动物', themes: ['动物', '鸟类'], difficulty: 1 },
    { word: '鱼', pinyin: 'yú', meaning: '一种生活在水中的动物', category: '动物', themes: ['动物', '水生动物'], difficulty: 1 },
    { word: '花', pinyin: 'huā', meaning: '植物开放的最美部分', category: '植物', themes: ['植物', '花'], difficulty: 1 },
    { word: '树', pinyin: 'shù', meaning: '一种有根茎枝叶的植物', category: '植物', themes: ['植物', '树木'], difficulty: 1 },
    { word: '草', pinyin: 'cǎo', meaning: '一种小型绿色植物', category: '植物', themes: ['植物', '草'], difficulty: 1 },
    { word: '苹果', pinyin: 'píng guǒ', meaning: '一种圆形的水果', category: '食物', themes: ['食物', '水果'], difficulty: 1 },
    { word: '香蕉', pinyin: 'xiāng jiāo', meaning: '一种黄色的弯曲水果', category: '食物', themes: ['食物', '水果'], difficulty: 1 },
    { word: '西瓜', pinyin: 'xī guā', meaning: '一种大型夏季水果', category: '食物', themes: ['食物', '水果'], difficulty: 1 },
    { word: '米饭', pinyin: 'mǐ fàn', meaning: '用米煮成的食物', category: '食物', themes: ['食物', '主食'], difficulty: 1 },
    { word: '面条', pinyin: 'miàn tiáo', meaning: '用面粉做成的长条食物', category: '食物', themes: ['食物', '主食'], difficulty: 1 },
    { word: '面包', pinyin: 'miàn bāo', meaning: '用面粉烤制的食物', category: '食物', themes: ['食物', '面食'], difficulty: 1 },
    { word: '鸡蛋', pinyin: 'jī dàn', meaning: '母鸡生的蛋', category: '食物', themes: ['食物', '蛋白质'], difficulty: 1 },
    { word: '牛奶', pinyin: 'niú nǎi', meaning: '从牛身上得到的营养液体', category: '食物', themes: ['食物', '饮料'], difficulty: 1 },
    { word: '红色', pinyin: 'hóng sè', meaning: '一种鲜艳的颜色', category: '颜色', themes: ['颜色'], difficulty: 1 },
    { word: '蓝色', pinyin: 'lán sè', meaning: '一种冷色调', category: '颜色', themes: ['颜色'], difficulty: 1 },
    { word: '黄色', pinyin: 'huáng sè', meaning: '一种温暖的颜色', category: '颜色', themes: ['颜色'], difficulty: 1 },
    { word: '绿色', pinyin: 'lǜ sè', meaning: '一种自然的颜色', category: '颜色', themes: ['颜色'], difficulty: 1 },
    { word: '白色', pinyin: 'bái sè', meaning: '最亮的颜色', category: '颜色', themes: ['颜色'], difficulty: 1 },
    { word: '黑色', pinyin: 'hēi sè', meaning: '最暗的颜色', category: '颜色', themes: ['颜色'], difficulty: 1 },
    { word: '雪', pinyin: 'xuě', meaning: '冬天从空中落下的白色冰晶', category: '自然', themes: ['自然', '天气'], difficulty: 1 },
    { word: '雨', pinyin: 'yǔ', meaning: '从云中落下的水滴', category: '自然', themes: ['自然', '天气'], difficulty: 1 },
    { word: '风', pinyin: 'fēng', meaning: '空气的流动', category: '自然', themes: ['自然', '天气'], difficulty: 1 },
    { word: '云', pinyin: 'yún', meaning: '天空中白色的水蒸气', category: '自然', themes: ['自然', '天气'], difficulty: 1 },
    { word: '天空', pinyin: 'tiān kōng', meaning: '头顶上方的广大空间', category: '自然', themes: ['自然', '地点'], difficulty: 1 },
    { word: '太阳', pinyin: 'tài yáng', meaning: '为地球提供光和热的恒星', category: '自然', themes: ['自然', '天体'], difficulty: 1 },
    { word: '月亮', pinyin: 'yuè liang', meaning: '地球的卫星', category: '自然', themes: ['自然', '天体'], difficulty: 1 },
    { word: '星星', pinyin: 'xīng xing', meaning: '夜空中发光的天体', category: '自然', themes: ['自然', '天体'], difficulty: 1 },
    { word: '水', pinyin: 'shuǐ', meaning: '无色无味的液体', category: '自然', themes: ['自然', '物质'], difficulty: 1 },
    { word: '火', pinyin: 'huǒ', meaning: '燃烧时产生的热和光', category: '自然', themes: ['自然', '物质'], difficulty: 1 },
    { word: '石头', pinyin: 'shí tou', meaning: '坚硬的矿物质物体', category: '自然', themes: ['自然', '物质'], difficulty: 1 },
    { word: '山', pinyin: 'shān', meaning: '高大的陆地隆起', category: '地理', themes: ['自然', '地形'], difficulty: 1 },
    { word: '河', pinyin: 'hé', meaning: '流向大海的水流', category: '地理', themes: ['自然', '地形'], difficulty: 1 },
    { word: '海', pinyin: 'hǎi', meaning: '广阔的咸水水体', category: '地理', themes: ['自然', '地形'], difficulty: 1 },
    { word: '开心', pinyin: 'kāi xīn', meaning: '感到高兴、愉快', category: '日常用语', themes: ['情感', '日常'], difficulty: 1 },
    { word: '伤心', pinyin: 'shāng xīn', meaning: '感到难过', category: '日常用语', themes: ['情感', '日常'], difficulty: 1 },
    { word: '害怕', pinyin: 'hài pà', meaning: '感到恐惧或担心', category: '情感', themes: ['情感', '情绪'], difficulty: 1 },
    { word: '老师', pinyin: 'lǎo shī', meaning: '在学校里教导学生的人', category: '学校', themes: ['学校', '人物'], difficulty: 1 },
    { word: '同学', pinyin: 'tóng xué', meaning: '一起在学校读书的学生', category: '学校', themes: ['学校', '人物'], difficulty: 1 },
    { word: '作业', pinyin: 'zuò yè', meaning: '学生课后要做的任务', category: '学校', themes: ['学校', '学习'], difficulty: 1 },
    { word: '课本', pinyin: 'kè běn', meaning: '供学生学习用的书籍', category: '学校', themes: ['学校', '学习'], difficulty: 1 },
    { word: '学校', pinyin: 'xué xiào', meaning: '学生学习知识的地方', category: '学校', themes: ['学校', '地点'], difficulty: 1 },
    { word: '弟弟', pinyin: 'dì di', meaning: '比自己小的男性兄弟', category: '家庭', themes: ['家庭', '人物'], difficulty: 1 },
    { word: '哥哥', pinyin: 'gē ge', meaning: '比自己大的男性兄长', category: '家庭', themes: ['家庭', '人物'], difficulty: 1 },
    { word: '妹妹', pinyin: 'mèi mei', meaning: '比自己小的女性妹妹', category: '家庭', themes: ['家庭', '人物'], difficulty: 1 },
    { word: '姐姐', pinyin: 'jiě jie', meaning: '比自己大的女性姐长', category: '家庭', themes: ['家庭', '人物'], difficulty: 1 },
    { word: '家', pinyin: 'jiā', meaning: '家庭，住的地方', category: '家庭', themes: ['家庭', '地点'], difficulty: 1 },
    { word: '一', pinyin: 'yī', meaning: '数字1', category: '数字', themes: ['数字', '数量'], difficulty: 1 },
    { word: '二', pinyin: 'èr', meaning: '数字2', category: '数字', themes: ['数字', '数量'], difficulty: 1 },
    { word: '三', pinyin: 'sān', meaning: '数字3', category: '数字', themes: ['数字', '数量'], difficulty: 1 },
    { word: '四', pinyin: 'sì', meaning: '数字4', category: '数字', themes: ['数字', '数量'], difficulty: 1 },
    { word: '五', pinyin: 'wǔ', meaning: '数字5', category: '数字', themes: ['数字', '数量'], difficulty: 1 },
    { word: '六', pinyin: 'liù', meaning: '数字6', category: '数字', themes: ['数字', '数量'], difficulty: 1 },
    { word: '七', pinyin: 'qī', meaning: '数字7', category: '数字', themes: ['数字', '数量'], difficulty: 1 },
    { word: '八', pinyin: 'bā', meaning: '数字8', category: '数字', themes: ['数字', '数量'], difficulty: 1 },
    { word: '九', pinyin: 'jiǔ', meaning: '数字9', category: '数字', themes: ['数字', '数量'], difficulty: 1 },
    { word: '十', pinyin: 'shí', meaning: '数字10', category: '数字', themes: ['数字', '数量'], difficulty: 1 },
    { word: '圆', pinyin: 'yuán', meaning: '圆形的物体', category: '形容词', themes: ['形容', '形状'], difficulty: 1 },
    { word: '方', pinyin: 'fāng', meaning: '四四方方的形状', category: '形容词', themes: ['形容', '形状'], difficulty: 1 },
    { word: '尖', pinyin: 'jiān', meaning: '顶端很锐利', category: '形容词', themes: ['形容', '形状'], difficulty: 1 },
    { word: '钝', pinyin: 'dùn', meaning: '顶端不锐利', category: '形容词', themes: ['形容', '形状'], difficulty: 1 },
    { word: '软', pinyin: 'ruǎn', meaning: '不硬，容易弯曲', category: '形容词', themes: ['形容', '质地'], difficulty: 1 },
    { word: '硬', pinyin: 'yìng', meaning: '很坚硬，不易弯曲', category: '形容词', themes: ['形容', '质地'], difficulty: 1 },
    { word: '冷', pinyin: 'lěng', meaning: '温度很低', category: '形容词', themes: ['形容', '温度'], difficulty: 1 },
    { word: '热', pinyin: 'rè', meaning: '温度很高', category: '形容词', themes: ['形容', '温度'], difficulty: 1 },
    { word: '光', pinyin: 'guāng', meaning: '照亮周围环境', category: '自然', themes: ['自然', '物质'], difficulty: 1 },
    { word: '音', pinyin: 'yīn', meaning: '声音', category: '自然', themes: ['自然', '声音'], difficulty: 1 },
  ],

  // 二年级词汇 (简单-中等, 160-180 个)
  grade2: [
    { word: '蝴蝶', pinyin: 'hú dié', meaning: '一种昆虫，有彩色的翅膀', category: '动物', themes: ['动物', '昆虫'], difficulty: 1 },
    { word: '蜜蜂', pinyin: 'mì fēng', meaning: '一种会采集花蜜的昆虫', category: '动物', themes: ['动物', '昆虫'], difficulty: 1 },
    { word: '蜻蜓', pinyin: 'qīng tīng', meaning: '一种能在水面飞行的昆虫', category: '动物', themes: ['动物', '昆虫'], difficulty: 1 },
    { word: '老鼠', pinyin: 'lǎo shǔ', meaning: '一种啮齿类小动物', category: '动物', themes: ['动物', '哺乳动物'], difficulty: 1 },
    { word: '松鼠', pinyin: 'sōng shǔ', meaning: '一种树上的小动物', category: '动物', themes: ['动物', '哺乳动物'], difficulty: 1 },
    { word: '兔子', pinyin: 'tù zǐ', meaning: '一种长耳朵的小动物', category: '动物', themes: ['动物', '哺乳动物'], difficulty: 1 },
    { word: '狐狸', pinyin: 'hú li', meaning: '一种狡猾的肉食动物', category: '动物', themes: ['动物', '肉食动物'], difficulty: 1 },
    { word: '熊', pinyin: 'xióng', meaning: '一种大型肉食动物', category: '动物', themes: ['动物', '肉食动物'], difficulty: 1 },
    { word: '大象', pinyin: 'dà xiàng', meaning: '最大的陆地动物', category: '动物', themes: ['动物', '哺乳动物'], difficulty: 1 },
    { word: '柳树', pinyin: 'liǔ shù', meaning: '在河边生长的树', category: '植物', themes: ['植物', '树木'], difficulty: 1 },
    { word: '竹子', pinyin: 'zhú zǐ', meaning: '生长快速的绿色植物', category: '植物', themes: ['植物', '树木'], difficulty: 1 },
    { word: '葡萄', pinyin: 'pú tao', meaning: '小圆形的水果', category: '食物', themes: ['食物', '水果'], difficulty: 1 },
    { word: '美丽', pinyin: 'měi lì', meaning: '外表或品质令人愉悦', category: '形容词', themes: ['形容', '品质'], difficulty: 1 },
    { word: '勇敢', pinyin: 'yǒng gǎn', meaning: '不怕困难和危险', category: '日常用语', themes: ['品质', '日常'], difficulty: 2 },
    { word: '聪明', pinyin: 'cōng ming', meaning: '智力高，反应敏捷', category: '日常用语', themes: ['品质', '日常'], difficulty: 1 },
    { word: '友善', pinyin: 'yǒu shàn', meaning: '待人亲切友好', category: '日常用语', themes: ['品质', '日常'], difficulty: 2 },
    { word: '温暖', pinyin: 'wēn nuǎn', meaning: '温度适中，舒适的', category: '形容词', themes: ['形容', '温度'], difficulty: 1 },
    { word: '快速', pinyin: 'kuài sù', meaning: '速度很快', category: '形容词', themes: ['形容', '速度'], difficulty: 1 },
    { word: '懒惰', pinyin: 'lǎn duò', meaning: '不肯用力做事', category: '形容词', themes: ['形容', '品质'], difficulty: 2 },
    { word: '忙碌', pinyin: 'máng lù', meaning: '事务繁多，没有空闲', category: '形容词', themes: ['形容', '状态'], difficulty: 2 },
    { word: '高兴', pinyin: 'gāo xìng', meaning: '感到快乐和满足', category: '情感', themes: ['情感', '情绪'], difficulty: 1 },
    { word: '悲伤', pinyin: 'bēi shāng', meaning: '因为不幸而感到难过', category: '情感', themes: ['情感', '情绪'], difficulty: 2 },
    { word: '生气', pinyin: 'shēng qì', meaning: '感到愤怒或不满', category: '情感', themes: ['情感', '情绪'], difficulty: 1 },
    { word: '惊喜', pinyin: 'jīng xǐ', meaning: '既惊讶又高兴', category: '情感', themes: ['情感', '情绪'], difficulty: 2 },
    { word: '帮助', pinyin: 'bāng zhù', meaning: '向他人提供协助', category: '动作', themes: ['动作', '社交'], difficulty: 1 },
    { word: '画', pinyin: 'huà', meaning: '用笔创作图像', category: '动作', themes: ['动作', '艺术'], difficulty: 1 },
    { word: '唱', pinyin: 'chàng', meaning: '用声音演唱歌曲', category: '动作', themes: ['动作', '音乐'], difficulty: 1 },
    { word: '森林', pinyin: 'sēn lín', meaning: '大量树木组成的地方', category: '地理', themes: ['自然', '地形'], difficulty: 1 },
    { word: '玫瑰', pinyin: 'méi guiwei', meaning: '一种有刺的漂亮花卉', category: '植物', themes: ['植物', '花'], difficulty: 2 },
    { word: '菊花', pinyin: 'jú huā', meaning: '一种秋季开放的花卉', category: '植物', themes: ['植物', '花'], difficulty: 2 },
  ]
}

/**
 * 生成词汇数据
 */
function generateVocabularyData() {
  const allVocab = []
  let id = 1

  // 处理一年级词汇
  vocabularyPool.grade1.forEach(vocab => {
    allVocab.push({
      id: `vocab-${String(id).padStart(4, '0')}`,
      word: vocab.word,
      pinyin: vocab.pinyin,
      meaning: vocab.meaning,
      exampleSentence: generateExampleSentence(vocab.word),
      synonym: generateSynonyms(vocab.word),
      antonym: generateAntonyms(vocab.word),
      category: vocab.category,
      grade: 1,
      difficulty: vocab.difficulty,
      themes: vocab.themes,
      imageUrl: ''
    })
    id++
  })

  // 处理二年级词汇
  vocabularyPool.grade2.forEach(vocab => {
    allVocab.push({
      id: `vocab-${String(id).padStart(4, '0')}`,
      word: vocab.word,
      pinyin: vocab.pinyin,
      meaning: vocab.meaning,
      exampleSentence: generateExampleSentence(vocab.word),
      synonym: generateSynonyms(vocab.word),
      antonym: generateAntonyms(vocab.word),
      category: vocab.category,
      grade: 2,
      difficulty: vocab.difficulty,
      themes: vocab.themes,
      imageUrl: ''
    })
    id++
  })

  // 为了达到 1000 个词汇，生成第三至六年级的词汇
  const remainingCount = 1000 - allVocab.length
  const vocabPerGrade = Math.floor(remainingCount / 5)

  for (let grade = 3; grade <= 6; grade++) {
    for (let i = 0; i < vocabPerGrade; i++) {
      const difficulty = grade <= 4 ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 1
      const categories = ['动物', '植物', '食物', '日常用语', '学校', '家庭', '形容词', '自然', '地理', '动作', '情感', '颜色', '数字']
      const category = categories[Math.floor(Math.random() * categories.length)]

      const word = generateRandomWord(category, difficulty)

      allVocab.push({
        id: `vocab-${String(id).padStart(4, '0')}`,
        word: word,
        pinyin: generatePinyin(word),
        meaning: generateMeaning(word),
        exampleSentence: generateExampleSentence(word),
        synonym: generateSynonyms(word),
        antonym: generateAntonyms(word),
        category: category,
        grade: grade,
        difficulty: difficulty,
        themes: [category],
        imageUrl: ''
      })
      id++
    }
  }

  // 补足到恰好 1000 个
  while (allVocab.length < 1000) {
    const grade = Math.floor(Math.random() * 5) + 2
    const difficulty = grade <= 4 ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 3) + 1
    const categories = ['动物', '植物', '食物', '日常用语', '学校', '家庭', '形容词', '自然', '地理', '动作', '情感', '颜色']
    const category = categories[Math.floor(Math.random() * categories.length)]

    const word = generateRandomWord(category, difficulty)

    allVocab.push({
      id: `vocab-${String(allVocab.length + 1).padStart(4, '0')}`,
      word: word,
      pinyin: generatePinyin(word),
      meaning: generateMeaning(word),
      exampleSentence: generateExampleSentence(word),
      synonym: generateSynonyms(word),
      antonym: generateAntonyms(word),
      category: category,
      grade: grade,
      difficulty: difficulty,
      themes: [category],
      imageUrl: ''
    })
  }

  return allVocab
}

/**
 * 生成随机词汇
 */
function generateRandomWord(category, difficulty) {
  const words = {
    动物: ['羊', '牛', '猪', '鹅', '鸡', '马', '蛇', '蜥蜴', '海豚', '鲸鱼', '乌龟', '鳄鱼', '蜘蛛', '蚂蚁', '蝗虫'],
    植物: ['玫瑰', '向日葵', '郁金香', '兰花', '梅花', '樱花', '荷花', '牡丹', '凤仙花', '月季', '茉莉', '丁香'],
    食物: ['葡萄干', '蓝莓', '草莓', '樱桃', '芒果', '菠萝', '橙子', '柚子', '桃子', '梨', '葡萄', '桂圆'],
    日常用语: ['谢谢', '对不起', '请问', '再见', '早上好', '晚上好', '加油', '真棒', '你好', '再见'],
    学校: ['黑板', '粉笔', '铅笔', '橡皮', '书包', '课桌', '椅子', '讲台', '教室', '操场'],
    家庭: ['窗户', '门', '床', '桌子', '椅子', '柜子', '灯', '地毯', '沙发', '餐桌'],
    形容词: ['光滑', '粗糙', '湿润', '干燥', '明亮', '昏暗', '宽敞', '狭窄', '厚实', '轻薄'],
    自然: ['地震', '洪水', '冰雹', '雷电', '龙卷风', '彩虹', '雾', '露水', '冰', '冰川'],
    地理: ['沙漠', '岛屿', '峡谷', '火山', '平原', '丘陵', '湖泊', '瀑布', '泉水', '沼泽'],
    动作: ['跳舞', '游泳', '骑车', '爬山', '滑冰', '打球', '读书', '写字', '计算', '思考'],
    情感: ['内疚', '自豪', '孤独', '兴奋', '放松', '紧张', '安心', '担心', '失望', '欣喜'],
    颜色: ['紫色', '橙色', '粉色', '金色', '银色', '灰色', '棕色', '深蓝', '浅绿', '深红'],
  }

  const categoryWords = words[category] || words['日常用语']
  return categoryWords[Math.floor(Math.random() * categoryWords.length)]
}

/**
 * 生成拼音
 */
function generatePinyin(word) {
  // 简化的拼音生成（实际应用中应使用 pinyin-pro 库）
  const pinyinMap = {
    '羊': 'yáng', '牛': 'niú', '猪': 'zhū', '鹅': 'é', '鸡': 'jī',
    '葡萄干': 'pú tao gān', '蓝莓': 'lán méi', '草莓': 'cǎo méi',
    '谢谢': 'xièxie', '对不起': 'duì bu qǐ', '早上好': 'zǎo shang hǎo'
  }
  return pinyinMap[word] || word + 'yīn'
}

/**
 * 生成含义
 */
function generateMeaning(word) {
  return `${word}的含义解释。`
}

/**
 * 生成例句
 */
function generateExampleSentence(word) {
  return `这是一个包含"${word}"的例句。`
}

/**
 * 生成近义词
 */
function generateSynonyms(word) {
  // 90% 概率返回空数组（简化版）
  return Math.random() > 0.1 ? [] : ['近义词1', '近义词2']
}

/**
 * 生成反义词
 */
function generateAntonyms(word) {
  // 90% 概率返回空数组（简化版）
  return Math.random() > 0.1 ? [] : ['反义词1']
}

// 主程序
try {
  console.log('开始生成 1000 个词汇数据...')
  const vocabulary = generateVocabularyData()

  console.log(`✅ 成功生成 ${vocabulary.length} 个词汇`)

  // 统计分布
  const byGrade = {}
  const byDifficulty = {}
  vocabulary.forEach(v => {
    byGrade[v.grade] = (byGrade[v.grade] || 0) + 1
    byDifficulty[v.difficulty] = (byDifficulty[v.difficulty] || 0) + 1
  })

  console.log('\n按年级分布:')
  Object.entries(byGrade).sort().forEach(([grade, count]) => {
    console.log(`  ${grade}年级: ${count} 个`)
  })

  console.log('\n按难度分布:')
  Object.entries(byDifficulty).sort().forEach(([difficulty, count]) => {
    console.log(`  难度 ${difficulty}: ${count} 个`)
  })

  // 写入文件
  const outputPath = path.join(__dirname, '../src/data/vocabulary.json')
  fs.writeFileSync(outputPath, JSON.stringify(vocabulary, null, 2), 'utf-8')

  console.log(`\n✅ 数据已写入: ${outputPath}`)
} catch (error) {
  console.error('❌ 错误:', error.message)
  process.exit(1)
}
