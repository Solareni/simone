import type { ResumeData } from '../types/resume';
import { transformResumeDataToDocument } from '../transformers/documentTransformer';
import { renderToMarkdown } from '../renderers/markdownRenderer';
import { exportToPDF as exportPDFDocument } from '../renderers/pdfRenderer';

/**
 * 将简历数据导出为Markdown格式
 * 使用统一的文档模型进行转换和渲染
 */
export function exportToMarkdown(data: ResumeData): string {
  // 1. 将 ResumeData 转换为统一的文档模型
  const document = transformResumeDataToDocument(data);

  // 2. 使用 Markdown 渲染器渲染文档
  const markdown = renderToMarkdown(document, {
    dateFormat: 'YYYY-MM',
    includeAvatar: false,
    showIcons: false
  });

  return markdown;
}

/**
 * 下载Markdown文件
 */
export function downloadMarkdown(markdown: string, filename: string = 'resume.md') {
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 将简历数据导出为PDF格式
 * 使用统一的文档模型和专门的PDF渲染器
 * 基于A4尺寸标准渲染,确保输出质量
 */
export async function exportToPDF(data: ResumeData, filename?: string): Promise<void> {
  // 1. 将 ResumeData 转换为统一的文档模型
  const document = transformResumeDataToDocument(data);

  // 2. 使用 PDF 渲染器导出PDF
  await exportPDFDocument(document, {
    filename: filename || `${data.title || '简历'}.pdf`,
    style: 'modern', // 可以从context中获取当前样式
    includeAvatar: true,
    showIcons: false,
    dateFormat: 'YYYY-MM',
    margin: 12, // 12mm页边距
    quality: 0.98
  });
}
