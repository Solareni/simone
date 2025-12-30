/**
 * 主题系统 - 只负责颜色配置
 */

export type ThemeId = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal';

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
    accent: string;
  };
}

export const themes: Record<ThemeId, Theme> = {
  blue: {
    id: 'blue',
    name: '蓝色主题',
    description: '专业稳重，适合商务场景',
    colors: {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      text: '#1F2937',
      background: '#FFFFFF',
      accent: '#DBEAFE'
    }
  },
  green: {
    id: 'green',
    name: '绿色主题',
    description: '清新自然，充满活力',
    colors: {
      primary: '#10B981',
      secondary: '#34D399',
      text: '#1F2937',
      background: '#FFFFFF',
      accent: '#D1FAE5'
    }
  },
  purple: {
    id: 'purple',
    name: '紫色主题',
    description: '优雅神秘，富有创意',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      text: '#1F2937',
      background: '#FFFFFF',
      accent: '#EDE9FE'
    }
  },
  orange: {
    id: 'orange',
    name: '橙色主题',
    description: '热情活力，积极向上',
    colors: {
      primary: '#F59E0B',
      secondary: '#FBBF24',
      text: '#1F2937',
      background: '#FFFFFF',
      accent: '#FEF3C7'
    }
  },
  red: {
    id: 'red',
    name: '红色主题',
    description: '热情奔放，引人注目',
    colors: {
      primary: '#EF4444',
      secondary: '#F87171',
      text: '#1F2937',
      background: '#FFFFFF',
      accent: '#FEE2E2'
    }
  },
  teal: {
    id: 'teal',
    name: '青色主题',
    description: '清新淡雅，成熟稳重',
    colors: {
      primary: '#14B8A6',
      secondary: '#2DD4BF',
      text: '#1F2937',
      background: '#FFFFFF',
      accent: '#CCFBF1'
    }
  }
};
