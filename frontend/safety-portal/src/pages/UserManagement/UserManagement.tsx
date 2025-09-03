import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserDetails from './components/UserDetails';
import { useNavigate, useParams } from 'react-router-dom';
import PermitDetails from 'pages/PermitManagement/components/PermitDetails';

const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  return (
    <Routes>
      <Route index element={<UserList />} />
      <Route path="new" element={<UserForm open={true} onClose={() => navigate('/audits')} onSave={() => navigate('/audits')} />} />
      <Route path="edit/:id" element={<UserForm open={true} onClose={() => navigate('/audits')} onSave={() => navigate('/audits')} />} />
      <Route path=":id" element={<PermitDetails permitId={id || '0'} />} />
    </Routes>
  );
};

export default UserManagement;