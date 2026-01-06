import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type { ResumeData, BasicInfo, JobIntention, SectionItem, Sections, CustomLink, CustomSection } from '../types/resume';
import { initialResumeData } from '../data/initialResume';
import { useResumeListStore } from './resumeListStore';

interface ResumeState {
  data: ResumeData;
  resumeId: string | null;

  // Actions
  loadResume: (id: string) => void;
  setData: (data: ResumeData) => void;
  updateTitle: (title: string) => void;
  updateBasicInfo: (payload: Partial<BasicInfo>) => void;
  updateJobIntention: (payload: Partial<JobIntention>) => void;
  addSectionItem: (section: keyof Sections, item: SectionItem) => void;
  updateSectionItem: (section: keyof Sections, id: string, item: Partial<SectionItem>) => void;
  deleteSectionItem: (section: keyof Sections, id: string) => void;
  reorderSectionItems: (section: keyof Sections, items: SectionItem[]) => void;
  addHobby: (hobby: string) => void;
  removeHobby: (index: number) => void;
  addCustomLink: (link: Omit<CustomLink, 'id'>) => void;
  updateCustomLink: (id: string, link: Partial<CustomLink>) => void;
  deleteCustomLink: (id: string) => void;
  addCustomSection: (section: Omit<CustomSection, 'id'>) => void;
  updateCustomSection: (id: string, section: Partial<CustomSection>) => void;
  deleteCustomSection: (id: string) => void;
}

export const useResumeStore = create<ResumeState>()(
  devtools(
    subscribeWithSelector((set) => ({
      data: initialResumeData,
      resumeId: null,

      // 加载简历数据
      loadResume: (id: string) => {
        const { getResumeData } = useResumeListStore.getState();
        const loadedData = getResumeData(id) || { ...initialResumeData, id };
        set({ data: loadedData, resumeId: id });
      },

      setData: (data: ResumeData) => set({ data }),

      updateTitle: (title: string) =>
        set((state) => ({
          data: { ...state.data, title },
        })),

      updateBasicInfo: (payload: Partial<BasicInfo>) =>
        set((state) => ({
          data: {
            ...state.data,
            basicInfo: { ...state.data.basicInfo, ...payload },
          },
        })),

      updateJobIntention: (payload: Partial<JobIntention>) =>
        set((state) => ({
          data: {
            ...state.data,
            jobIntention: { ...state.data.jobIntention, ...payload },
          },
        })),

      addSectionItem: (section: keyof Sections, item: SectionItem) =>
        set((state) => ({
          data: {
            ...state.data,
            sections: {
              ...state.data.sections,
              [section]: [...state.data.sections[section], item],
            },
          },
        })),

      updateSectionItem: (section: keyof Sections, id: string, item: Partial<SectionItem>) =>
        set((state) => ({
          data: {
            ...state.data,
            sections: {
              ...state.data.sections,
              [section]: state.data.sections[section].map((sectionItem) =>
                sectionItem.id === id ? { ...sectionItem, ...item } : sectionItem
              ),
            },
          },
        })),

      deleteSectionItem: (section: keyof Sections, id: string) =>
        set((state) => ({
          data: {
            ...state.data,
            sections: {
              ...state.data.sections,
              [section]: state.data.sections[section].filter((item) => item.id !== id),
            },
          },
        })),

      reorderSectionItems: (section: keyof Sections, items: SectionItem[]) =>
        set((state) => ({
          data: {
            ...state.data,
            sections: {
              ...state.data.sections,
              [section]: items,
            },
          },
        })),

      addHobby: (hobby: string) =>
        set((state) => ({
          data: {
            ...state.data,
            hobbies: [...state.data.hobbies, hobby],
          },
        })),

      removeHobby: (index: number) =>
        set((state) => ({
          data: {
            ...state.data,
            hobbies: state.data.hobbies.filter((_, i) => i !== index),
          },
        })),

      addCustomLink: (link: Omit<CustomLink, 'id'>) =>
        set((state) => ({
          data: {
            ...state.data,
            customLinks: [
              ...state.data.customLinks,
              { ...link, id: Date.now().toString() },
            ],
          },
        })),

      updateCustomLink: (id: string, link: Partial<CustomLink>) =>
        set((state) => ({
          data: {
            ...state.data,
            customLinks: state.data.customLinks.map((customLink) =>
              customLink.id === id ? { ...customLink, ...link } : customLink
            ),
          },
        })),

      deleteCustomLink: (id: string) =>
        set((state) => ({
          data: {
            ...state.data,
            customLinks: state.data.customLinks.filter((link) => link.id !== id),
          },
        })),

      addCustomSection: (section: Omit<CustomSection, 'id'>) =>
        set((state) => ({
          data: {
            ...state.data,
            customSections: [
              ...state.data.customSections,
              { ...section, id: Date.now().toString() },
            ],
          },
        })),

      updateCustomSection: (id: string, section: Partial<CustomSection>) =>
        set((state) => ({
          data: {
            ...state.data,
            customSections: state.data.customSections.map((customSection) =>
              customSection.id === id ? { ...customSection, ...section } : customSection
            ),
          },
        })),

      deleteCustomSection: (id: string) =>
        set((state) => ({
          data: {
            ...state.data,
            customSections: state.data.customSections.filter((section) => section.id !== id),
          },
        })),
    })),
    { name: 'ResumeStore' }
  )
);

// 自动保存逻辑：监听 data 变化，保存到 localStorage
let lastSavedData = '';
useResumeStore.subscribe(
  (state) => state.data,
  (data) => {
    const { resumeId } = useResumeStore.getState();
    if (resumeId) {
      const currentDataStr = JSON.stringify(data);
      // 只在数据真正变化时保存
      if (currentDataStr !== lastSavedData) {
        const { saveResumeData } = useResumeListStore.getState();
        saveResumeData(resumeId, data);
        lastSavedData = currentDataStr;
      }
    }
  }
);
