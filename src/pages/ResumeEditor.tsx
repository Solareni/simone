import { ResumeProvider } from '../context/ResumeContext';
import { StyleProvider } from '../context/StyleContext';
import ConfigPanel from '../components/ConfigPanel/ConfigPanel';
import PreviewPanel from '../components/PreviewPanel/PreviewPanel';
import { useResumeList } from '../context/ResumeListContext';

export default function ResumeEditor() {
  const { currentResumeId, setCurrentResumeId } = useResumeList();

  const handleBackToHome = () => {
    setCurrentResumeId(null);
  };

  if (!currentResumeId) {
    return null;
  }

  return (
    <ResumeProvider resumeId={currentResumeId}>
      <StyleProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          {/* 返回首页按钮 */}
          <div className="fixed top-4 left-4 z-50">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-gray-700 font-medium">返回首页</span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 lg:h-screen lg:overflow-y-auto bg-white border-r border-gray-200/50 shadow-sm">
              <ConfigPanel />
            </div>
            <div className="w-full lg:w-1/2 lg:h-screen lg:overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
              <PreviewPanel />
            </div>
          </div>
        </div>
      </StyleProvider>
    </ResumeProvider>
  );
}
