export type ResumeStyle = 'modern' | 'professional';

export interface StyleConfig {
  id: ResumeStyle;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  spacing: {
    section: string;
    item: string;
  };
}

export const resumeStyles: Record<ResumeStyle, StyleConfig> = {
  modern: {
    id: 'modern',
    name: '现代风格',
    description: '简洁现代，单栏布局',
    preview: '🎨',
    colors: {
      primary: '#3B82F6',
      secondary: '#60A5FA',
      text: '#1F2937',
      background: '#FFFFFF',
      accent: '#DBEAFE'
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal'
    },
    spacing: {
      section: 'mb-8',
      item: 'mb-4'
    }
  },
  professional: {
    id: 'professional',
    name: '专业风格',
    description: '专业大气，双栏布局',
    preview: '💼',
    colors: {
      primary: '#0F172A',
      secondary: '#334155',
      text: '#1E293B',
      background: '#FFFFFF',
      accent: '#E2E8F0'
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal'
    },
    spacing: {
      section: 'mb-7',
      item: 'mb-4'
    }
  }
};
