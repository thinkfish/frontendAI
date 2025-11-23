export enum Difficulty {
  Junior = '初级',
  Mid = '中级',
  Senior = '高级'
}

export enum Category {
  HTML_CSS = 'HTML & CSS',
  JavaScript = 'JavaScript',
  React = 'React 生态',
  Vue = 'Vue 生态',
  SystemDesign = '系统设计',
  Performance = '性能 & Web Vitals',
  Security = '网络安全',
  Network = '计算机网络'
}

export interface Question {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  shortDescription: string;
  tags: string[];
  staticAnswer: string; // 预设的静态答案
}

export interface AIExplanation {
  markdownContent: string;
}

export interface QuestionState {
  [key: string]: {
    isOpen: boolean;
    isLoading: boolean;
    explanation: string | null; // 如果不为 null，则显示 AI 的答案，否则显示 staticAnswer
    error: string | null;
  };
}