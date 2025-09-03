import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PermitList from './components/PermitList';
import PermitForm from './components/PermitForm';
import PermitDetails from './components/PermitDetails';
import PermitApproval from './components/PermitApproval';
import { useNavigate, useParams } from 'react-router-dom';

const PermitManagement: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Routes>
      <Route index element={<PermitList />} />
      <Route 
        path="new" 
        element={
          <PermitForm 
            open={true} 
            onClose={() => navigate('/permits')} 
            onSave={() => navigate('/permits')} 
          />
        } 
      />
      <Route 
        path="edit/:id" 
        element={
          <PermitForm 
            open={true} 
            onClose={() => navigate('/permits')} 
            onSave={() => navigate('/permits')} 
          />
        } 
      />
      <Route 
        path=":id" 
        element={<PermitDetails permitId={id || '0'} />} 
      />
      <Route path="approve/:id" element={<PermitApproval />} />
    </Routes>
  );
};

export default PermitManagement;