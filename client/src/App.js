import Login from './components/Common/Login';
import './app.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout';
import Worker from './components/Worker';
import Manager from './components/Manager';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='' element={<Login />} />
        <Route path='worker' element={<Worker />} />
        <Route path='manager' element={<Manager />} />
      </Route>
    </Routes>
  );
}

export default App;
