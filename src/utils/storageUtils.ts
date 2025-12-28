/**
 * localStorage安全操作工具函数
 */

/**
 * 安全的localStorage读取操作
 */
export function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
    return null;
  }
}

/**
 * 安全的localStorage写入操作
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    console.warn('Failed to write to localStorage');
    return false;
  }
}

/**
 * 安全的localStorage删除操作
 */
export function safeLocalStorageRemove(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    console.warn('Failed to remove from localStorage');
    return false;
  }
}

/**
 * 获取存储错误的用户友好的错误消息
 */
export function getStorageErrorMessage(): string {
  try {
    // 测试localStorage是否可用
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return '存储空间已满，请清理浏览器数据后重试';
  } catch (error) {
    // 隐私模式或localStorage被禁用
    return '浏览器存储功能被禁用，请启用localStorage功能';
  }
}