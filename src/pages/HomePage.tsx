import { useResumeListStore } from '../stores/resumeListStore';
import { useEffect, useState } from 'react';
import { formatDateForDisplay } from '../utils/dateUtils';

export default function HomePage() {
  const { resumes, createResume, deleteResume, setCurrentResumeId, storageError, clearStorageError } = useResumeListStore();
  const [showError, setShowError] = useState<string | null>(null);

  // 显示存储错误提示
  useEffect(() => {
    if (storageError) {
      setShowError(storageError);
      clearStorageError();
    }
  }, [storageError, clearStorageError]);

  const handleCloseError = () => {
    setShowError(null);
  };

  const handleCreateResume = () => {
    const id = createResume();
    setCurrentResumeId(id);
  };

  const handleOpenResume = (id: string) => {
    setCurrentResumeId(id);
  };

  const handleDeleteResume = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这份简历吗？')) {
      deleteResume(id);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDateForDisplay(dateString);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 错误提示 */}
      {showError && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-red-800">存储错误</p>
                <p className="mt-1 text-sm text-red-700">{showError}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={handleCloseError}
                  className="inline-flex text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* 头部 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            我的简历
          </h1>
          <p className="text-gray-600 text-lg">
            创建和管理你的专业简历
          </p>
        </div>

        {/* 简历列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 创建新简历卡片 */}
          <button
            onClick={handleCreateResume}
            className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 min-h-[280px] flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
              创建新简历
            </span>
          </button>

          {/* 简历卡片列表 */}
          {resumes.map((resume) => (
            <div
              key={resume.id}
              onClick={() => handleOpenResume(resume.id)}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 cursor-pointer border border-gray-100 hover:border-blue-200 min-h-[280px] flex flex-col"
            >
              {/* 删除按钮 */}
              <button
                onClick={(e) => handleDeleteResume(resume.id, e)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="删除简历"
              >
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              {/* 简历图标 */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>

              {/* 简历信息 */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {resume.title}
                </h3>

                {resume.preview && (
                  <div className="space-y-1 mb-4 text-sm text-gray-600">
                    {resume.preview.name && (
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {resume.preview.name}
                      </p>
                    )}
                    {resume.preview.position && (
                      <p className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {resume.preview.position}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* 时间信息 */}
              <div className="pt-4 border-t border-gray-100 space-y-1 text-xs text-gray-500">
                <p>创建时间：{formatDate(resume.createdAt)}</p>
                <p>更新时间：{formatDate(resume.updatedAt)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态提示 */}
        {resumes.length === 0 && (
          <div className="text-center mt-12 text-gray-500">
            <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg">还没有简历，点击上方卡片创建第一份简历吧</p>
          </div>
        )}
      </div>
    </div>
  );
}
