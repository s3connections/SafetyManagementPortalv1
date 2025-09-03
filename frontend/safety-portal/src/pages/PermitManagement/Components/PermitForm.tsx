import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PermitList from './components/PermitList';
import PermitForm from './components/PermitForm';
import PermitDetails from './components/PermitDetails';
import PermitApproval from './components/PermitApproval';

const PermitManagement: React.FC = () => {
  return (
    <Routes>
      <Route index element={<PermitList />} />
      <Route path="new" element={<PermitForm />} />
      <Route path="edit/:id" element={<PermitForm />} />
      <Route path=":id" element={<PermitDetails />} />
      <Route path="approve/:id" element={<PermitApproval />} />
    </Routes>
  );
};

export default PermitManagement;