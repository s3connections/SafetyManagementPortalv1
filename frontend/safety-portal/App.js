import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HierarchyAdmin from './pages/admin/hierarchy';
import WorkflowAdmin from './pages/admin/workflow';
import AuditQAdmin from './pages/admin/audit-questions';

export default function App() {
  return (
    <Routes>
      {/* Redirect root path to /admin/hierarchy */}
      <Route path="/" element={<Navigate to="/admin/hierarchy" replace />} />
      
      {/* Your admin routes */}
      <Route path="/admin/hierarchy" element={<HierarchyAdmin />} />
      <Route path="/admin/workflow" element={<WorkflowAdmin />} />
      <Route path="/admin/audit-questions" element={<AuditQAdmin />} />
      
      {/* Catch-all route redirects to /admin/hierarchy */}
      <Route path="*" element={<Navigate to="/admin/hierarchy" replace />} />
    </Routes>
  );
}
