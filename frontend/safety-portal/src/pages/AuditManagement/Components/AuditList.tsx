import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Visibility as ViewIcon 
} from '@mui/icons-material';

interface AuditListProps {
  onCreateAudit?: () => void;
  onEditAudit?: (auditId: string) => void;
  onViewAudit?: (auditId: string) => void;
}

interface Audit {
  id: string;
  title: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  auditDate: Date;
  auditor: string;
  department: string;
  score?: number;
}

const AuditList: React.FC<AuditListProps> = ({ 
  onCreateAudit, 
  onEditAudit, 
  onViewAudit 
}) => {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // Load audits data
    loadAudits();
  }, []);

  const loadAudits = async () => {
    // Implementation to fetch audits from API
    // For now, using mock data
    const mockAudits: Audit[] = [
      {
        id: '1',
        title: 'Safety Compliance Audit',
        status: 'Scheduled',
        auditDate: new Date(),
        auditor: 'John Doe',
        department: 'Manufacturing'
      }
    ];
    setAudits(mockAudits);
  };

  const handleStatusFilter = (status: string) => {
    setFilterStatus(status);
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

  const filteredAudits = audits.filter(audit => {
    const matchesStatus = !filterStatus || audit.status === filterStatus;
    const matchesSearch = !searchTerm || 
      audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.auditor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">
              Audit Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateAudit}
            >
              Create Audit
            </Button>
          </Box>

          <Grid container spacing={2} alignItems="center">
            <Grid size ={{xs: 12, md:4}}>
              <TextField
                fullWidth
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid size ={{xs: 12, md:3}}>
              <FormControl fullWidth>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Filter by Status"
                  onChange={(e) => handleStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="Scheduled">Scheduled</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Audit Date</TableCell>
                  <TableCell>Auditor</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAudits.map((audit) => (
                  <TableRow key={audit.id}>
                    <TableCell>{audit.title}</TableCell>
                    <TableCell>
                      <Chip 
                        label={audit.status} 
                        color={getStatusColor(audit.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {audit.auditDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>{audit.auditor}</TableCell>
                    <TableCell>{audit.department}</TableCell>
                    <TableCell>{audit.score || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small"
                        onClick={() => onViewAudit?.(audit.id)}
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton 
                        size="small"
                        onClick={() => onEditAudit?.(audit.id)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
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

export default AuditList;