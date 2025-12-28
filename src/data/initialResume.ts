import type { ResumeData } from '../types/resume';
import { DEFAULT_AVATAR } from '../constants';

export const initialResumeData: ResumeData = {
  title: '未命名简历',
  basicInfo: {
    avatar: DEFAULT_AVATAR,
    name: '',
    location: '',
    phone: '',
    email: '',
    birthDate: '',
    wechat: '',
  },
  jobIntention: {
    position: '',
    salary: '',
  },
  customLinks: [],
  sections: {
    work: [],
    education: [],
    skills: [],
  },
  customSections: [],
  hobbies: [],
};
