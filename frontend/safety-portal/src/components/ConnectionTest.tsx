import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Typography, Alert, Box, CircularProgress } from '@mui/material';
import AuditService from '../services/AuditService';
import ObservationService from '../services/ObservationService';
import { Audit, Observation, ObservationType, Priority } from '../types';

const ConnectionTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const testAuditConnection = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('🔄 Testing Audit API connection...');
      const response = await AuditService.getAudits(1, 5);
      
      if (response.data) {
        setAudits(response.data);
        setSuccess(`✅ Audit API connected! Found ${response.data} audits`);
        console.log('✅ Audit API Response:', response);
      } else {
        setError('❌ Audit API returned unsuccessful response');
      }
    } catch (err: any) {
      console.error('❌ Audit API Error:', err);
      setError(`❌ Audit API Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testObservationConnection = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('🔄 Testing Observation API connection...');
      const response = await ObservationService.getObservations(1, 5);
      
      if (response.data) {
        setObservations(response.data);
        setSuccess(`✅ Observation API connected! Found ${response.data} observations`);
        console.log('✅ Observation API Response:', response);
      } else {
        setError('❌ Observation API returned unsuccessful response');
      }
    } catch (err: any) {
      console.error('❌ Observation API Error:', err);
      setError(`❌ Observation API Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateObservation = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('🔄 Testing Create Observation...');
      const testObservation = {
        observationType: ObservationType.UNSAFE_CONDITION,
        priority: Priority.MEDIUM,
        description: 'Test observation created from React frontend for API connectivity testing',
        location: 'Test Location - Plant A, Section B',
        plantId: 1,
        departmentId: 1,
        hazardType: 'Electrical Hazard'
      };
      
      const response = await ObservationService.createObservation(testObservation);
      
      if (response.success) {
        setSuccess(`✅ Observation created successfully! Ticket: ${response.data.ticketNumber}`);
        console.log('✅ Created Observation:', response.data);
        // Refresh the observation list
        await testObservationConnection();
      } else {
        setError('❌ Failed to create observation');
      }
    } catch (err: any) {
      console.error('❌ Create Observation Error:', err);
      setError(`❌ Create Observation Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateAudit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log('🔄 Testing Create Audit...');
      const testAudit = {
        auditType: 'Safety Compliance Audit',
        departmentId: 1,
        plantId: 1,
        auditorId: 1,
        scheduledDate: new Date().toISOString()
      };
      
      const response = await AuditService.createAudit(testAudit);
      
      if (response.success) {
        setSuccess(`✅ Audit created successfully! Number: ${response.data.auditNumber}`);
        console.log('✅ Created Audit:', response.data);
        // Refresh the audit list
        await testAuditConnection();
      } else {
        setError('❌ Failed to create audit');
      }
    } catch (err: any) {
      console.error('❌ Create Audit Error:', err);
      setError(`❌ Create Audit Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test connection on component mount
  useEffect(() => {
    testAuditConnection();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        🔧 Safety Management API Connection Test
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Test the connection between your React frontend and C# ASP.NET Core backend.
      </Typography>

      {/* Status Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Test Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          onClick={testAuditConnection}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Test Audit API
        </Button>
        
        <Button 
          variant="contained" 
          onClick={testObservationConnection}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Test Observation API
        </Button>
        
        <Button 
          variant="contained" 
          color="secondary"
          onClick={testCreateObservation}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Test Create Observation
        </Button>

        <Button 
          variant="contained" 
          color="secondary"
          onClick={testCreateAudit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Test Create Audit
        </Button>
      </Box>

      {/* Results Display */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {/* Audits Card */}
        {audits.length > 0 && (
          <Card sx={{ minWidth: 300, flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📋 Audits ({audits.length})
              </Typography>
              {audits.slice(0, 3).map((audit) => (
                <Box key={audit.id} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>#{audit.auditNumber}</strong> - {audit.auditType}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Status: {audit.status} | Plant ID: {audit.plantId}
                  </Typography>
                  <Typography variant="caption" display="block">
                    Scheduled: {new Date(audit.scheduledDate).toLocaleDateString()}
                  </Typography>
                </Box>
              ))}
              {audits.length > 3 && (
                <Typography variant="caption">
                  ... and {audits.length - 3} more
                </Typography>
              )}
            </CardContent>
          </Card>
        )}

        {/* Observations Card */}
        {observations.length > 0 && (
          <Card sx={{ minWidth: 300, flex: 1 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                👁️ Observations ({observations.length})
              </Typography>
              {observations.slice(0, 3).map((obs) => (
                <Box key={obs.id} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2">
                    <strong>#{obs.ticketNumber}</strong> - {obs.observationType}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Priority: {obs.priority} | Status: {obs.status}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {obs.description.substring(0, 50)}...
                  </Typography>
                </Box>
              ))}
              {observations.length > 3 && (
                <Typography variant="caption">
                  ... and {observations.length - 3} more
                </Typography>
              )}
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Instructions */}
      <Card sx={{ mt: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📝 Instructions:
          </Typography>
          <Typography variant="body2" component="div">
            <ol>
              <li>Make sure your C# backend is running on <code>https://localhost:7139</code></li>
              <li>Ensure CORS is configured in your C# Program.cs</li>
              <li>Check that your SQL Server Express is running</li>
              <li>Test the buttons above to verify API connectivity</li>
              <li>Check browser console (F12) for detailed error messages</li>
            </ol>
          </Typography>
        </CardContent>
      </Card>

      {/* Console Instructions */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔍 Debugging Tips:
          </Typography>
          <Typography variant="body2" component="div">
            <strong>If you see errors:</strong>
            <ul>
              <li><strong>CORS Error:</strong> Add CORS policy in your C# Program.cs</li>
              <li><strong>Network Error:</strong> Check if C# backend is running</li>
              <li><strong>404 Error:</strong> Verify API endpoint URLs match your controllers</li>
              <li><strong>500 Error:</strong> Check C# backend logs for server errors</li>
            </ul>
            
            <strong>Expected API URLs:</strong>
            <ul>
              <li>GET https://localhost:7139/api/audit</li>
              <li>GET https://localhost:7139/api/observation</li>
              <li>POST https://localhost:7139/api/observation</li>
              <li>POST https://localhost:7139/api/audit</li>
            </ul>
          </Typography>
        </CardContent>
      </Card>

      {/* Current API Configuration */}
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ⚙️ Current Configuration:
          </Typography>
          <Typography variant="body2" component="div">
            <strong>API Base URL:</strong> {process.env.REACT_APP_API_URL || 'https://localhost:7139/api'}<br/>
            <strong>Environment:</strong> {process.env.NODE_ENV}<br/>
            <strong>Build Date:</strong> {new Date().toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConnectionTest;
