import type { ResumeData } from '../types/resume';
import type { ResumeStyle } from '../types/styles';
import { transformResumeDataToDocument } from '../transformers/documentTransformer';
import { exportToPDF as exportPDFDocument } from '../renderers/pdfRenderer';
import { exportToPNG as exportPNGDocument } from '../renderers/pngRenderer';

/**
 * 将简历数据导出为PDF格式
 * 使用统一的文档模型和专门的PDF渲染器
 * 基于A4尺寸标准渲染,确保输出质量
 */
export async function exportToPDF(data: ResumeData, style: ResumeStyle = 'modern', filename?: string): Promise<void> {
  // 1. 将 ResumeData 转换为统一的文档模型
  const document = transformResumeDataToDocument(data);

  // 2. 使用 PDF 渲染器导出PDF
  await exportPDFDocument(document, {
    filename: filename || `${data.title || '简历'}.pdf`,
    style: style,
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
export async function exportToPNG(data: ResumeData, style: ResumeStyle = 'modern', filename?: string): Promise<void> {
  // 1. 将 ResumeData 转换为统一的文档模型
  const document = transformResumeDataToDocument(data);

  // 2. 使用 PNG 渲染器导出PNG
  await exportPNGDocument(document, {
    filename: filename || `${data.title || '简历'}.png`,
    style: style,
    includeAvatar: true,
    showIcons: false,
    dateFormat: 'YYYY-MM',
    scale: 2, // 2倍分辨率
    quality: 1 // 最高质量
  });
}
