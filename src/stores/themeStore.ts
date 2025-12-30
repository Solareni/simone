/**
 * 主题状态管理
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ThemeId } from '../types/theme';

interface ThemeState {
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    (set) => ({
      currentTheme: 'blue',
      setTheme: (theme) => set({ currentTheme: theme }),
    }),
    { name: 'ThemeStore' }
  )
);
