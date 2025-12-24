import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Playground from './pages/Playground';
import Learn from './pages/Learn';
import TopicPage from './pages/TopicPage';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:topicId" element={<TopicPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;