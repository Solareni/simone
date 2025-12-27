import { useResume } from '../../context/ResumeContext';
import { useStyle } from '../../context/StyleContext';
import { resumeStyles } from '../../types/styles';
import { transformResumeDataToDocument } from '../../transformers/documentTransformer';
import { DocumentRenderer } from '../../renderers/htmlRenderer';
import StyleSwitcher from './StyleSwitcher';
import { exportToMarkdown, downloadMarkdown, exportToPDF } from '../../utils/export';
import { useRef, useEffect, useState, useMemo } from 'react';
import type { ResumeDocument } from '../../types/document';

export default function PreviewPanel() {
  const { data } = useResume();
  const { currentStyle } = useStyle();
  const style = resumeStyles[currentStyle];
  const contentRef = useRef<HTMLDivElement>(null);
  const [pageBreaks, setPageBreaks] = useState<number[]>([]);

  // A4纸张高度（单位：像素，基于96DPI）
  // 297mm = 1122.52px (at 96 DPI)
  const A4_HEIGHT_PX = 1122.52;

  // 使用序列化的data作为稳定的依赖项，避免无限循环
  const dataKey = useMemo(() => JSON.stringify(data), [data]);

  // 转换为文档模型（使用useMemo避免重复转换）
  const document = useMemo(() => transformResumeDataToDocument(data), [data]);

  useEffect(() => {
    // 动态计算页面分隔线位置
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const breaks: number[] = [];

      // 计算需要几个分隔线
      const numPages = Math.ceil(contentHeight / A4_HEIGHT_PX);
      for (let i = 1; i < numPages; i++) {
        breaks.push(i * A4_HEIGHT_PX);
      }

      // 使用函数式更新，避免依赖pageBreaks
      setPageBreaks((prevBreaks) => {
        // 只在breaks真的变化时才更新（避免无限循环）
        const breaksChanged =
          breaks.length !== prevBreaks.length ||
          breaks.some((val, idx) => val !== prevBreaks[idx]);

        return breaksChanged ? breaks : prevBreaks;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKey]); // 使用序列化的dataKey而不是data对象

  const handleExportMarkdown = () => {
    const markdown = exportToMarkdown(data);
    const filename = `${data.title || '简历'}.md`;
    downloadMarkdown(markdown, filename);
  };

  const handleExportPDF = async () => {
    await exportToPDF(data);
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
          onExportMarkdown={handleExportMarkdown}
          onExportPDF={handleExportPDF}
        />
      </div>

      {/* 预览区域 */}
      <div className="flex items-start justify-center flex-1 overflow-auto">
        {/* 页面分隔线容器 */}
        <div className="relative">
          {/* 页面分隔线 - 动态计算位置 */}
          {pageBreaks.map((breakPosition, index) => (
            <div
              key={index}
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                top: `${breakPosition}px`,
                zIndex: 10
              }}
            >
              {/* 虚线 */}
              <div className="border-t-2 border-dashed border-blue-400 opacity-60" />
              {/* 页码标识 */}
              <div className="absolute -top-3 right-0 bg-blue-100 px-3 py-1 rounded-full text-xs text-blue-700 font-medium shadow-sm">
                第{index + 2}页
              </div>
            </div>
          ))}

          {/* A4 纸张效果 */}
          <div
            ref={contentRef}
            data-resume-content
            className="bg-white shadow-xl rounded-lg w-full max-w-[210mm] min-h-[297mm] p-8 lg:p-12 print:shadow-none print:rounded-none"
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
                dateFormat: 'YYYY-MM'
              }}
            />

            {/* 如果没有任何内容，显示提示 */}
            {!hasContent && (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <p>在左侧填写信息，此处将实时预览简历效果</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
