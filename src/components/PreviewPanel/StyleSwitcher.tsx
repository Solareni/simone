import { useState } from 'react';
import { useStyle } from '../../context/StyleContext';
import { resumeStyles } from '../../types/styles';
import type { ResumeStyle } from '../../types/styles';

interface StyleSwitcherProps {
  onExportMarkdown: () => void;
  onExportPDF: () => void;
  onExportPNG: () => void;
  onExportPDFHTML: () => void;
}

export default function StyleSwitcher({ onExportMarkdown, onExportPDF, onExportPNG, onExportPDFHTML }: StyleSwitcherProps) {
  const { currentStyle, setStyle } = useStyle();
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  return (
    <div className="flex gap-3 print:hidden">
      {/* 样式选择下拉菜单 */}
      <div className="relative">
        <button
          onClick={() => {
            setIsStyleMenuOpen(!isStyleMenuOpen);
            setIsExportMenuOpen(false);
          }}
          className="px-4 py-2.5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200"
        >
          <span>{resumeStyles[currentStyle].preview}</span>
          <span>{resumeStyles[currentStyle].name}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isStyleMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isStyleMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsStyleMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-20 overflow-hidden border border-gray-200">
              {(Object.keys(resumeStyles) as ResumeStyle[]).map((styleId) => {
                const style = resumeStyles[styleId];
                return (
                  <button
                    key={styleId}
                    onClick={() => {
                      setStyle(styleId);
                      setIsStyleMenuOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm ${
                      currentStyle === styleId ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                  >
                    <span className="text-xl">{style.preview}</span>
                    <div className="flex-1">
                      <div className="font-medium">{style.name}</div>
                      <div className="text-xs text-gray-500">{style.description}</div>
                    </div>
                    {currentStyle === styleId && (
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* 导出下拉菜单 */}
      <div className="relative">
        <button
          onClick={() => {
            setIsExportMenuOpen(!isExportMenuOpen);
            setIsStyleMenuOpen(false);
          }}
          className="px-4 py-2.5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm font-medium text-gray-700 border border-gray-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          导出
          <svg
            className={`w-4 h-4 transition-transform ${isExportMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExportMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsExportMenuOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 overflow-hidden border border-gray-200">
              <button
                onClick={() => {
                  onExportMarkdown();
                  setIsExportMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">Markdown</div>
                  <div className="text-xs text-gray-500">导出为 .md 文件</div>
                </div>
              </button>
              <button
                onClick={() => {
                  onExportPDF();
                  setIsExportMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm border-t"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">PDF</div>
                  <div className="text-xs text-gray-500">导出为 PDF 文件</div>
                </div>
              </button>
              <button
                onClick={() => {
                  onExportPNG();
                  setIsExportMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm border-t"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900">PNG</div>
                  <div className="text-xs text-gray-500">导出为 PNG 图片</div>
                </div>
              </button>
              <button
                onClick={() => {
                  onExportPDFHTML();
                  setIsExportMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-sm border-t"
              >
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <div>
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    PDF HTML
                    <span className="text-xs text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">调试</span>
                  </div>
                  <div className="text-xs text-gray-500">导出 PDF 的 HTML 源码</div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
