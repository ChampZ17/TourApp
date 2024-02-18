import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './pages/Home.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import DestinationPage from './pages/DestinationPage';

function App() {
  return (
    <Router>
			<Routes>
				<Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route exact path="/signup" element={<SignupPage />} />
        <Route exact path="/destination/:slug" element={<DestinationPage />} />
			</Routes>
		</Router>
  );
}

export default App;
