import type { ResumeData } from '../types/resume';
import type { ResumeStyle } from '../types/styles';
import type { StyleConfig } from '../types/styles';
import { transformResumeDataToDocument } from '../transformers/documentTransformer';
import { exportToPDF as exportPDFDocument } from '../renderers/pdfRenderer';
import { exportToPNG as exportPNGDocument } from '../renderers/pngRenderer';

/**
 * 将简历数据导出为PDF格式
 * 使用统一的文档模型和专门的PDF渲染器
 * 基于A4尺寸标准渲染,确保输出质量
 */
export async function exportToPDF(
  data: ResumeData,
  styleOrConfig: ResumeStyle | StyleConfig = 'modern',
  filename?: string
): Promise<void> {
  // 1. 将 ResumeData 转换为统一的文档模型
  const document = transformResumeDataToDocument(data);

  // 2. 提取样式配置
  const style = typeof styleOrConfig === 'string'
    ? styleOrConfig
    : styleOrConfig.id;

  // 3. 使用 PDF 渲染器导出PDF
  await exportPDFDocument(document, {
    filename: filename || `${data.title || '简历'}.pdf`,
    style: style,
    includeAvatar: true,
    showIcons: false,
    dateFormat: 'YYYY-MM',
    margin: 0,
    quality: 0.98,
    // 如果传入了完整的配置（包含主题颜色），则使用自定义颜色
    customColors: typeof styleOrConfig !== 'string' ? styleOrConfig.colors : undefined
  });
}

/**
 * 将简历数据导出为PNG图片格式
 * 使用统一的文档模型和专门的PNG渲染器
 * 基于A4尺寸标准渲染,高清输出
 */
export async function exportToPNG(
  data: ResumeData,
  styleOrConfig: ResumeStyle | StyleConfig = 'modern',
  filename?: string
): Promise<void> {
  // 1. 将 ResumeData 转换为统一的文档模型
  const document = transformResumeDataToDocument(data);

  // 2. 提取样式配置
  const style = typeof styleOrConfig === 'string'
    ? styleOrConfig
    : styleOrConfig.id;

  // 3. 使用 PNG 渲染器导出PNG
  await exportPNGDocument(document, {
    filename: filename || `${data.title || '简历'}.png`,
    style: style,
    includeAvatar: true,
    showIcons: false,
    dateFormat: 'YYYY-MM',
    scale: 2,
    quality: 1,
    // 如果传入了完整的配置（包含主题颜色），则使用自定义颜色
    customColors: typeof styleOrConfig !== 'string' ? styleOrConfig.colors : undefined
  });
}
