/**
 * 表单验证自定义 Hook
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import type { ValidationResult } from '../utils/validation';
import { UI_CONFIG } from '../constants';

/**
 * 验证规则函数类型
 */
type ValidationRule = (value: string) => ValidationResult;

/**
 * 验证规则映射
 */
export type ValidationRules = Record<string, ValidationRule>;

/**
 * Hook 配置选项
 */
export interface UseFormValidationOptions {
  rules: ValidationRules;
  debounceDelay?: number;
}

/**
 * Hook 返回值
 */
export interface UseFormValidationReturn {
  errors: Record<string, string>;
  validateField: (field: string, value: string) => void;
  validateFieldImmediate: (field: string, value: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
  hasErrors: boolean;
}

/**
 * 通用的表单验证 Hook
 *
 * @example
 * ```tsx
 * const { errors, validateField } = useFormValidation({
 *   rules: {
 *     email: validateEmailWithMessage,
 *     phone: validatePhoneWithMessage,
 *   }
 * });
 *
 * <input onChange={(e) => validateField('email', e.target.value)} />
 * {errors.email && <span>{errors.email}</span>}
 * ```
 */
export function useFormValidation(options: UseFormValidationOptions): UseFormValidationReturn {
  const { rules, debounceDelay = UI_CONFIG.DEBOUNCE_DELAY } = options;

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 防抖定时器引用
  const debounceTimersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // 清理防抖定时器
  useEffect(() => {
    return () => {
      Object.values(debounceTimersRef.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  /**
   * 立即执行验证（不使用防抖）
   */
  const validateFieldImmediate = useCallback((field: string, value: string) => {
    const validationRule = rules[field];

    if (!validationRule) {
      // 如果没有对应的验证规则，清除该字段的错误
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      return;
    }

    const result = validationRule(value);

    setErrors(prev => {
      const newErrors = { ...prev };

      if (!result.isValid && result.message) {
        newErrors[field] = result.message;
      } else {
        delete newErrors[field];
      }

      return newErrors;
    });
  }, [rules]);

  /**
   * 验证字段（使用防抖）
   */
  const validateField = useCallback((field: string, value: string) => {
    // 清除之前的定时器
    if (debounceTimersRef.current[field]) {
      clearTimeout(debounceTimersRef.current[field]);
    }

    // 设置新的防抖定时器
    debounceTimersRef.current[field] = setTimeout(() => {
      validateFieldImmediate(field, value);
    }, debounceDelay);
  }, [debounceDelay, validateFieldImmediate]);

  /**
   * 清除单个字段的错误
   */
  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * 清除所有错误
   */
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * 是否有错误
   */
  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    validateField,
    validateFieldImmediate,
    clearError,
    clearAllErrors,
    hasErrors,
  };
}
