/**
 * 表单验证工具函数
 */

/**
 * 邮箱格式验证
 */
export function validateEmail(email: string): boolean {
  if (!email || email.trim() === '') return true; // 空值允许

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * 手机号格式验证（中国大陆）
 */
export function validatePhone(phone: string): boolean {
  if (!phone || phone.trim() === '') return true; // 空值允许

  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone.trim());
}

/**
 * 日期格式验证 (YYYY-MM-DD)
 */
export function validateDate(dateStr: string): boolean {
  if (!dateStr || dateStr.trim() === '') return true; // 空值允许

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr.trim())) return false;

  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * URL格式验证
 */
export function validateUrl(url: string): boolean {
  if (!url || url.trim() === '') return true; // 空值允许

  try {
    new URL(url.trim());
    return true;
  } catch {
    return false;
  }
}

/**
 * 必填字段验证
 */
export function validateRequired(value: string): boolean {
  return Boolean(value && value.trim() !== '');
}

/**
 * 字符串长度验证
 */
export function validateLength(value: string, min: number, max?: number): boolean {
  if (!value) return true; // 空值允许

  const length = value.trim().length;
  if (length < min) return false;
  if (max !== undefined && length > max) return false;
  return true;
}

/**
 * 验证结果类型
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * 邮箱验证（带错误消息）
 */
export function validateEmailWithMessage(email: string): ValidationResult {
  if (!validateEmail(email)) {
    return {
      isValid: false,
      message: '请输入有效的邮箱地址'
    };
  }
  return { isValid: true };
}

/**
 * 手机号验证（带错误消息）
 */
export function validatePhoneWithMessage(phone: string): ValidationResult {
  if (!validatePhone(phone)) {
    return {
      isValid: false,
      message: '请输入有效的手机号码'
    };
  }
  return { isValid: true };
}

/**
 * 日期验证（带错误消息）
 */
export function validateDateWithMessage(dateStr: string): ValidationResult {
  if (!validateDate(dateStr)) {
    return {
      isValid: false,
      message: '请输入有效的日期格式 (YYYY-MM-DD)'
    };
  }
  return { isValid: true };
}

/**
 * URL验证（带错误消息）
 */
export function validateUrlWithMessage(url: string): ValidationResult {
  if (!validateUrl(url)) {
    return {
      isValid: false,
      message: '请输入有效的URL地址'
    };
  }
  return { isValid: true };
}

/**
 * 必填验证（带错误消息）
 */
export function validateRequiredWithMessage(value: string, fieldName: string): ValidationResult {
  if (!validateRequired(value)) {
    return {
      isValid: false,
      message: `${fieldName}不能为空`
    };
  }
  return { isValid: true };
}

/**
 * 长度验证（带错误消息）
 */
export function validateLengthWithMessage(value: string, min: number, max?: number, fieldName?: string): ValidationResult {
  if (!validateLength(value, min, max)) {
    const field = fieldName || '字段';
    if (max !== undefined) {
      return {
        isValid: false,
        message: `${field}长度必须在 ${min}-${max} 个字符之间`
      };
    } else {
      return {
        isValid: false,
        message: `${field}长度不能少于 ${min} 个字符`
      };
    }
  }
  return { isValid: true };
}
