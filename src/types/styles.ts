export type ResumeStyle = 'modern' | 'classic' | 'minimal' | 'professional';

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
    description: '简洁现代，适合科技行业',
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
  classic: {
    id: 'classic',
    name: '经典风格',
    description: '传统正式，适合传统行业',
    preview: '📄',
    colors: {
      primary: '#1F2937',
      secondary: '#4B5563',
      text: '#374151',
      background: '#FFFFFF',
      accent: '#F3F4F6'
    },
    fonts: {
      heading: 'font-bold',
      body: 'font-normal'
    },
    spacing: {
      section: 'mb-6',
      item: 'mb-3'
    }
  },
  minimal: {
    id: 'minimal',
    name: '极简风格',
    description: '极简设计，突出内容',
    preview: '⚪',
    colors: {
      primary: '#000000',
      secondary: '#6B7280',
      text: '#374151',
      background: '#FFFFFF',
      accent: '#F9FAFB'
    },
    fonts: {
      heading: 'font-semibold',
      body: 'font-light'
    },
    spacing: {
      section: 'mb-10',
      item: 'mb-5'
    }
  },
  professional: {
    id: 'professional',
    name: '专业风格',
    description: '专业大气，适合管理岗位',
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
