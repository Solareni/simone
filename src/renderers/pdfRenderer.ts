/**
 * PDF渲染器 - 基于文档模型生成A4尺寸的PDF
 * 使用html2pdf.js将文档模型渲染为PDF
 */

import html2pdf from "html2pdf.js";
import type { ResumeDocument, RenderOptions } from "../types/document";
import { resumeStyles } from "../types/styles";
import { generateDocumentHTML } from "./shared/htmlGenerator";
import { A4_WIDTH_MM, A4_SCALE_FACTOR, PDF_EXPORT_DEFAULTS } from "../constants";

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
function createPDFContainer(
	resumeDoc: ResumeDocument,
	options: PDFExportOptions
): HTMLDivElement {
	const style = resumeStyles[options.style || "modern"];

	// 创建容器元素
	const container = window.document.createElement("div");
	// 容器占满整个A4宽度
	container.style.width = `${A4_WIDTH_MM}mm`;
	// 添加内边距，让内容更紧凑且与预览一致
	container.style.padding = "10mm";
	container.style.boxSizing = "border-box";
	container.style.backgroundColor = style.colors.background;
	container.style.color = style.colors.text;
	container.style.fontFamily =
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
	container.style.fontSize = "12px";
	container.style.lineHeight = "1.5";
	// 设置overflow确保内容不会溢出
	container.style.overflow = "hidden";

	// 构建HTML内容
	container.innerHTML = generateDocumentHTML(resumeDoc, options);

	return container;
}

/**
 * 导出为PDF
 */
export async function exportToPDF(
	resumeDoc: ResumeDocument,
	options: PDFExportOptions = {}
): Promise<void> {
	const {
		filename = "resume.pdf",
		margin = PDF_EXPORT_DEFAULTS.MARGIN,
		quality = PDF_EXPORT_DEFAULTS.QUALITY,
		style = "modern",
	} = options;

	// 创建PDF容器
	const container = createPDFContainer(resumeDoc, options);

	// 获取样式配置
	const styleConfig = resumeStyles[style];

	// 配置PDF选项
	const pdfOptions = {
		margin: margin, // PDF页面边距
		filename: filename,
		image: { type: "jpeg" as const, quality: quality },
		html2canvas: {
			scale: 2, // 提高清晰度
			useCORS: true,
			letterRendering: true,
			logging: false,
			backgroundColor: styleConfig.colors.background,
			scrollY: 0,
			scrollX: 0,
			// 移除width参数,让html2canvas自动计算
			// 这样可以确保渲染宽度与实际DOM宽度匹配
			windowWidth: A4_WIDTH_MM * A4_SCALE_FACTOR, // 96DPI参考窗口宽度
		},
		jsPDF: {
			unit: "mm" as const,
			format: "a4" as const,
			orientation: "portrait" as const,
			compress: true,
		},
		// 改进分页配置 - 移除avoid-all以避免首页空白问题
		// 参考: https://github.com/eKoopmans/html2pdf.js/issues/672
		pagebreak: {
			mode: ["css", "legacy"],
			// 不使用avoid-all和avoid属性，而是完全依赖CSS的page-break控制
			before: ".page-break-before",
			after: ".page-break-after",
		},
	};

	try {
		// 生成并下载PDF
		await html2pdf().set(pdfOptions).from(container).save();
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : '未知错误';
		throw new Error(`PDF导出失败: ${errorMessage}`);
	}
}
