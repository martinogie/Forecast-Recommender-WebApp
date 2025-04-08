import React, { useRef, useEffect } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  TimeScale
} from 'chart.js';
import { format } from 'date-fns';
import 'chart.js/auto';

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

function ForecastChart({ data, loading, title = 'Energy Demand Forecast', height = 400 }) {
  const chartRef = useRef(null);

  // Clean up chart instance when component unmounts
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data || !data.forecast || data.forecast.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: height }}>
        <Typography variant="body1" color="text.secondary">
          No forecast data available
        </Typography>
      </Box>
    );
  }

  // Format the dates for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, HH:mm');
  };

  // Process the data for the chart with pre-formatted dates
  const chartData = {
    // Use formatted dates as strings instead of Date objects
    labels: data.forecast.map(item => formatDate(item.ds)),
    datasets: [
      {
        label: 'Predicted Demand (kW)',
        data: data.forecast.map(item => item.yhat),
        fill: false,
        backgroundColor: '#2e7d32',
        borderColor: '#2e7d32',
        tension: 0.4
      },
      {
        label: 'Lower Bound',
        data: data.forecast.map(item => item.yhat_lower),
        fill: false,
        backgroundColor: 'rgba(46, 125, 50, 0.2)',
        borderColor: 'rgba(46, 125, 50, 0.2)',
        borderDash: [5, 5],
        pointRadius: 0,
        fill: '+1',
      },
      {
        label: 'Upper Bound',
        data: data.forecast.map(item => item.yhat_upper),
        fill: false,
        backgroundColor: 'rgba(46, 125, 50, 0.2)',
        borderColor: 'rgba(46, 125, 50, 0.2)',
        borderDash: [5, 5],
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: title
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            return context[0].label;
          },
          label: (context) => {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} kW`;
          }
        }
      }
    },
    scales: {
      x: {
        // Use category scale instead of time scale to avoid adapter issues
        type: 'category',
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Energy Demand (kW)'
        }
      }
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{title}</Typography>
        <Box sx={{ height: height }}>
          <Line data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
}

export default ForecastChart; 