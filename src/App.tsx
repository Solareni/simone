import { ResumeProvider } from './context/ResumeContext';
import ConfigPanel from './components/ConfigPanel/ConfigPanel';
import PreviewPanel from './components/PreviewPanel/PreviewPanel';

function App() {
  return (
    <ResumeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* 移动端上下布局，桌面端左右布局 */}
        <div className="flex flex-col lg:flex-row">
          {/* 左侧配置面板 */}
          <div className="w-full lg:w-1/2 lg:h-screen lg:overflow-y-auto bg-white border-r border-gray-200/50 shadow-sm">
            <ConfigPanel />
          </div>

          {/* 右侧预览面板 */}
          <div className="w-full lg:w-1/2 lg:h-screen lg:overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8">
            <PreviewPanel />
          </div>
        </div>
      </div>
    </ResumeProvider>
  );
}

export default App;
