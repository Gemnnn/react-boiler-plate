import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';

import Auth from './hoc/auth';

function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route exact path="/" element={Auth(LandingPage, null) } />
          <Route exact path="/login" element={Auth(LoginPage, false)} />
          <Route exact path="/register" element={Auth(RegisterPage, false)} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home, Hello World!</h2>
    </div>
  );
}

function About() {
  return (
    <div>
      <h2>About, Hello World!</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard, Hello World!</h2>
    </div>
  );
}

export default App;
