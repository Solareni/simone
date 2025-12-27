import type { ResumeData } from '../types/resume';
import { transformResumeDataToDocument } from '../transformers/documentTransformer';
import { renderToMarkdown } from '../renderers/markdownRenderer';
import { exportToPDF as exportPDFDocument } from '../renderers/pdfRenderer';
import { exportToPNG as exportPNGDocument } from '../renderers/pngRenderer';
import { generateDocumentHTML } from '../renderers/shared/htmlGenerator';
import { resumeStyles } from '../types/styles';

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
    margin: 0, // 使用容器内边距而不是PDF margin
    quality: 0.98
  });
}

/**
 * 将简历数据导出为PNG图片格式
 * 使用统一的文档模型和专门的PNG渲染器
 * 基于A4尺寸标准渲染,高清输出
 */
export async function exportToPNG(data: ResumeData, filename?: string): Promise<void> {
  // 1. 将 ResumeData 转换为统一的文档模型
  const document = transformResumeDataToDocument(data);

  // 2. 使用 PNG 渲染器导出PNG
  await exportPNGDocument(document, {
    filename: filename || `${data.title || '简历'}.png`,
    style: 'modern', // 可以从context中获取当前样式
    includeAvatar: true,
    showIcons: false,
    dateFormat: 'YYYY-MM',
    scale: 2, // 2倍分辨率
    quality: 1 // 最高质量
  });
}

/**
 * 导出PDF渲染器生成的HTML（用于调试）
 * 导出与PDF转换时完全相同的HTML结构和样式
 */
export function exportPDFHTML(data: ResumeData, filename?: string): void {
  // 1. 将 ResumeData 转换为统一的文档模型
  const resumeDoc = transformResumeDataToDocument(data);

  // 2. 使用与PDF渲染器相同的选项
  const options = {
    style: 'modern' as const,
    includeAvatar: true,
    showIcons: false,
    dateFormat: 'YYYY-MM' as const
  };

  const style = resumeStyles[options.style];

  // 4. 创建与PDF渲染器完全相同的容器HTML
  const A4_WIDTH_MM = 210;

  const containerStyles = `
    width: ${A4_WIDTH_MM}mm;
    padding: 10mm;
    box-sizing: border-box;
    background-color: ${style.colors.background};
    color: ${style.colors.text};
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 12px;
    line-height: 1.5;
    overflow: hidden;
  `.trim();

  // 4. 生成文档HTML内容
  const contentHTML = generateDocumentHTML(resumeDoc, options);

  // 5. 构建完整的HTML文档
  const fullHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title || '简历'} - PDF预览HTML</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
    }
    .pdf-container {
      ${containerStyles}
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="pdf-container">
    ${contentHTML}
  </div>
  <script>
    console.log('这是PDF渲染器使用的HTML结构');
    console.log('容器样式:', ${JSON.stringify(containerStyles)});
  </script>
</body>
</html>`;

  // 6. 下载HTML文件
  const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${data.title || '简历'}-pdf-debug.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
