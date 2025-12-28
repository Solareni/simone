import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ResumeStyle } from '../types/styles';

interface StyleContextType {
  currentStyle: ResumeStyle;
  setStyle: (style: ResumeStyle) => void;
}

const StyleContext = createContext<StyleContextType | undefined>(undefined);

export function StyleProvider({ children }: { children: ReactNode }) {
  const [currentStyle, setCurrentStyle] = useState<ResumeStyle>('modern');

  const setStyle = (style: ResumeStyle) => {
    setCurrentStyle(style);
  };

  return (
    <StyleContext.Provider value={{ currentStyle, setStyle }}>
      {children}
    </StyleContext.Provider>
  );
}

export function useStyle() {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error('useStyle must be used within a StyleProvider');
  }
  return context;
}
