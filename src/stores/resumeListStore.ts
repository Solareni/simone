import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ResumeData, ResumeListItem } from '../types/resume';
import { initialResumeData } from '../data/initialResume';
import {
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove,
  getStorageErrorMessage
} from '../utils/storageUtils';
import { STORAGE_KEYS } from '../constants';

interface ResumeListState {
  resumes: ResumeListItem[];
  currentResumeId: string | null;
  storageError: string | null;

  // Actions
  loadResumes: () => void;
  createResume: (title?: string) => string;
  deleteResume: (id: string) => void;
  getResumeData: (id: string) => ResumeData | null;
  saveResumeData: (id: string, data: ResumeData) => void;
  setCurrentResumeId: (id: string | null) => void;
  clearStorageError: () => void;
}

export const useResumeListStore = create<ResumeListState>()(
  devtools(
    (set, get) => ({
      resumes: [],
      currentResumeId: null,
      storageError: null,

      // 从 localStorage 加载简历列表
      loadResumes: () => {
        const stored = safeLocalStorageGet(STORAGE_KEYS.RESUME_LIST);
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as ResumeListItem[];
            set({ resumes: parsed });
          } catch (e) {
            console.error('Failed to parse resume list:', e);
            set({ resumes: [] });
          }
        }
      },

      // 创建新简历
      createResume: (title?: string) => {
        const id = Date.now().toString();
        const now = new Date().toISOString();

        const newResumeListItem: ResumeListItem = {
          id,
          title: title || '未命名简历',
          createdAt: now,
          updatedAt: now,
        };

        const newResumeData: ResumeData = {
          ...initialResumeData,
          id,
          title: title || '未命名简历',
          createdAt: now,
          updatedAt: now,
        };

        // 保存简历数据
        const dataSaved = safeLocalStorageSet(
          STORAGE_KEYS.RESUME_DATA_PREFIX + id,
          JSON.stringify(newResumeData)
        );

        if (!dataSaved) {
          set({ storageError: getStorageErrorMessage() });
          return id;
        }

        // 更新简历列表
        const { resumes } = get();
        const newList = [newResumeListItem, ...resumes];
        const success = safeLocalStorageSet(STORAGE_KEYS.RESUME_LIST, JSON.stringify(newList));

        if (success) {
          set({ resumes: newList });
        } else {
          set({ storageError: getStorageErrorMessage() });
        }

        return id;
      },

      // 删除简历
      deleteResume: (id: string) => {
        const { resumes, currentResumeId } = get();

        // 删除简历数据
        const dataRemoved = safeLocalStorageRemove(STORAGE_KEYS.RESUME_DATA_PREFIX + id);

        // 更新简历列表
        const newList = resumes.filter(r => r.id !== id);
        const success = safeLocalStorageSet(STORAGE_KEYS.RESUME_LIST, JSON.stringify(newList));

        if (success) {
          set({ resumes: newList });
        } else {
          set({ storageError: getStorageErrorMessage() });
        }

        // 如果删除的是当前简历，清空当前简历ID
        if (currentResumeId === id) {
          set({ currentResumeId: null });
        }

        if (!dataRemoved) {
          set({ storageError: '删除简历数据时出现问题，但简历列表已更新' });
        }
      },

      // 获取简历数据
      getResumeData: (id: string) => {
        const stored = safeLocalStorageGet(STORAGE_KEYS.RESUME_DATA_PREFIX + id);
        if (stored) {
          try {
            return JSON.parse(stored) as ResumeData;
          } catch (e) {
            console.error('Failed to parse resume data:', e);
            set({ storageError: '简历数据格式错误，无法加载' });
            return null;
          }
        }
        return null;
      },

      // 保存简历数据
      saveResumeData: (id: string, data: ResumeData) => {
        const now = new Date().toISOString();
        const updatedData = {
          ...data,
          id,
          updatedAt: now,
        };

        // 保存简历数据
        const success = safeLocalStorageSet(
          STORAGE_KEYS.RESUME_DATA_PREFIX + id,
          JSON.stringify(updatedData)
        );

        if (!success) {
          set({ storageError: getStorageErrorMessage() });
          return;
        }

        // 更新简历列表中的标题和预览
        const { resumes } = get();
        const newList = resumes.map(r => {
          if (r.id === id) {
            return {
              ...r,
              title: data.title,
              updatedAt: now,
              preview: {
                name: data.basicInfo.name,
                position: data.jobIntention.position,
              },
            };
          }
          return r;
        });

        safeLocalStorageSet(STORAGE_KEYS.RESUME_LIST, JSON.stringify(newList));
        set({ resumes: newList });
      },

      setCurrentResumeId: (id: string | null) => set({ currentResumeId: id }),

      clearStorageError: () => set({ storageError: null }),
    }),
    { name: 'ResumeListStore' }
  )
);

// 初始化时加载数据
useResumeListStore.getState().loadResumes();
