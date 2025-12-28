import { useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';

export default function HobbiesEditor() {
  const data = useResumeStore((state) => state.data);
  const addHobby = useResumeStore((state) => state.addHobby);
  const removeHobby = useResumeStore((state) => state.removeHobby);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const value = inputValue.trim();
    if (value && !data.hobbies.includes(value)) {
      addHobby(value);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (index: number) => {
    removeHobby(index);
  };

  return (
    <div className="p-6 lg:p-8 border-t border-gray-200" id="hobbies">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">爱好</h2>
        <p className="text-sm text-gray-500">添加你的兴趣爱好</p>
      </div>

      <div className="space-y-4">
        {/* 输入框 */}
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入爱好，按回车添加"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm hover:shadow-md"
          />
          <button
            onClick={handleAdd}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md font-medium"
          >
            添加
          </button>
        </div>

        {/* 标签列表 */}
        <div className="flex flex-wrap gap-2">
          {data.hobbies.map((hobby, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full border border-blue-200 shadow-sm hover:shadow-md transition-all"
            >
              <span className="font-medium">{hobby}</span>
              <button
                onClick={() => handleRemove(index)}
                className="hover:text-blue-900 transition-colors rounded-full hover:bg-blue-200 p-0.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
