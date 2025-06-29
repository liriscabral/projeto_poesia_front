import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import CadastroUsuario from './pages/cadastroUsuario';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />} />
          <Route path="/cadastroUsuario" element={<CadastroUsuario />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
