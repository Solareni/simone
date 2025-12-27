import type { ResumeData } from '../types/resume';

export const initialResumeData: ResumeData = {
  title: '未命名简历',
  basicInfo: {
    jobTitle: '',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    name: '',
    location: '',
    phone: '',
    email: '',
    birthDate: '',
    wechat: '',
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
