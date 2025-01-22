import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UsersList from './Users//UsersList';
import StudentsList from './Students/StudentsList';
import './App.css'

const App = () => {
  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh' }}>
        <nav
          style={{
            width: '200px',
            background: '#f0f0f0',
            padding: '20px',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <Link to="/users">Users List</Link>
            </li>
            <li>
              <Link to="/students">Students List</Link>
            </li>
          </ul>
        </nav>

        <div style={{ flex: 1, padding: '20px' }}>
          <Routes>
            <Route path="/users" element={<UsersList />} />
            <Route path="/students" element={<StudentsList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App
