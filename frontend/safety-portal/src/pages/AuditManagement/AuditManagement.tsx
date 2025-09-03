    import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AuditList from './components/AuditList';
import AuditForm from './components/AuditForm';
import AuditDetails from './components/AuditDetails';
import ConductAudit from './components/ConductAudit';
import { useNavigate, useParams } from 'react-router-dom';


const AuditManagement: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  return (
    <Routes>
      <Route index element={<AuditList />} />
      <Route path="new" element={<AuditForm open={true} onClose={() => navigate('/audits')} onSave={() => navigate('/audits')} />} />
      <Route path="edit/:id" element={<AuditForm open={true} onClose={() => navigate('/audits')} onSave={() => navigate('/audits')} />} />
      <Route path=":id" element={<AuditDetails auditId={id || '0'} />} />
      <Route path="conduct/:id" element={<ConductAudit />} />
    </Routes>
  );
};

export default AuditManagement;