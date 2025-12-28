import { useResume } from '../../context/ResumeContext';
import { validateEmailWithMessage, validatePhoneWithMessage, validateDateWithMessage } from '../../utils/validation';
import { useState, useRef, useCallback, useEffect } from 'react';
import { UI_CONFIG } from '../../constants';

export default function BasicInfoForm() {
  const { data, dispatch } = useResume();
  const { basicInfo } = data;
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // 防抖定时器
  const debounceTimerRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // 清理防抖定时器
  useEffect(() => {
    return () => {
      Object.values(debounceTimerRef.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const handleUpdate = (field: keyof typeof basicInfo, value: string) => {
    dispatch({ type: 'UPDATE_BASIC_INFO', payload: { [field]: value } });

    // 使用防抖验证
    if (debounceTimerRef.current[field]) {
      clearTimeout(debounceTimerRef.current[field]);
    }

    debounceTimerRef.current[field] = setTimeout(() => {
      validateField(field, value);
    }, UI_CONFIG.DEBOUNCE_DELAY);
  };

  // 实时验证
  const validationErrorsRef = useRef(validationErrors);
  validationErrorsRef.current = validationErrors;

  const validateField = useCallback((field: string, value: string) => {
    const errors = { ...validationErrorsRef.current };

    switch (field) {
      case 'email': {
        const validation = validateEmailWithMessage(value);
        if (!validation.isValid && validation.message) {
          errors.email = validation.message;
        } else {
          delete errors.email;
        }
        break;
      }
      case 'phone': {
        const validation = validatePhoneWithMessage(value);
        if (!validation.isValid && validation.message) {
          errors.phone = validation.message;
        } else {
          delete errors.phone;
        }
        break;
      }
      case 'birthDate': {
        const validation = validateDateWithMessage(value);
        if (!validation.isValid && validation.message) {
          errors.birthDate = validation.message;
        } else {
          delete errors.birthDate;
        }
        break;
      }
    }

    setValidationErrors(errors);
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch({ type: 'UPDATE_BASIC_INFO', payload: { avatar: reader.result as string } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 lg:p-8" id="basic-info">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">基本信息</h2>
        <p className="text-sm text-gray-500">
          包含你的个人信息以及联系方式
        </p>
      </div>

      {/* 头像上传 - 单独一行 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">头像</label>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={basicInfo.avatar}
              alt="头像"
              className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 shadow-sm"
            />
            <div className="absolute inset-0 rounded-xl bg-black/0 hover:bg-black/5 transition-colors"></div>
          </div>
          <label className="cursor-pointer">
            <span className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md text-sm font-medium inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              上传头像
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 四行两列布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* 第一行 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">姓名</label>
          <input
            type="text"
            value={basicInfo.name || ''}
            onChange={(e) => handleUpdate('name', e.target.value)}
            placeholder="你的姓名"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">工作地点</label>
          <input
            type="text"
            value={basicInfo.location || ''}
            onChange={(e) => handleUpdate('location', e.target.value)}
            placeholder="例如：北京"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md text-gray-900"
          />
        </div>

        {/* 第二行 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">手机号码</label>
          <input
            type="tel"
            value={basicInfo.phone || ''}
            onChange={(e) => handleUpdate('phone', e.target.value)}
            placeholder="你的手机号码"
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white shadow-sm hover:shadow-md text-gray-900 ${
              validationErrors.phone
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {validationErrors.phone && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {validationErrors.phone}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">电子邮件</label>
          <input
            type="email"
            value={basicInfo.email || ''}
            onChange={(e) => handleUpdate('email', e.target.value)}
            placeholder="your.email@example.com"
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white shadow-sm hover:shadow-md text-gray-900 ${
              validationErrors.email
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {validationErrors.email}
            </p>
          )}
        </div>

        {/* 第三行 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">出生日期</label>
          <input
            type="month"
            value={basicInfo.birthDate || ''}
            onChange={(e) => handleUpdate('birthDate', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all bg-white shadow-sm hover:shadow-md text-gray-900 ${
              validationErrors.birthDate
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {validationErrors.birthDate && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {validationErrors.birthDate}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">微信号</label>
          <input
            type="text"
            value={basicInfo.wechat || ''}
            onChange={(e) => handleUpdate('wechat', e.target.value)}
            placeholder="你的微信号"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}
