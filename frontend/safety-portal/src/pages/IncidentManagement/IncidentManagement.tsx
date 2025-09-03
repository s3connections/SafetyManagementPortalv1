import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IncidentList from './components/IncidentList';
import IncidentForm from './components/IncidentForm';
import IncidentDetails from './components/IncidentDetails';

const IncidentManagement: React.FC = () => {
  return (
    <Routes>
      <Route index element={<IncidentList />} />
      <Route path="new" element={<IncidentForm />} />
      <Route path="edit/:id" element={<IncidentForm />} />
      <Route path=":id" element={<IncidentDetails />} />
    </Routes>
  );
};

export default IncidentManagement;