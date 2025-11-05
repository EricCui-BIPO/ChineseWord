// 五子棋游戏类型定义

export type CellValue = 'black' | 'white' | null

export type Player = 'black' | 'white'

export interface Position {
  row: number
  col: number
}

export interface GameState {
  board: CellValue[][]          // 棋盘状态
  currentPlayer: Player          // 当前玩家
  winner: Player | null          // 获胜方
  isGameOver: boolean            // 游戏是否结束
  lastMove: Position | null      // 最后一步的位置
  moveHistory: Position[]        // 移动历史
}

export interface GameStats {
  blackWins: number              // 黑方胜场
  whiteWins: number              // 白方胜场
  totalGames: number             // 总局数
}
