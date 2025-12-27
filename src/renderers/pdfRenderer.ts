/**
 * PDF渲染器 - 基于文档模型生成A4尺寸的PDF
 * 使用html2pdf.js将文档模型渲染为PDF
 */

import html2pdf from 'html2pdf.js';
import type { ResumeDocument, RenderOptions } from '../types/document';
import { resumeStyles } from '../types/styles';

/**
 * PDF导出选项
 */
export interface PDFExportOptions extends RenderOptions {
  /** 文件名 */
  filename?: string;
  /** 页边距 (mm) */
  margin?: number;
  /** 是否包含页码 */
  includePageNumbers?: boolean;
  /** PDF质量 (0-1) */
  quality?: number;
}

/**
 * 生成用于PDF导出的HTML容器
 * 这个容器会被转换为PDF,所以需要严格按照A4尺寸设置
 */
function createPDFContainer(resumeDoc: ResumeDocument, options: PDFExportOptions): HTMLDivElement {
  const style = resumeStyles[options.style || 'modern'];

  // A4尺寸 (mm)
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;

  // 创建容器元素
  const container = window.document.createElement('div');
  container.style.width = `${A4_WIDTH_MM}mm`;
  container.style.minHeight = `${A4_HEIGHT_MM}mm`;
  container.style.padding = `${options.margin || 12}mm`; // 默认12mm边距
  container.style.backgroundColor = style.colors.background;
  container.style.color = style.colors.text;
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.6';

  // 构建HTML内容
  container.innerHTML = generatePDFHTML(resumeDoc, options, style);

  return container;
}

/**
 * 生成PDF HTML内容
 */
function generatePDFHTML(
  resumeDoc: ResumeDocument,
  options: PDFExportOptions,
  style: typeof resumeStyles[keyof typeof resumeStyles]
): string {
  let html = '';

  // 渲染所有块
  resumeDoc.blocks.forEach((block) => {
    html += renderBlockToHTML(block, options, style);
  });

  return html;
}

/**
 * 渲染单个块为HTML字符串
 */
function renderBlockToHTML(
  block: any,
  options: PDFExportOptions,
  style: typeof resumeStyles[keyof typeof resumeStyles]
): string {
  switch (block.type) {
    case 'header':
      return renderHeaderBlock(block, options, style);
    case 'section':
      return renderSectionBlock(block, options, style);
    case 'list':
      return renderListBlock(block, options, style);
    default:
      return '';
  }
}

/**
 * 渲染头部块
 */
function renderHeaderBlock(
  block: any,
  options: PDFExportOptions,
  style: typeof resumeStyles[keyof typeof resumeStyles]
): string {
  let html = '<div style="margin-bottom: 32px;">';

  // 头像 + 基本信息
  html += '<div style="display: flex; align-items: start; gap: 16px; margin-bottom: 24px;">';

  // 头像
  if (options.includeAvatar && block.avatar) {
    html += `<img src="${block.avatar}" alt="头像" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid ${style.colors.accent};" />`;
  }

  html += '<div style="flex: 1;">';

  // 姓名
  html += `<h1 style="font-size: 24px; font-weight: bold; color: ${style.colors.primary}; margin: 0 0 8px 0;">${block.name || '姓名'}</h1>`;

  // 元数据(联系方式)
  html += '<div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 14px; color: ' + style.colors.secondary + ';">';
  block.metadata.forEach((meta: any) => {
    const icon = getMetadataIcon(meta.label);
    html += `<span style="display: flex; align-items: center; gap: 4px;">${icon}${meta.value}</span>`;
  });
  html += '</div></div></div>';

  // 自定义链接
  if (block.links && block.links.length > 0) {
    html += '<div style="margin-bottom: 16px; display: flex; flex-wrap: wrap; gap: 12px;">';
    block.links.forEach((link: any) => {
      if (link.url) {
        html += `<a href="${link.url}" style="font-size: 14px; color: ${style.colors.primary}; text-decoration: none; display: flex; align-items: center; gap: 4px;">🔗 ${link.text}</a>`;
      } else {
        html += `<span style="font-size: 14px; color: ${style.colors.secondary};">${link.text}</span>`;
      }
    });
    html += '</div>';
  }

  // 求职意向
  if (block.jobIntention) {
    html += `<div style="margin-bottom: 16px; padding: 16px; background-color: ${style.colors.accent}; border-radius: 8px;">`;
    html += '<div style="display: flex; gap: 24px;">';
    if (block.jobIntention.position) {
      html += `<div><span style="font-size: 14px; color: ${style.colors.secondary};">求职职位:</span><span style="margin-left: 8px; font-weight: bold;">${block.jobIntention.position}</span></div>`;
    }
    if (block.jobIntention.salary) {
      html += `<div><span style="font-size: 14px; color: ${style.colors.secondary};">期望薪资:</span><span style="margin-left: 8px; font-weight: bold;">${block.jobIntention.salary}</span></div>`;
    }
    html += '</div></div>';
  }

  // 分隔线
  html += `<div style="border-bottom: 1px solid ${style.colors.accent};"></div>`;
  html += '</div>';

  return html;
}

/**
 * 渲染章节块
 */
function renderSectionBlock(
  block: any,
  options: PDFExportOptions,
  style: typeof resumeStyles[keyof typeof resumeStyles]
): string {
  let html = `<div style="margin-bottom: ${style.spacing.section === 'mb-8' ? '32' : style.spacing.section === 'mb-6' ? '24' : '40'}px;">`;

  // 章节标题
  html += `<h2 style="font-size: 18px; font-weight: bold; color: ${style.colors.primary}; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">`;
  html += `<span style="width: 4px; height: 20px; background-color: ${style.colors.primary}; border-radius: 2px;"></span>`;
  html += `${block.title}</h2>`;

  // 章节内容
  if (block.displayMode === 'tag') {
    // 标签模式
    html += '<div style="display: flex; flex-wrap: wrap; gap: 8px; padding-left: 16px;">';
    block.items.forEach((item: any) => {
      const content = item.content?.plainText ? `: ${item.content.plainText}` : '';
      html += `<span style="padding: 4px 12px; background-color: ${style.colors.accent}; color: ${style.colors.text}; border-radius: 16px; font-size: 14px;">${item.title}${content}</span>`;
    });
    html += '</div>';
  } else {
    // 标准模式
    html += '<div style="display: flex; flex-direction: column; gap: 16px;">';
    block.items.forEach((item: any) => {
      html += renderSectionItem(item, options, style);
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

/**
 * 渲染章节项
 */
function renderSectionItem(
  item: any,
  options: PDFExportOptions,
  style: typeof resumeStyles[keyof typeof resumeStyles]
): string {
  let html = '<div style="padding-left: 16px;">';

  // 标题和日期
  html += '<div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 4px;">';
  html += `<h3 style="font-size: 16px; font-weight: bold; color: ${style.colors.text}; margin: 0;">${item.title}`;
  if (item.subtitle) {
    html += `<span style="font-weight: normal; margin-left: 8px;">${item.subtitle}</span>`;
  }
  html += '</h3>';

  if (item.dateRange) {
    const dateStr = formatDateRangeForPDF(item.dateRange, options.dateFormat);
    html += `<span style="font-size: 14px; color: ${style.colors.secondary}; white-space: nowrap; margin-left: 16px;">${dateStr}</span>`;
  }

  html += '</div>';

  // 位置
  if (item.location) {
    html += `<p style="font-size: 14px; color: ${style.colors.secondary}; margin: 4px 0;">📍 ${item.location}</p>`;
  }

  // 内容
  if (item.content) {
    html += `<div style="font-size: 14px; color: ${style.colors.text}; margin-top: 8px;">${item.content.html}</div>`;
  }

  html += '</div>';
  return html;
}

/**
 * 渲染列表块
 */
function renderListBlock(
  block: any,
  options: PDFExportOptions,
  style: typeof resumeStyles[keyof typeof resumeStyles]
): string {
  let html = `<div style="margin-bottom: ${style.spacing.section === 'mb-8' ? '32' : style.spacing.section === 'mb-6' ? '24' : '40'}px;">`;

  // 列表标题
  html += `<h2 style="font-size: 18px; font-weight: bold; color: ${style.colors.primary}; margin: 0 0 12px 0; display: flex; align-items: center; gap: 8px;">`;
  html += `<span style="width: 4px; height: 20px; background-color: ${style.colors.primary}; border-radius: 2px;"></span>`;
  html += `${block.title}</h2>`;

  // 列表项
  html += '<div style="display: flex; flex-wrap: wrap; gap: 8px; padding-left: 16px;">';
  block.items.forEach((item: string) => {
    html += `<span style="padding: 4px 12px; background-color: ${style.colors.accent}; color: ${style.colors.text}; border-radius: 16px; font-size: 14px;">${item}</span>`;
  });
  html += '</div>';

  html += '</div>';
  return html;
}

/**
 * 获取元数据图标
 */
function getMetadataIcon(label: string): string {
  const l = label.toLowerCase();
  if (l === '地点') return '📍';
  if (l === '电话') return '📱';
  if (l === '邮箱') return '📧';
  if (l === '微信') return '💬';
  if (l === '出生日期') return '🎂';
  return '';
}

/**
 * 格式化日期范围
 */
function formatDateRangeForPDF(
  dateRange: any,
  format: string = 'YYYY-MM'
): string {
  if (!dateRange || !dateRange.start) return '';

  const separator = format === 'YYYY-MM' ? '-' : format === 'YYYY/MM' ? '/' : '.';

  const formatDate = (dateStr: string) => {
    const [year, month] = dateStr.split('-');
    return `${year}${separator}${month}`;
  };

  const start = formatDate(dateRange.start);
  const end = dateRange.isCurrent ? '至今' : (dateRange.end ? formatDate(dateRange.end) : '');

  return `${start} - ${end}`;
}

/**
 * 导出为PDF
 */
export async function exportToPDF(resumeDoc: ResumeDocument, options: PDFExportOptions = {}): Promise<void> {
  const {
    filename = 'resume.pdf',
    margin = 12,
    quality = 0.98,
    style = 'modern',
    ...renderOptions
  } = options;

  // 创建PDF容器
  const container = createPDFContainer(resumeDoc, options);

  // 获取样式配置
  const styleConfig = resumeStyles[style];

  // A4尺寸 (mm)
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;

  // 配置PDF选项
  const pdfOptions = {
    margin: margin,
    filename: filename,
    image: { type: 'jpeg', quality: quality },
    html2canvas: {
      scale: 2, // 清晰度
      useCORS: true,
      letterRendering: true,
      logging: false,
      backgroundColor: styleConfig.colors.background,
      scrollY: 0,
      scrollX: 0,
      width: Math.round(A4_WIDTH_MM * 3.78), // 96DPI: 1mm ≈ 3.78px
      windowWidth: Math.round(A4_WIDTH_MM * 3.78)
    },
    jsPDF: {
      unit: 'mm' as const,
      format: 'a4' as const,
      orientation: 'portrait' as const,
      compress: true
    },
    pagebreak: { mode: 'avoid-all' }
  };

  try {
    // 生成并下载PDF
    await html2pdf().set(pdfOptions).from(container).save();
  } catch (error) {
    console.error('PDF导出失败:', error);
    throw error;
  }
}
