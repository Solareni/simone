import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { ResumeData, ResumeListItem } from '../types/resume';
import { initialResumeData } from '../data/initialResume';

const STORAGE_KEY = 'resume-list';
const RESUME_DATA_PREFIX = 'resume-data-';

interface ResumeListContextType {
  resumes: ResumeListItem[];
  createResume: (title?: string) => string;
  deleteResume: (id: string) => void;
  getResumeData: (id: string) => ResumeData | null;
  saveResumeData: (id: string, data: ResumeData) => void;
  currentResumeId: string | null;
  setCurrentResumeId: (id: string | null) => void;
}

const ResumeListContext = createContext<ResumeListContextType | undefined>(undefined);

export function ResumeListProvider({ children }: { children: ReactNode }) {
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);

  // 从 localStorage 加载简历列表
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setResumes(list);
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
    localStorage.setItem(RESUME_DATA_PREFIX + id, JSON.stringify(newResumeData));

    // 更新简历列表
    const newList = [newResumeListItem, ...resumes];
    saveResumeList(newList);

    return id;
  };

  // 删除简历
  const deleteResume = (id: string) => {
    // 删除简历数据
    localStorage.removeItem(RESUME_DATA_PREFIX + id);

    // 更新简历列表
    const newList = resumes.filter(r => r.id !== id);
    saveResumeList(newList);

    // 如果删除的是当前简历，清空当前简历ID
    if (currentResumeId === id) {
      setCurrentResumeId(null);
    }
  };

  // 获取简历数据
  const getResumeData = (id: string): ResumeData | null => {
    const stored = localStorage.getItem(RESUME_DATA_PREFIX + id);
    if (stored) {
      try {
        return JSON.parse(stored) as ResumeData;
      } catch (e) {
        console.error('Failed to parse resume data:', e);
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
    localStorage.setItem(RESUME_DATA_PREFIX + id, JSON.stringify(updatedData));

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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
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
