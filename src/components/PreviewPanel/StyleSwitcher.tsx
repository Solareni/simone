import { useState } from 'react';
import { useStyle } from '../../context/StyleContext';
import { resumeStyles } from '../../types/styles';
import type { ResumeStyle } from '../../types/styles';

type ExportStatus = 'idle' | 'exporting-pdf' | 'exporting-png';

interface StyleSwitcherProps {
  onExportPDF: () => void;
  onExportPNG: () => void;
  exportStatus?: ExportStatus;
}

export default function StyleSwitcher({ onExportPDF, onExportPNG, exportStatus = 'idle' }: StyleSwitcherProps) {
  const { currentStyle, setStyle } = useStyle();
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const isExporting = exportStatus !== 'idle';
  const isExportingPDF = exportStatus === 'exporting-pdf';
  const isExportingPNG = exportStatus === 'exporting-png';

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
                  if (!isExporting) {
                    onExportPDF();
                    setIsExportMenuOpen(false);
                  }
                }}
                disabled={isExporting}
                className={`w-full px-4 py-3 text-left transition-colors flex items-center gap-3 text-sm ${
                  isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                {isExportingPDF ? (
                  <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )}
                <div>
                  <div className={`font-medium ${isExportingPDF ? 'text-blue-600' : 'text-gray-900'}`}>
                    {isExportingPDF ? '导出中...' : 'PDF'}
                  </div>
                  <div className="text-xs text-gray-500">导出为 PDF 文件</div>
                </div>
              </button>
              <button
                onClick={() => {
                  if (!isExporting) {
                    onExportPNG();
                    setIsExportMenuOpen(false);
                  }
                }}
                disabled={isExporting}
                className={`w-full px-4 py-3 text-left transition-colors flex items-center gap-3 text-sm border-t ${
                  isExporting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                {isExportingPNG ? (
                  <svg className="w-5 h-5 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                <div>
                  <div className={`font-medium ${isExportingPNG ? 'text-blue-600' : 'text-gray-900'}`}>
                    {isExportingPNG ? '导出中...' : 'PNG'}
                  </div>
                  <div className="text-xs text-gray-500">导出为 PNG 图片</div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
