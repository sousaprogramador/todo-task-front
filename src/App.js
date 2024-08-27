import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Tasks from './pages/Tasks'; // Página de tarefas
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <Router>
      <TaskProvider>
        <div className='flex flex-col min-h-screen'>
          <Header />
          <main className='flex-grow'>
            <Routes>
              <Route path='/' element={<Tasks />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </TaskProvider>
    </Router>
  );
}

export default App;
