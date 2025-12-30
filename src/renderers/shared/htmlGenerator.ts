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
 * 现代风格：单栏布局（传统简历布局）
 * 专业风格：双栏布局（左侧1/4，右侧3/4）
 */
export function generateDocumentHTML(
	document: ResumeDocument,
	options: RenderOptions = {}
): string {
	const style = resumeStyles[options.style || "modern"];
	const styleId = options.style || "modern";

	// 使用自定义颜色或默认颜色
	const colors = options.customColors || style.colors;

	// 创建包含颜色的配置对象
	const styleWithColors = {
		...style,
		colors
	};

	// 专业风格使用双栏布局，现代风格使用单栏布局
	if (styleId === "professional") {
		return generateTwoColumnLayout(document, options, styleWithColors);
	} else {
		return generateSingleColumnLayout(document, options, styleWithColors);
	}
}

/**
 * 生成单栏布局（现代风格）
 */
function generateSingleColumnLayout(
	document: ResumeDocument,
	options: RenderOptions,
	style: StyleConfig
): string {
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
 * 生成双栏布局（专业风格）
 * 左侧（1/4宽度）：基本信息、求职意向、自定义内容、教育经历、专业技能、兴趣爱好
 * 右侧（3/4宽度）：工作经历
 */
function generateTwoColumnLayout(
	document: ResumeDocument,
	options: RenderOptions,
	style: StyleConfig
): string {
	// 分类块到左栏和右栏
	const leftColumnBlocks: DocumentBlock[] = [];
	const rightColumnBlocks: DocumentBlock[] = [];

	document.blocks.forEach((block) => {
		if (block.type === "section") {
			if (block.id === "work") {
				// 工作经历放入右栏
				rightColumnBlocks.push(block);
			} else {
				// 其他章节（教育、技能、自定义）放入左栏
				leftColumnBlocks.push(block);
			}
		} else if (block.type === "list") {
			// 列表块（兴趣爱好等）放入左栏
			leftColumnBlocks.push(block);
		} else {
			// header块放入左栏
			leftColumnBlocks.push(block);
		}
	});

	// 生成双栏布局HTML
	let html = '<div style="display: flex; gap: 24px; height: 100%;">';

	// 左栏（1/4宽度，约26%）
	html += '<div style="flex: 0 0 26%; display: flex; flex-direction: column;">';
	leftColumnBlocks.forEach((block) => {
		html += generateBlockHTML(block, options, style, true);
	});
	html += '</div>';

	// 右栏（3/4宽度，约74%）
	html += '<div style="flex: 1; display: flex; flex-direction: column;">';
	rightColumnBlocks.forEach((block) => {
		html += generateBlockHTML(block, options, style, false);
	});
	html += '</div>';

	html += '</div>';

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
	style: StyleConfig,
	isLeftColumn: boolean = false
): string {
	switch (block.type) {
		case "header":
			return generateHeaderHTML(block, options, style, isLeftColumn);
		case "section":
			return generateSectionHTML(block, options, style, isLeftColumn);
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
 * isLeftColumn: true=双栏左栏样式, false=单栏样式
 */
export function generateHeaderHTML(
	block: HeaderBlock,
	options: RenderOptions,
	style: StyleConfig,
	isLeftColumn: boolean = false
): string {
	if (isLeftColumn) {
		// 双栏布局的头部样式
		return generateTwoColumnHeader(block, options, style);
	} else {
		// 单栏布局的头部样式（原有样式）
		return generateSingleColumnHeader(block, options, style);
	}
}

/**
 * 单栏布局头部（现代风格）
 */
function generateSingleColumnHeader(
	block: HeaderBlock,
	options: RenderOptions,
	style: StyleConfig
): string {
	let html = '<div style="margin-bottom: 20px; page-break-inside: avoid;">';

	// 头像 + 基本信息
	html += '<div style="display: flex; align-items: start; gap: 16px; margin-bottom: 16px; page-break-inside: avoid;">';

	// 头像
	if (options.includeAvatar && block.avatar) {
		html += `<img src="${block.avatar}" alt="头像" style="width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid ${style.colors.accent};" />`;
	}

	html += '<div style="flex: 1;">';

	// 姓名
	html += `<h1 style="font-size: 22px; font-weight: bold; color: ${style.colors.primary}; margin: 0 0 6px 0; page-break-after: avoid;">${escapeHtml(block.name || "姓名")}</h1>`;

	// 元数据(联系方式)
	html += '<div style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 14px; color: ' + style.colors.secondary + ';">';
	block.metadata.forEach((meta) => {
		const icon = getMetadataIcon(meta.label);
		html += `<span style="display: flex; align-items: center; gap: 4px;">${icon}${escapeHtml(meta.value)}</span>`;
	});
	html += "</div></div></div>";

	// 自定义链接
	if (block.links && block.links.length > 0) {
		html += '<div style="margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 12px;">';
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
 * 双栏布局头部（专业风格） - 适配左侧窄栏
 */
function generateTwoColumnHeader(
	block: HeaderBlock,
	options: RenderOptions,
	style: StyleConfig
): string {
	let html = '<div style="margin-bottom: 16px; page-break-inside: avoid;">';

	// 头像 - 居中显示
	if (options.includeAvatar && block.avatar) {
		html += '<div style="text-align: center; margin-bottom: 12px;">';
		html += `<img src="${block.avatar}" alt="头像" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid ${style.colors.primary};" />`;
		html += '</div>';
	}

	// 姓名 - 居中显示
	html += `<h1 style="font-size: 20px; font-weight: bold; color: ${style.colors.primary}; margin: 0 0 12px 0; text-align: center; page-break-after: avoid;">${escapeHtml(block.name || "姓名")}</h1>`;

	// 元数据(联系方式) - 垂直排列
	if (block.metadata.length > 0) {
		html += '<div style="margin-bottom: 12px; font-size: 13px; color: ' + style.colors.secondary + ';">';
		block.metadata.forEach((meta) => {
			const icon = getMetadataIcon(meta.label);
			html += `<div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">${icon}<span>${escapeHtml(meta.value)}</span></div>`;
		});
		html += "</div>";
	}

	// 自定义链接 - 垂直排列
	if (block.links && block.links.length > 0) {
		html += '<div style="margin-bottom: 12px;">';
		block.links.forEach((link) => {
			if (link.url) {
				html += `<div style="margin-bottom: 6px;"><a href="${escapeHtml(link.url)}" style="font-size: 13px; color: ${style.colors.primary}; text-decoration: none; display: flex; align-items: center; gap: 6px;">🔗 ${escapeHtml(link.text)}</a></div>`;
			} else {
				html += `<div style="margin-bottom: 6px; font-size: 13px; color: ${style.colors.secondary};">${escapeHtml(link.text)}</div>`;
			}
		});
		html += "</div>";
	}

	// 求职意向 - 垂直排列
	if (block.jobIntention) {
		html += `<div style="margin-bottom: 12px; padding: 10px; background-color: ${style.colors.accent}; border-radius: 6px; page-break-inside: avoid;">`;
		if (block.jobIntention.position) {
			html += `<div style="margin-bottom: 6px;"><span style="font-size: 12px; color: ${style.colors.secondary};">求职职位:</span><div style="font-weight: bold; font-size: 13px; margin-top: 2px;">${escapeHtml(block.jobIntention.position)}</div></div>`;
		}
		if (block.jobIntention.salary) {
			html += `<div><span style="font-size: 12px; color: ${style.colors.secondary};">期望薪资:</span><div style="font-weight: bold; font-size: 13px; margin-top: 2px;">${escapeHtml(block.jobIntention.salary)}</div></div>`;
		}
		html += "</div>";
	}

	// 分隔线
	html += `<div style="border-bottom: 2px solid ${style.colors.primary}; margin-bottom: 12px;"></div>`;
	html += "</div>";

	return html;
}

/**
 * 生成章节块的HTML - 支持单栏和双栏
 */
export function generateSectionHTML(
	block: SectionBlock,
	options: RenderOptions,
	style: StyleConfig,
	isLeftColumn: boolean = false
): string {
	if (block.items.length === 0) return "";

	// 判断是否为双栏布局
	const isTwoColumn = isLeftColumn || block.id === "work";

	const marginBottom =
		style.spacing.section === "mb-8"
			? isTwoColumn ? "16" : "20"
			: style.spacing.section === "mb-6"
			? "12"
			: "18";

	let html = `<div class="section-block" style="margin-bottom: ${marginBottom}px; page-break-inside: auto;">`;

	// 章节标题 - 根据是否为左栏调整样式
	const titleFontSize = isLeftColumn ? "14px" : "16px";
	const indicatorWidth = isLeftColumn ? "3px" : "4px";
	const indicatorHeight = isLeftColumn ? "16px" : "18px";

	html += `<h2 style="font-size: ${titleFontSize}; font-weight: bold; color: ${style.colors.primary}; margin: 0 0 8px 0; display: flex; align-items: center; gap: 6px; page-break-after: avoid; break-after: avoid;">`;
	html += `<span style="width: ${indicatorWidth}; height: ${indicatorHeight}; background-color: ${style.colors.primary}; border-radius: 2px;"></span>`;
	if (options.showIcons && block.icon) {
		html += `<span style="font-size: 14px;">${block.icon}</span>`;
	}
	html += `${escapeHtml(block.title)}</h2>`;

	// 章节内容
	if (block.displayMode === "tag") {
		// 标签模式
		html += '<div style="display: flex; flex-wrap: wrap; gap: 8px;">';
		block.items.forEach((item) => {
			const content = item.content?.plainText
				? `: ${escapeHtml(item.content.plainText)}`
				: "";
			const tagFontSize = isLeftColumn ? "11px" : "13px";
			const tagPadding = isLeftColumn ? "3px 8px" : "4px 12px";
			html += `<span style="padding: ${tagPadding}; background-color: ${style.colors.accent}; color: ${style.colors.text}; border-radius: 16px; font-size: ${tagFontSize};">${escapeHtml(item.title)}${content}</span>`;
		});
		html += "</div>";
	} else {
		// 标准模式
		const itemGap = isLeftColumn ? "10px" : "12px";
		html += `<div style="display: flex; flex-direction: column; gap: ${itemGap};">`;
		block.items.forEach((item) => {
			html += generateSectionItemHTML(item, options, style, isLeftColumn);
		});
		html += "</div>";
	}

	html += "</div>";
	return html;
}

/**
 * 生成章节项的HTML - 适配窄栏和宽栏
 */
export function generateSectionItemHTML(
	item: SectionItem,
	options: RenderOptions,
	style: StyleConfig,
	isLeftColumn: boolean = false
): string {
	let html =
		'<div class="section-item" style="page-break-inside: avoid; break-inside: avoid;">';

	const titleFontSize = isLeftColumn ? "13px" : "15px";
	const dateFontSize = isLeftColumn ? "11px" : "14px";
	const contentFontSize = isLeftColumn ? "12px" : "13px";

	// 标题和日期
	html += '<div style="margin-bottom: 4px;">';
	html += `<h3 style="font-size: ${titleFontSize}; font-weight: bold; color: ${style.colors.text}; margin: 0 0 2px 0; page-break-after: avoid; break-after: avoid;">${escapeHtml(item.title)}`;
	if (item.subtitle) {
		html += `<span style="font-weight: normal; margin-left: 6px; font-size: ${titleFontSize};">${escapeHtml(item.subtitle)}</span>`;
	}
	html += "</h3>";

	if (item.dateRange) {
		const dateStr = formatDateRange(item.dateRange, options.dateFormat);
		html += `<div style="font-size: ${dateFontSize}; color: ${style.colors.secondary}; margin-top: 2px;">${dateStr}</div>`;
	}

	html += "</div>";

	// 位置
	if (item.location) {
		html += `<p style="font-size: ${dateFontSize}; color: ${style.colors.secondary}; margin: 2px 0;">📍 ${escapeHtml(item.location)}</p>`;
	}

	// 内容
	if (item.content) {
		html += `<div style="font-size: ${contentFontSize}; color: ${style.colors.text}; margin-top: 4px; line-height: 1.5;">${item.content.html}</div>`;
	}

	html += "</div>";
	return html;
}

/**
 * 生成列表块的HTML - 适配窄栏
 */
export function generateListHTML(
	block: ListBlock,
	_options: RenderOptions,
	style: StyleConfig
): string {
	if (block.items.length === 0) return "";

	const marginBottom = "12";

	let html = `<div style="margin-bottom: ${marginBottom}px;">`;

	// 列表标题
	html += `<h2 style="font-size: 14px; font-weight: bold; color: ${style.colors.primary}; margin: 0 0 8px 0; display: flex; align-items: center; gap: 6px;">`;
	html += `<span style="width: 3px; height: 16px; background-color: ${style.colors.primary}; border-radius: 2px;"></span>`;
	html += `${escapeHtml(block.title)}</h2>`;

	// 列表项
	html += '<div style="display: flex; flex-wrap: wrap; gap: 6px;">';
	block.items.forEach((item) => {
		html += `<span style="padding: 3px 8px; background-color: ${style.colors.accent}; color: ${style.colors.text}; border-radius: 12px; font-size: 12px;">${escapeHtml(item)}</span>`;
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

