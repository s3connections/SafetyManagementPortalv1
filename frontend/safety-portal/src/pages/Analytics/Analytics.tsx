import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Assessment,
  Assignment,
  Security,
  People,
  Download
} from '@mui/icons-material';

interface KPIData {
  totalObservations: number;
  openObservations: number;
  overdueSLA: number;
  completedAudits: number;
  activePermits: number;
  incidentRate: number;
}

interface ChartData {
  labels: string[];
  datasets: any[];
}

const Analytics: React.FC = () => {
  const [period, setPeriod] = useState('30');
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [observationTrends, setObservationTrends] = useState<ChartData | null>(null);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [hazardAnalysis, setHazardAnalysis] = useState<any[]>([]);

  useEffect(() => {
    loadAnalyticsData();
  }, [period]);

  const loadAnalyticsData = async () => {
    try {
      const [kpiRes, trendsRes, deptRes, hazardRes] = await Promise.all([
        fetch(`/api/analytics/kpi?period=${period}`),
        fetch(`/api/analytics/observation-trends?period=${period}`),
        fetch(`/api/analytics/department-summary?period=${period}`),
        fetch(`/api/analytics/hazard-analysis?period=${period}`)
      ]);

      if (kpiRes.ok) setKpiData(await kpiRes.json());
      if (trendsRes.ok) setObservationTrends(await trendsRes.json());
      if (deptRes.ok) setDepartmentData(await deptRes.json());
      if (hazardRes.ok) setHazardAnalysis(await hazardRes.json());
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const exportReport = async () => {
    try {
      const response = await fetch(`/api/analytics/export?period=${period}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `safety-report-${period}days.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const KPICard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    trend?: number;
  }> = ({ title, value, icon, color, trend }) => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value.toLocaleString()}
            </Typography>
            {trend !== undefined && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend >= 0 ? (
                  <TrendingUp color="success" fontSize="small" />
                ) : (
                  <TrendingDown color="error" fontSize="small" />
                )}
                <Typography
                  variant="body2"
                  color={trend >= 0 ? 'success.main' : 'error.main'}
                  sx={{ ml: 0.5 }}
                >
                  {Math.abs(trend)}% vs last period
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ color: color }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Safety Analytics</Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={period}
              label="Period"
              onChange={(e) => setPeriod(e.target.value)}
            >
              <MenuItem value="7">Last 7 Days</MenuItem>
              <MenuItem value="30">Last 30 Days</MenuItem>
              <MenuItem value="90">Last 3 Months</MenuItem>
              <MenuItem value="365">Last Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={exportReport}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      {kpiData && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <KPICard
              title="Total Observations"
              value={kpiData.totalObservations}
              icon={<Assessment fontSize="large" />}
              color="primary.main"
              trend={5}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <KPICard
              title="Open Observations"
              value={kpiData.openObservations}
              icon={<Assignment fontSize="large" />}
              color="warning.main"
              trend={-2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <KPICard
              title="Overdue SLA"
              value={kpiData.overdueSLA}
              icon={<TrendingUp fontSize="large" />}
              color="error.main"
              trend={-8}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <KPICard
              title="Completed Audits"
              value={kpiData.completedAudits}
              icon={<Security fontSize="large" />}
              color="success.main"
              trend={12}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <KPICard
              title="Active Permits"
              value={kpiData.activePermits}
              icon={<Assignment fontSize="large" />}
              color="info.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <KPICard
              title="Incident Rate"
              value={kpiData.incidentRate}
              icon={<People fontSize="large" />}
              color="secondary.main"
              trend={-15}
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        {/* Department Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Department Performance
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Department</TableCell>
                      <TableCell align="right">Observations</TableCell>
                      <TableCell align="right">Compliance %</TableCell>
                      <TableCell align="right">SLA Met %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departmentData.map((dept) => (
                      <TableRow key={dept.name}>
                        <TableCell component="th" scope="row">
                          {dept.name}
                        </TableCell>
                        <TableCell align="right">{dept.observations}</TableCell>
                        <TableCell align="right">{dept.compliance}%</TableCell>
                        <TableCell align="right">{dept.slaPerformance}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Hazard Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Hazard Categories
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Hazard Type</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">% of Total</TableCell>
                      <TableCell align="right">Trend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {hazardAnalysis.map((hazard) => (
                      <TableRow key={hazard.type}>
                        <TableCell component="th" scope="row">
                          {hazard.type}
                        </TableCell>
                        <TableCell align="right">{hazard.count}</TableCell>
                        <TableCell align="right">{hazard.percentage}%</TableCell>
                        <TableCell align="right">
                          <Box display="flex" alignItems="center" justifyContent="flex-end">
                            {hazard.trend >= 0 ? (
                              <TrendingUp color="error" fontSize="small" />
                            ) : (
                              <TrendingDown color="success" fontSize="small" />
                            )}
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              {Math.abs(hazard.trend)}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;