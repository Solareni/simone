/**
 * 日期格式化工具函数
 */

import type { DateRange } from '../types/document';

/**
 * 日期格式类型
 */
export type DateFormat = 'YYYY-MM' | 'YYYY/MM' | 'YYYY.MM';

/**
 * 格式化日期范围
 */
export function formatDateRange(
	dateRange: DateRange | undefined,
	format: DateFormat = 'YYYY-MM'
): string {
	if (!dateRange || !dateRange.start) return '';

	const separator = format === 'YYYY-MM' ? '-' : format === 'YYYY/MM' ? '/' : '.';

	const formatDate = (dateStr: string) => {
		const [year, month] = dateStr.split('-');
		return `${year}${separator}${month}`;
	};

	const start = formatDate(dateRange.start);
	const end = dateRange.isCurrent
		? '至今'
		: dateRange.end
		? formatDate(dateRange.end)
		: '';

	return `${start} - ${end}`;
}

/**
 * 验证日期字符串格式 (YYYY-MM-DD)
 */
export function isValidDateString(dateStr: string): boolean {
	if (!dateStr || typeof dateStr !== 'string') return false;

	const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
	if (!dateRegex.test(dateStr)) return false;

	const date = new Date(dateStr);
	return date instanceof Date && !isNaN(date.getTime());
}

/**
 * 格式化日期为本地化显示
 */
export function formatDateForDisplay(
	dateString: string,
	options: {
		locale?: string;
		showTime?: boolean;
	} = {}
): string {
	const { locale = 'zh-CN', showTime = true } = options;

	try {
		const date = new Date(dateString);
		if (isNaN(date.getTime())) return dateString;

		return date.toLocaleDateString(locale, {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: showTime ? '2-digit' : undefined,
			minute: showTime ? '2-digit' : undefined,
		});
	} catch {
		return dateString;
	}
}

