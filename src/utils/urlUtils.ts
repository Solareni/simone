/**
 * URL验证和清理工具函数
 */

/**
 * 检查URL是否为有效的HTTP/HTTPS链接
 */
export function isValidHttpUrl(url: string): boolean {
	try {
		const parsedUrl = new URL(url);
		return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
	} catch {
		return false;
	}
}

/**
 * 清理和验证URL
 * 移除危险的协议（如javascript:），确保URL安全
 */
export function sanitizeUrl(url: string): string | null {
	if (!url || typeof url !== 'string') {
		return null;
	}

	const trimmedUrl = url.trim();

	// 检查是否为空
	if (!trimmedUrl) {
		return null;
	}

	// 检查是否包含危险协议
	const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'chrome:', 'about:'];
	const lowerUrl = trimmedUrl.toLowerCase();

	for (const protocol of dangerousProtocols) {
		if (lowerUrl.startsWith(protocol)) {
			return null; // 拒绝危险协议
		}
	}

	try {
		const parsedUrl = new URL(trimmedUrl);

		// 只允许http和https协议
		if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
			return null;
		}

		// 返回清理后的URL（保留查询参数和hash）
		return parsedUrl.href;
	} catch {
		return null;
	}
}

/**
 * 验证URL并返回清理后的版本，如果无效则返回null
 */
export function validateAndSanitizeUrl(url: string): string | null {
	const sanitized = sanitizeUrl(url);
	return sanitized;
}

/**
 * 检查字符串是否看起来像是一个URL（松散验证）
 */
export function isUrlLike(text: string): boolean {
	const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
	return urlPattern.test(text.trim());
}
