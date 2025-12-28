import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ResumeData, ResumeListItem } from '../types/resume';
import { initialResumeData } from '../data/initialResume';
import { safeLocalStorageGet, safeLocalStorageSet, safeLocalStorageRemove, getStorageErrorMessage } from '../utils/storageUtils';
import { STORAGE_KEYS } from '../constants';

interface ResumeListContextType {
  resumes: ResumeListItem[];
  createResume: (title?: string) => string;
  deleteResume: (id: string) => void;
  getResumeData: (id: string) => ResumeData | null;
  saveResumeData: (id: string, data: ResumeData) => void;
  currentResumeId: string | null;
  setCurrentResumeId: (id: string | null) => void;
  storageError: string | null;
  clearStorageError: () => void;
}

const ResumeListContext = createContext<ResumeListContextType | undefined>(undefined);

export function ResumeListProvider({ children }: { children: ReactNode }) {
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  // 清除存储错误
  const clearStorageError = useCallback(() => {
    setStorageError(null);
  }, []);

  // 从 localStorage 加载简历列表
  useEffect(() => {
    const stored = safeLocalStorageGet(STORAGE_KEYS.RESUME_LIST);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ResumeListItem[];
        setResumes(parsed);
      } catch (e) {
        console.error('Failed to parse resume list:', e);
        setResumes([]);
      }
    }
  }, []);

  // 保存简历列表到 localStorage
  const saveResumeList = useCallback((list: ResumeListItem[]) => {
    const success = safeLocalStorageSet(STORAGE_KEYS.RESUME_LIST, JSON.stringify(list));
    if (success) {
      setResumes(list);
    } else {
      setStorageError(getStorageErrorMessage());
    }
  }, []);

  // 创建新简历
  const createResume = (title?: string): string => {
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
    const dataSaved = safeLocalStorageSet(STORAGE_KEYS.RESUME_DATA_PREFIX + id, JSON.stringify(newResumeData));
    if (!dataSaved) {
      setStorageError(getStorageErrorMessage());
      return id; // 仍然返回ID，但标记错误
    }

    // 更新简历列表
    const newList = [newResumeListItem, ...resumes];
    saveResumeList(newList);

    return id;
  };

  // 删除简历
  const deleteResume = (id: string) => {
    // 删除简历数据
    const dataRemoved = safeLocalStorageRemove(STORAGE_KEYS.RESUME_DATA_PREFIX + id);

    // 更新简历列表
    const newList = resumes.filter(r => r.id !== id);
    saveResumeList(newList);

    // 如果删除的是当前简历，清空当前简历ID
    if (currentResumeId === id) {
      setCurrentResumeId(null);
    }

    if (!dataRemoved) {
      setStorageError('删除简历数据时出现问题，但简历列表已更新');
    }
  };

  // 获取简历数据
  const getResumeData = (id: string): ResumeData | null => {
    const stored = safeLocalStorageGet(STORAGE_KEYS.RESUME_DATA_PREFIX + id);
    if (stored) {
      try {
        return JSON.parse(stored) as ResumeData;
      } catch (e) {
        console.error('Failed to parse resume data:', e);
        setStorageError('简历数据格式错误，无法加载');
        return null;
      }
    }
    return null;
  };

  // 保存简历数据
  const saveResumeData = useCallback((id: string, data: ResumeData) => {
    const now = new Date().toISOString();
    const updatedData = {
      ...data,
      id,
      updatedAt: now,
    };

    // 保存简历数据
    const success = safeLocalStorageSet(STORAGE_KEYS.RESUME_DATA_PREFIX + id, JSON.stringify(updatedData));
    if (!success) {
      setStorageError(getStorageErrorMessage());
      return;
    }

    // 更新简历列表中的标题和预览
    setResumes(prevResumes => {
      const newList = prevResumes.map(r => {
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
      return newList;
    });
  }, []);

  return (
    <ResumeListContext.Provider
      value={{
        resumes,
        createResume,
        deleteResume,
        getResumeData,
        saveResumeData,
        currentResumeId,
        setCurrentResumeId,
        storageError,
        clearStorageError,
      }}
    >
      {children}
    </ResumeListContext.Provider>
  );
}

export function useResumeList() {
  const context = useContext(ResumeListContext);
  if (!context) {
    throw new Error('useResumeList must be used within a ResumeListProvider');
  }
  return context;
}
