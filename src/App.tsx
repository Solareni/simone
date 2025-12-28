import { useResumeListStore } from './stores/resumeListStore';
import HomePage from './pages/HomePage';
import ResumeEditor from './pages/ResumeEditor';

function App() {
  const currentResumeId = useResumeListStore((state) => state.currentResumeId);

  return currentResumeId ? <ResumeEditor /> : <HomePage />;
}

export default App;
