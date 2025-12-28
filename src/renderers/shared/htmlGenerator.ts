/**
 * 共享HTML生成器 - 为预览和PDF导出提供统一的HTML生成逻辑
 * 使用纯字符串拼接生成HTML，确保预览和PDF输出完全一致
 */

import DOMPurify from 'dompurify';
import type {
	ResumeDocument,
	DocumentBlock,
	HeaderBlock,
	SectionBlock,
	ListBlock,
	SectionItem,
	RenderOptions,
} from "../../types/document";
import { resumeStyles } from "../../types/styles";
import type { StyleConfig } from "../../types/styles";
import { formatDateRange } from "../../utils/dateUtils";

/**
 * HTML转义工具函数
 */
function escapeHtml(text: string): string {
	if (!text) return '';
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/**
 * 生成完整文档的HTML
 */
export function generateDocumentHTML(
	document: ResumeDocument,
	options: RenderOptions = {}
): string {
	const style = resumeStyles[options.style || "modern"];
	let html = "<div>";

	document.blocks.forEach((block) => {
		html += generateBlockHTML(block, options, style);
	});

	html += "</div>";

	// 清理HTML以防止XSS攻击
	return DOMPurify.sanitize(html, {
		ALLOWED_TAGS: [
			'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
			'strong', 'b', 'em', 'i', 'u', 'strike', 'br',
			'ul', 'ol', 'li',
			'a',
			'img'
		],
		ALLOWED_ATTR: [
			'style', 'href', 'src', 'alt', 'title'
		],
		FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
		FORBID_ATTR: ['onload', 'onclick', 'onerror', 'onmouseover']
	});
}

/**
 * 生成单个块的HTML
 */
export function generateBlockHTML(
	block: DocumentBlock,
	options: RenderOptions,
	style: StyleConfig
): string {
	switch (block.type) {
		case "header":
			return generateHeaderHTML(block, options, style);
		case "section":
			return generateSectionHTML(block, options, style);
		case "list":
			return generateListHTML(block, options, style);
		case "divider":
			return generateDividerHTML(style);
		default:
			return "";
	}
}

/**
 * 生成头部块的HTML
 */
export function generateHeaderHTML(
	block: HeaderBlock,
	options: RenderOptions,
	style: StyleConfig
): string {
	let html =
		'<div style="margin-bottom: 20px; page-break-inside: avoid;">';

	// 头像 + 基本信息
	html +=
		'<div style="display: flex; align-items: start; gap: 16px; margin-bottom: 16px; page-break-inside: avoid;">';

	// 头像
	if (options.includeAvatar && block.avatar) {
		html += `<img src="${block.avatar}" alt="头像" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid ${style.colors.accent};" />`;
	}

	html += '<div style="flex: 1;">';

	// 姓名
	html += `<h1 style="font-size: 22px; font-weight: bold; color: ${
		style.colors.primary
	}; margin: 0 0 6px 0; page-break-after: avoid;">${escapeHtml(block.name || "姓名")}</h1>`;

	// 元数据(联系方式)
	html +=
		'<div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 14px; color: ' +
		style.colors.secondary +
		';">';
	block.metadata.forEach((meta) => {
		const icon = getMetadataIcon(meta.label);
		html += `<span style="display: flex; align-items: center; gap: 4px;">${icon}${escapeHtml(meta.value)}</span>`;
	});
	html += "</div></div></div>";

	// 自定义链接
	if (block.links && block.links.length > 0) {
		html +=
			'<div style="margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 12px;">';
		block.links.forEach((link) => {
			if (link.url) {
				html += `<a href="${escapeHtml(link.url)}" style="font-size: 13px; color: ${style.colors.primary}; text-decoration: none; display: flex; align-items: center; gap: 4px;">🔗 ${escapeHtml(link.text)}</a>`;
			} else {
				html += `<span style="font-size: 13px; color: ${style.colors.secondary};">${escapeHtml(link.text)}</span>`;
			}
		});
		html += "</div>";
	}

	// 求职意向
	if (block.jobIntention) {
		html += `<div style="margin-bottom: 12px; padding: 12px; background-color: ${style.colors.accent}; border-radius: 6px; page-break-inside: avoid;">`;
		html += '<div style="display: flex; gap: 24px;">';
		if (block.jobIntention.position) {
			html += `<div><span style="font-size: 13px; color: ${style.colors.secondary};">求职职位:</span><span style="margin-left: 8px; font-weight: bold; font-size: 13px;">${escapeHtml(block.jobIntention.position)}</span></div>`;
		}
		if (block.jobIntention.salary) {
			html += `<div><span style="font-size: 13px; color: ${style.colors.secondary};">期望薪资:</span><span style="margin-left: 8px; font-weight: bold; font-size: 13px;">${escapeHtml(block.jobIntention.salary)}</span></div>`;
		}
		html += "</div></div>";
	}

	// 分隔线
	html += `<div style="border-bottom: 1px solid ${style.colors.accent};"></div>`;
	html += "</div>";

	return html;
}

/**
 * 生成章节块的HTML
 */
export function generateSectionHTML(
	block: SectionBlock,
	options: RenderOptions,
	style: StyleConfig
): string {
	if (block.items.length === 0) return "";

	const marginBottom =
		style.spacing.section === "mb-8"
			? "20"
			: style.spacing.section === "mb-6"
			? "16"
			: "24";

	let html = `<div class="section-block" style="margin-bottom: ${marginBottom}px; page-break-inside: auto;">`;

	// 章节标题
	html += `<h2 style="font-size: 16px; font-weight: bold; color: ${style.colors.primary}; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px; page-break-after: avoid; break-after: avoid;">`;
	html += `<span style="width: 4px; height: 18px; background-color: ${style.colors.primary}; border-radius: 2px;"></span>`;
	if (options.showIcons && block.icon) {
		html += `<span>${block.icon}</span>`;
	}
	html += `${escapeHtml(block.title)}</h2>`;

	// 章节内容
	if (block.displayMode === "tag") {
		// 标签模式
		html +=
			'<div style="display: flex; flex-wrap: wrap; gap: 8px; padding-left: 16px;">';
		block.items.forEach((item) => {
			const content = item.content?.plainText
				? `: ${escapeHtml(item.content.plainText)}`
				: "";
			html += `<span style="padding: 4px 12px; background-color: ${style.colors.accent}; color: ${style.colors.text}; border-radius: 16px; font-size: 14px;">${escapeHtml(item.title)}${content}</span>`;
		});
		html += "</div>";
	} else {
		// 标准模式
		html += '<div style="display: flex; flex-direction: column; gap: 12px;">';
		block.items.forEach((item) => {
			html += generateSectionItemHTML(item, options, style);
		});
		html += "</div>";
	}

	html += "</div>";
	return html;
}

/**
 * 生成章节项的HTML
 */
export function generateSectionItemHTML(
	item: SectionItem,
	options: RenderOptions,
	style: StyleConfig
): string {
	let html =
		'<div class="section-item" style="padding-left: 12px; page-break-inside: avoid; break-inside: avoid;">';

	// 标题和日期
	html +=
		'<div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 2px;">';
	html += `<h3 style="font-size: 15px; font-weight: bold; color: ${style.colors.text}; margin: 0; page-break-after: avoid; break-after: avoid;">${escapeHtml(item.title)}`;
	if (item.subtitle) {
		html += `<span style="font-weight: normal; margin-left: 8px;">${escapeHtml(item.subtitle)}</span>`;
	}
	html += "</h3>";

	if (item.dateRange) {
		const dateStr = formatDateRange(item.dateRange, options.dateFormat);
		html += `<span style="font-size: 14px; color: ${style.colors.secondary}; white-space: nowrap; margin-left: 16px;">${dateStr}</span>`;
	}

	html += "</div>";

	// 位置
	if (item.location) {
		html += `<p style="font-size: 14px; color: ${style.colors.secondary}; margin: 4px 0;">📍 ${escapeHtml(item.location)}</p>`;
	}

	// 内容
	if (item.content) {
		html += `<div style="font-size: 13px; color: ${style.colors.text}; margin-top: 4px; line-height: 1.5;">${item.content.html}</div>`;
	}

	html += "</div>";
	return html;
}

/**
 * 生成列表块的HTML
 */
export function generateListHTML(
	block: ListBlock,
	_options: RenderOptions,
	style: StyleConfig
): string {
	if (block.items.length === 0) return "";

	const marginBottom =
		style.spacing.section === "mb-8"
			? "20"
			: style.spacing.section === "mb-6"
			? "16"
			: "24";

	let html = `<div style="margin-bottom: ${marginBottom}px;">`;

	// 列表标题
	html += `<h2 style="font-size: 16px; font-weight: bold; color: ${style.colors.primary}; margin: 0 0 8px 0; display: flex; align-items: center; gap: 8px;">`;
	html += `<span style="width: 4px; height: 18px; background-color: ${style.colors.primary}; border-radius: 2px;"></span>`;
	html += `${escapeHtml(block.title)}</h2>`;

	// 列表项
	html +=
		'<div style="display: flex; flex-wrap: wrap; gap: 6px; padding-left: 12px;">';
	block.items.forEach((item) => {
		html += `<span style="padding: 3px 10px; background-color: ${style.colors.accent}; color: ${style.colors.text}; border-radius: 12px; font-size: 13px;">${escapeHtml(item)}</span>`;
	});
	html += "</div>";

	html += "</div>";
	return html;
}

/**
 * 生成分隔线的HTML
 */
export function generateDividerHTML(style: StyleConfig): string {
	return `<div style="border-bottom: 1px solid ${style.colors.accent}; margin: 16px 0;"></div>`;
}

/**
 * 获取元数据图标
 */
export function getMetadataIcon(label: string): string {
	const l = label.toLowerCase();
	if (l === "地点") return "📍";
	if (l === "电话") return "📱";
	if (l === "邮箱") return "📧";
	if (l === "微信") return "💬";
	if (l === "出生日期") return "🎂";
	return "";
}

