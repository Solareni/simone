import { ResumeProvider } from './context/ResumeContext';
import { StyleProvider } from './context/StyleContext';
import ConfigPanel from './components/ConfigPanel/ConfigPanel';
import PreviewPanel from './components/PreviewPanel/PreviewPanel';

function App() {
  return (
    <ResumeProvider>
      <StyleProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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

export default App;
