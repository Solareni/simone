/**
 * PNG渲染器 - 基于文档模型生成PNG图片
 * 使用html2canvas将文档模型渲染为PNG图片
 */

import html2canvas from "html2canvas";
import type { ResumeDocument, RenderOptions } from "../types/document";
import { resumeStyles } from "../types/styles";
import { generateDocumentHTML } from "./shared/htmlGenerator";

/**
 * PNG导出选项
 */
export interface PNGExportOptions extends RenderOptions {
	/** 文件名 */
	filename?: string;
	/** 图片质量 (0-1) */
	quality?: number;
	/** 缩放比例（提高分辨率） */
	scale?: number;
	/** 背景颜色 */
	backgroundColor?: string;
	/** 图片宽度（像素），默认A4宽度 */
	width?: number;
}

/**
 * 生成用于PNG导出的HTML容器
 * 这个容器会被转换为PNG，需要设置合适的尺寸
 */
function createPNGContainer(
	resumeDoc: ResumeDocument,
	options: PNGExportOptions
): HTMLDivElement {
	const style = resumeStyles[options.style || "modern"];

	// A4尺寸换算为像素（96 DPI）
	const A4_WIDTH_PX = options.width || 794; // 210mm * 96 DPI / 25.4mm

	// 创建容器元素
	const container = window.document.createElement("div");
	container.style.width = `${A4_WIDTH_PX}px`;
	container.style.padding = "40px"; // 页边距
	container.style.backgroundColor = options.backgroundColor || style.colors.background;
	container.style.color = style.colors.text;
	container.style.fontFamily =
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
	container.style.fontSize = "14px";
	container.style.lineHeight = "1.5";
	container.style.boxSizing = "border-box";

	// 构建HTML内容
	container.innerHTML = generateDocumentHTML(resumeDoc, options);

	return container;
}

/**
 * 下载canvas为PNG图片
 */
function downloadCanvasAsPNG(canvas: HTMLCanvasElement, filename: string) {
	// 将canvas转换为blob
	canvas.toBlob((blob) => {
		if (!blob) {
			throw new Error("Failed to create image blob");
		}

		// 创建下载链接
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;

		// 触发下载
		document.body.appendChild(link);
		link.click();

		// 清理
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}, "image/png");
}

/**
 * 导出为PNG图片
 */
export async function exportToPNG(
	resumeDoc: ResumeDocument,
	options: PNGExportOptions = {}
): Promise<void> {
	const {
		filename = "resume.png",
		quality = 1,
		scale = 2, // 2倍分辨率，提高清晰度
		style = "modern",
	} = options;

	// 创建PNG容器
	const container = createPNGContainer(resumeDoc, options);

	// 获取样式配置
	const styleConfig = resumeStyles[style];

	// 临时添加到DOM中（html2canvas需要元素在DOM中）
	container.style.position = "absolute";
	container.style.left = "-9999px";
	container.style.top = "0";
	document.body.appendChild(container);

	try {
		// 使用html2canvas生成canvas
		const canvas = await html2canvas(container, {
			scale: scale,
			useCORS: true,
			allowTaint: false,
			backgroundColor: options.backgroundColor || styleConfig.colors.background,
			logging: false,
			windowWidth: container.scrollWidth,
			windowHeight: container.scrollHeight,
		});

		// 下载PNG
		downloadCanvasAsPNG(canvas, filename);
	} catch (error) {
		console.error("PNG导出失败:", error);
		throw error;
	} finally {
		// 清理：从DOM中移除容器
		document.body.removeChild(container);
	}
}
