import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';

import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Diagnosis } from './pages/Diagnosis';
import { Result } from './pages/Result';
import { Mission } from './pages/Mission';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/result" element={<Result />} />
          <Route path="/mission" element={<Mission />} />
        </Routes>
      </Layout>
    </Router>
    </AppProvider>
  );
}

export default App;
