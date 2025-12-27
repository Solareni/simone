import { ResumeListProvider, useResumeList } from './context/ResumeListContext';
import HomePage from './pages/HomePage';
import ResumeEditor from './pages/ResumeEditor';

function AppRouter() {
  const { currentResumeId } = useResumeList();

  return currentResumeId ? <ResumeEditor /> : <HomePage />;
}

function App() {
  return (
    <ResumeListProvider>
      <AppRouter />
    </ResumeListProvider>
  );
}

export default App;
