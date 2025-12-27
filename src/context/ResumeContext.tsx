import { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { ResumeData, ResumeAction } from '../types/resume';
import { initialResumeData } from '../data/initialResume';
import { useResumeList } from './ResumeListContext';

const ResumeStateContext = createContext<{ data: ResumeData; dispatch: (action: ResumeAction) => void } | undefined>(undefined);

function resumeReducer(state: ResumeData, action: ResumeAction): ResumeData {
  switch (action.type) {
    case 'SET_DATA':
      return action.data;

    case 'UPDATE_TITLE':
      return { ...state, title: action.title };

    case 'UPDATE_BASIC_INFO':
      return {
        ...state,
        basicInfo: { ...state.basicInfo, ...action.payload },
      };

    case 'UPDATE_JOB_INTENTION':
      return {
        ...state,
        jobIntention: { ...state.jobIntention, ...action.payload },
      };

    case 'ADD_SECTION_ITEM':
      return {
        ...state,
        sections: {
          ...state.sections,
          [action.section]: [...state.sections[action.section], action.item],
        },
      };

    case 'UPDATE_SECTION_ITEM':
      return {
        ...state,
        sections: {
          ...state.sections,
          [action.section]: state.sections[action.section].map((item) =>
            item.id === action.id ? { ...item, ...action.item } : item
          ),
        },
      };

    case 'DELETE_SECTION_ITEM':
      return {
        ...state,
        sections: {
          ...state.sections,
          [action.section]: state.sections[action.section].filter((item) => item.id !== action.id),
        },
      };

    case 'REORDER_SECTION_ITEMS':
      return {
        ...state,
        sections: {
          ...state.sections,
          [action.section]: action.items,
        },
      };

    case 'ADD_HOBBY':
      return {
        ...state,
        hobbies: [...state.hobbies, action.hobby],
      };

    case 'REMOVE_HOBBY':
      return {
        ...state,
        hobbies: state.hobbies.filter((_, i) => i !== action.index),
      };

    case 'ADD_CUSTOM_LINK':
      return {
        ...state,
        customLinks: [
          ...state.customLinks,
          { ...action.link, id: Date.now().toString() },
        ],
      };

    case 'UPDATE_CUSTOM_LINK':
      return {
        ...state,
        customLinks: state.customLinks.map((link) =>
          link.id === action.id ? { ...link, ...action.link } : link
        ),
      };

    case 'DELETE_CUSTOM_LINK':
      return {
        ...state,
        customLinks: state.customLinks.filter((link) => link.id !== action.id),
      };

    case 'ADD_CUSTOM_SECTION':
      return {
        ...state,
        customSections: [
          ...state.customSections,
          { ...action.section, id: Date.now().toString() },
        ],
      };

    case 'UPDATE_CUSTOM_SECTION':
      return {
        ...state,
        customSections: state.customSections.map((section) =>
          section.id === action.id ? { ...section, ...action.section } : section
        ),
      };

    case 'DELETE_CUSTOM_SECTION':
      return {
        ...state,
        customSections: state.customSections.filter((section) => section.id !== action.id),
      };

    default:
      return state;
  }
}

export function ResumeProvider({ children, resumeId }: { children: ReactNode; resumeId: string }) {
  const { getResumeData, saveResumeData } = useResumeList();

  // 从 localStorage 加载简历数据
  const loadedData = getResumeData(resumeId) || { ...initialResumeData, id: resumeId };
  const [data, dispatch] = useReducer(resumeReducer, loadedData);

  // 使用序列化的data作为稳定的依赖项，避免无限循环
  const dataKey = useMemo(() => JSON.stringify(data), [data]);

  // 当数据变化时，保存到 localStorage
  useEffect(() => {
    if (resumeId) {
      saveResumeData(resumeId, data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey, resumeId, saveResumeData]);

  return (
    <ResumeStateContext.Provider value={{ data, dispatch }}>
      {children}
    </ResumeStateContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeStateContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
