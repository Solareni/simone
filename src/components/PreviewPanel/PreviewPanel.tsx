import { useResumeStore } from '../../stores/resumeStore';
import { useStyleStore } from '../../stores/styleStore';
import { useThemeStore } from '../../stores/themeStore';
import { resumeStyles } from '../../types/styles';
import { themes } from '../../types/theme';
import { transformResumeDataToDocument } from '../../transformers/documentTransformer';
import { DocumentRenderer } from '../../renderers/htmlRenderer';
import StyleSwitcher from './StyleSwitcher';
import { exportToPDF, exportToPNG } from '../../utils/export';
import { useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * 导出状态类型
 */
type ExportStatus = 'idle' | 'exporting-pdf' | 'exporting-png';

export default function PreviewPanel() {
  const { t } = useTranslation();
  const data = useResumeStore((state) => state.data);
  const currentStyle = useStyleStore((state) => state.currentStyle);
  const currentTheme = useThemeStore((state) => state.currentTheme);

  // 合并风格和主题：使用风格的布局和字体，但使用主题的颜色
  const style = {
    ...resumeStyles[currentStyle],
    colors: themes[currentTheme].colors
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const [exportStatus, setExportStatus] = useState<ExportStatus>('idle');
  const [exportError, setExportError] = useState<string | null>(null);

  // 转换为文档模型（使用useMemo避免重复转换）
  const document = useMemo(() => transformResumeDataToDocument(data), [data]);

  const handleExportPDF = async () => {
    setExportStatus('exporting-pdf');
    setExportError(null);
    try {
      // 传递完整的样式配置（包含主题颜色）
      await exportToPDF(data, style);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('preview.exportError');
      setExportError(`PDF ${errorMessage}`);
    } finally {
      setExportStatus('idle');
    }
  };

  const handleExportPNG = async () => {
    setExportStatus('exporting-png');
    setExportError(null);
    try {
      // 传递完整的样式配置（包含主题颜色）
      await exportToPNG(data, style);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('preview.exportError');
      setExportError(`PNG ${errorMessage}`);
    } finally {
      setExportStatus('idle');
    }
  };

  const clearExportError = () => {
    setExportError(null);
  };

  // 检查是否有任何内容
  const hasContent =
    data.basicInfo.name !== '' ||
    data.sections.work.length > 0 ||
    data.sections.education.length > 0 ||
    data.sections.skills.length > 0;

  return (
    <div className="flex flex-col h-full">
      {/* 顶部工具栏 */}
      <div className="flex justify-end mb-4">
        <StyleSwitcher
          onExportPDF={handleExportPDF}
          onExportPNG={handleExportPNG}
          exportStatus={exportStatus}
        />
      </div>

      {/* 导出错误提示 */}
      {exportError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-red-800">{t('preview.exportFailed')}</p>
              <p className="mt-1 text-sm text-red-700">{exportError}</p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={clearExportError}
                className="inline-flex text-red-400 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 预览区域 */}
      <div className="flex items-start justify-center flex-1 overflow-auto p-4">
        {/* A4 纸张效果 - 自适应高度，支持多页内容 */}
        <div
          ref={contentRef}
          data-resume-content
          className="bg-white shadow-xl rounded-lg w-[210mm] min-h-[297mm] p-6 print:shadow-none print:rounded-none"
          style={{
            color: style.colors.text,
            backgroundColor: style.colors.background
          }}
        >
          {/* 使用文档模型渲染器 */}
          <DocumentRenderer
            document={document}
            options={{
              style: currentStyle,
              includeAvatar: true,
              showIcons: false,
              dateFormat: 'YYYY-MM',
              customColors: style.colors
            }}
          />

          {/* 如果没有任何内容，显示提示 */}
          {!hasContent && (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>{t('preview.emptyPreview')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
