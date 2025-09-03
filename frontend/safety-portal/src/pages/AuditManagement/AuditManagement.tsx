    import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuditList from './components/AuditList';
import AuditForm from './components/AuditForm';
import AuditDetails from './components/AuditDetails';
import ConductAudit from './components/ConductAudit';

const AuditManagement: React.FC = () => {
  return (
    <Routes>
      <Route index element={<AuditList />} />
      <Route path="new" element={<AuditForm />} />
      <Route path="edit/:id" element={<AuditForm />} />
      <Route path=":id" element={<AuditDetails />} />
      <Route path="conduct/:id" element={<ConductAudit />} />
    </Routes>
  );
};

export default AuditManagement;