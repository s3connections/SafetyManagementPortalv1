import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIncidents } from '../../store/slices/incidentSlice';
import {
  Grid, Card, CardContent,
  Typography, CircularProgress
} from '@mui/material';

export default function Incidents() {
  const dispatch = useDispatch();
  const { list, status } = useSelector((s) => s.incident);

  useEffect(() => {
    dispatch(fetchIncidents());
  }, [dispatch]);

  if (status === 'loading') return <CircularProgress />;

  return (
    <Grid container spacing={2}>
      {list.map((i) => (
        <Grid item xs={12} md={6} key={i.id}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6">{i.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {i.incidentNumber}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
