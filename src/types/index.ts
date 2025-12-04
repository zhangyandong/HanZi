// 汉字信息接口
export interface CharacterInfo {
  character: string;        // 汉字
  pinyin: string;          // 拼音（带声调）
  radical: string;         // 部首
  strokeCount: number;     // 总笔画数
  strokes: string[];       // 笔画列表
}

// 笔画类型
export type StrokeType = 
  | '横' | '竖' | '撇' | '捺' | '点'
  | '提' | '横钩' | '竖钩' | '斜钩' | '弯钩'
  | '横折' | '横折钩' | '竖折' | '撇折' | '撇点'
  | '横撇' | '竖提' | '横折弯钩' | '横折折撇' | '横折折折钩';

// 应用状态
export interface AppState {
  inputText: string;           // 用户输入
  characters: string[];        // 汉字列表
  currentChar: string | null;  // 当前查看的汉字
}

