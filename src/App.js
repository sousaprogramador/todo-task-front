import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Tasks from './pages/Tasks';
import Login from './pages/Login'; // Página de Login
import Register from './pages/Register'; // Página de Cadastro
import ForgotPassword from './pages/ForgotPassword'; // Página de Esqueci Minha Senha

function App() {
  return (
    <Router>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex-grow p-6'>
          <Routes>
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route
              path='*'
              element={
                <h1 className='text-3xl font-bold'>Página Não Encontrada</h1>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
