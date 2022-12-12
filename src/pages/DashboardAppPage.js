
import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
// sections
import {
  AppCurrentVisits,
  AppWidgetSummary,
  AppConversionRates,
} from '../sections/@dashboard/app';
import httpClient from '../utils/httpClient';


// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();
  const [count, setCount] = useState(0);
  const [tp, setTp] = useState(0);
  const [fp, setFp] = useState(0);
  const [tn, setTn] = useState(0);
  const [fn, setFn] = useState(0);

  const accuracy = useMemo(() =>  ((tp + tn) / (tp+fp+fn+tn)) * 100, [tp, fp, tn, fn])
  const precision = useMemo(() =>  ((tp) / (tp+fp)) * 100, [tp, fp])
  const recall = useMemo(() =>  ((tp) / (tp+fn)) * 100, [tp, fn])
  const f1score = useMemo(() =>  ((2 * (recall/100) * (precision/100)) / ((recall/100)+(precision/100))) * 100, [recall, precision])


  useEffect(() => {
    fetchStatistic()
  }, []);

  const fetchStatistic = async () => {
    const response = await httpClient.get('/presence/statistic')
    setTp(response.data.data.truePositiveCount)
    setFp(response.data.data.falsePositiveCount)
    setTn(response.data.data.trueNegativeCount)
    setFn(response.data.data.falseNegativeCount)
  }

  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="True Positive" total={tp} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="False Positive" total={fp} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="True Negative" total={tn} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="False Negative" total={fn} color="error" icon={'ant-design:bug-filled'} />
          </Grid>


          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Current Visits"
              chartData={[
                { label: 'True Positive', value: tp },
                { label: 'False Positive', value: fp },
                { label: 'True Negative', value: tn },
                { label: 'False Negative', value: fn },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates
              title="Confusion Calculation"
              subheader=""
              chartData={[
                { label: 'Accuracy', value: accuracy },
                { label: 'Precision', value: precision },
                { label: 'Recall', value: recall },
                { label: 'F1-Score', value: f1score },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
