import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon 
} from '@mui/icons-material';

interface AuditDetailsProps {
  auditId: string;
  onEdit?: () => void;
  onStartAudit?: () => void;
}

interface AuditDetail {
  id: string;
  title: string;
  description: string;
  status: string;
  auditType: string;
  scheduledDate: Date;
  completedDate?: Date;
  auditor: {
    id: string;
    name: string;
    email: string;
  };
  department: string;
  plant: string;
  score?: number;
  findings: AuditFinding[];
  checklistItems: ChecklistItem[];
}

interface AuditFinding {
  id: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Closed';
  corrective_action?: string;
}

interface ChecklistItem {
  id: string;
  question: string;
  response: 'Yes' | 'No' | 'N/A' | null;
  notes?: string;
}

const AuditDetails: React.FC<AuditDetailsProps> = ({
  auditId,
  onEdit,
  onStartAudit
}) => {
  const [audit, setAudit] = useState<AuditDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditDetails();
  }, [auditId]);

  const loadAuditDetails = async () => {
    setLoading(true);
    try {
      // Implementation to fetch audit details
      // For now, using mock data
      const mockAudit: AuditDetail = {
        id: auditId,
        title: 'Safety Compliance Audit',
        description: 'Comprehensive safety compliance audit for manufacturing department',
        status: 'Scheduled',
        auditType: 'Safety',
        scheduledDate: new Date(),
        auditor: {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@company.com'
        },
        department: 'Manufacturing',
        plant: 'Plant 1',
        findings: [],
        checklistItems: [
          {
            id: '1',
            question: 'Are all safety procedures documented?',
            response: null
          }
        ]
      };
      setAudit(mockAudit);
    } catch (error) {
      console.error('Error loading audit details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'primary';
      case 'In Progress': return 'warning';
      case 'Completed': return 'success';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading audit details...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!audit) {
    return (
      <Card>
        <CardContent>
          <Typography>Audit not found</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {audit.title}
              </Typography>
              <Chip 
                label={audit.status} 
                color={getStatusColor(audit.status) as any}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box display="flex" gap={1}>
              {audit.status === 'Scheduled' && (
                <Button
                  variant="contained"
                  startIcon={<AssignmentIcon />}
                  onClick={onStartAudit}
                  color="primary"
                >
                  Start Audit
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={onEdit}
              >
                Edit
              </Button>
            </Box>
          </Box>

          <Typography variant="body1" color="textSecondary" paragraph>
            {audit.description}
          </Typography>

          <Grid container spacing={3}>
            <Grid size ={{xs: 12, md:6}}>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Audit Type" 
                    secondary={audit.auditType}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Scheduled Date" 
                    secondary={audit.scheduledDate.toLocaleDateString()}
                  />
                </ListItem>
                {audit.completedDate && (
                  <ListItem>
                    <ListItemText 
                      primary="Completed Date" 
                      secondary={audit.completedDate.toLocaleDateString()}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>
            <Grid size ={{xs: 12, md:6}}>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Auditor" 
                    secondary={`${audit.auditor.name} (${audit.auditor.email})`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Department" 
                    secondary={audit.department}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Plant" 
                    secondary={audit.plant}
                  />
                </ListItem>
                {audit.score && (
                  <ListItem>
                    <ListItemText 
                      primary="Score" 
                      secondary={`${audit.score}%`}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Findings */}
      {audit.findings.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Audit Findings
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Corrective Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {audit.findings.map((finding) => (
                    <TableRow key={finding.id}>
                      <TableCell>{finding.description}</TableCell>
                      <TableCell>
                        <Chip 
                          label={finding.severity} 
                          color={getSeverityColor(finding.severity) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={finding.status}
                          color={finding.status === 'Closed' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{finding.corrective_action || 'Pending'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Checklist */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Audit Checklist
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Response</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {audit.checklistItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.question}</TableCell>
                    <TableCell>
                      {item.response ? (
                        <Chip 
                          label={item.response}
                          color={item.response === 'Yes' ? 'success' : item.response === 'No' ? 'error' : 'default'}
                          size="small"
                        />
                      ) : (
                        'Not answered'
                      )}
                    </TableCell>
                    <TableCell>{item.notes || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuditDetails;