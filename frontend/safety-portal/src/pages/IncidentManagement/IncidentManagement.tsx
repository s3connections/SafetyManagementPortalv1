import React from 'react';
import { Routes, Route } from 'react-router-dom';
import IncidentList from './components/Incidentlist';
import IncidentForm from './components/IncidentForm';
import IncidentDetails from './components/IncidentDetails';
import { useNavigate, useParams } from 'react-router-dom';

const IncidentManagement: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  return (
    <Routes>
      <Route index element={<IncidentList />} />
      <Route path="new" element={<IncidentForm open={true} onClose={() => navigate('/incidents')} onSave={() => navigate('/incidents')} />} />
      <Route path="edit/:id" element={<IncidentForm open={true} onClose={() => navigate('/incidents')} onSave={() => navigate('/incidents')} />} />
      <Route path=":id" element={<IncidentDetails incidentId={id || '0'} />} />
    </Routes>
  );
};


export default IncidentManagement;