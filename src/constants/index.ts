/**
 * 应用常量定义
 */

// ==================== 页面尺寸 ====================

/**
 * A4纸张尺寸（毫米）
 */
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

/**
 * A4纸张尺寸（像素，96 DPI）
 */
export const A4_WIDTH_PX = 794; // 210mm * 96 DPI / 25.4mm
export const A4_HEIGHT_PX = 1122.52; // 297mm * 96 DPI / 25.4mm

/**
 * A4尺寸转换倍数（用于html2canvas缩放）
 */
export const A4_SCALE_FACTOR = 3.78; // 96 DPI 转换倍数

// ==================== 存储相关 ====================

/**
 * localStorage键名
 */
export const STORAGE_KEYS = {
  RESUME_LIST: 'resume-list',
  RESUME_DATA_PREFIX: 'resume-data-',
} as const;

/**
 * 默认头像URL
 */
export const DEFAULT_AVATAR = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';

// ==================== 导出配置 ====================

/**
 * PDF导出默认配置
 */
export const PDF_EXPORT_DEFAULTS = {
  QUALITY: 0.98,
  MARGIN: 0,
  SCALE: 2,
} as const;

/**
 * PNG导出默认配置
 */
export const PNG_EXPORT_DEFAULTS = {
  QUALITY: 1,
  SCALE: 2,
} as const;

// ==================== 验证规则 ====================

/**
 * 表单验证规则
 */
export const VALIDATION_RULES = {
  EMAIL_MAX_LENGTH: 254,
  PHONE_LENGTH: 11,
  WECHAT_MAX_LENGTH: 20,
  NAME_MAX_LENGTH: 50,
  LOCATION_MAX_LENGTH: 100,
} as const;

// ==================== UI配置 ====================

/**
 * 动画和过渡配置
 */
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000,
} as const;

