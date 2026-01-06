export interface BasicInfo {
  avatar: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  birthDate: string;
  wechat: string;
}

export interface JobIntention {
  position: string;  // 职位
  salary: string;    // 薪资
}

export interface SectionItem {
  id: string;
  title: string;
  subtitle?: string;
  location?: string;
  dateRange: string;
  description?: string;
  // 工作经历和教育经历使用的日期字段
  companyName?: string;
  positionName?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface CustomSection {
  id: string;
  name: string;
  items: SectionItem[];
  displayMode: 'single' | 'double' | 'tag';
}

export interface CustomLink {
  id: string;
  text: string;
  url?: string;
  type: 'link' | 'text';
}

export interface Sections {
  work: SectionItem[];
  education: SectionItem[];
  skills: SectionItem[];
}

export interface ResumeData {
  id?: string;  // 简历ID
  title: string;
  basicInfo: BasicInfo;
  jobIntention: JobIntention;
  customLinks: CustomLink[];
  sections: Sections;
  customSections: CustomSection[];
  hobbies: string[];
  createdAt?: string;  // 创建时间
  updatedAt?: string;  // 更新时间
}

// 简历列表项（用于首页展示）
export interface ResumeListItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  preview?: {
    name?: string;
    position?: string;
  };
}

export type ResumeAction =
  | { type: 'UPDATE_BASIC_INFO'; payload: Partial<BasicInfo> }
  | { type: 'UPDATE_JOB_INTENTION'; payload: Partial<JobIntention> }
  | { type: 'UPDATE_TITLE'; title: string }
  | { type: 'ADD_SECTION_ITEM'; section: keyof Sections; item: SectionItem }
  | { type: 'UPDATE_SECTION_ITEM'; section: keyof Sections; id: string; item: Partial<SectionItem> }
  | { type: 'DELETE_SECTION_ITEM'; section: keyof Sections; id: string }
  | { type: 'REORDER_SECTION_ITEMS'; section: keyof Sections; items: SectionItem[] }
  | { type: 'ADD_HOBBY'; hobby: string }
  | { type: 'REMOVE_HOBBY'; index: number }
  | { type: 'ADD_CUSTOM_LINK'; link: Omit<CustomLink, 'id'> }
  | { type: 'UPDATE_CUSTOM_LINK'; id: string; link: Partial<CustomLink> }
  | { type: 'DELETE_CUSTOM_LINK'; id: string }
  | { type: 'ADD_CUSTOM_SECTION'; section: Omit<CustomSection, 'id'> }
  | { type: 'UPDATE_CUSTOM_SECTION'; id: string; section: Partial<CustomSection> }
  | { type: 'DELETE_CUSTOM_SECTION'; id: string }
  | { type: 'SET_DATA'; data: ResumeData };
