import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/PublicWebsite/Home';
import Contact from './components/PublicWebsite/Contact';
import Login from './components/AdminCRM/Login';
import Register from './components/AdminCRM/Register';
import Dashboard from './components/AdminCRM/Dashboard';
import LeadDetails from './components/AdminCRM/LeadDetails';
import AddLead from './components/AdminCRM/AddLead';
import AdminManage from './components/AdminCRM/AdminManage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <Routes>
      {/* Public Website */}
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin Auth */}
      <Route path="/admin/login" element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/admin/dashboard" />} />
      <Route path="/admin/register" element={<Register isAuthenticated={isAuthenticated} />} />

      {/* Protected Admin CRM */}
      <Route path="/admin/dashboard" element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/leads/new" element={isAuthenticated ? <AddLead /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/leads/:id" element={isAuthenticated ? <LeadDetails /> : <Navigate to="/admin/login" />} />
      <Route path="/admin/manage" element={isAuthenticated ? <AdminManage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/admin/login" />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
