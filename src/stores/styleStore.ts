import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ResumeStyle } from '../types/styles';

interface StyleState {
  currentStyle: ResumeStyle;
  setStyle: (style: ResumeStyle) => void;
}

export const useStyleStore = create<StyleState>()(
  devtools(
    (set) => ({
      currentStyle: 'modern',
      setStyle: (style) => set({ currentStyle: style }),
    }),
    { name: 'StyleStore' }
  )
);
