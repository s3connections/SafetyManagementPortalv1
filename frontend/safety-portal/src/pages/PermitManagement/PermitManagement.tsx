import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import PermitList from './components/PermitList';
import PermitDetails from './components/PermitDetails';
import PermitApproval from './components/PermitApproval';

const PermitManagement: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Routes>
        <Route index element={<PermitList />} />
        <Route 
          path=":id" 
          element={<PermitDetailsWrapper />} 
        />
        <Route path="approve/:id" element={<PermitApproval />} />
      </Routes>
    </div>
  );
};

// Wrapper component to extract the id parameter
const PermitDetailsWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <PermitDetails permitId={id || '0'} />;
};

export default PermitManagement;