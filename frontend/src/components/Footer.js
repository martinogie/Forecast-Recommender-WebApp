import React from 'react';
import { Box, Container, Typography, Link, Grid, Divider } from '@mui/material';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import { Link as RouterLink } from 'react-router-dom';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: 'white',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SolarPowerIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" color="text.primary" gutterBottom>
                Renewable Energy Portal
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Your comprehensive resource for renewable energy products, 
              personalized recommendations, and energy demand forecasting.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2" component={RouterLink} to="/" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Home
            </Typography>
            <Typography variant="body2" component={RouterLink} to="/products" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Products
            </Typography>
            <Typography variant="body2" component={RouterLink} to="/forecast" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Energy Forecast
            </Typography>
            <Typography variant="body2" component={RouterLink} to="/recommendations" color="text.secondary" display="block">
              Recommendations
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Typography variant="body2" color="text.secondary" component="a" href="https://www.energy.gov/eere/renewable-energy" target="_blank" rel="noopener noreferrer" display="block" sx={{ mb: 1 }}>
              U.S. Department of Energy
            </Typography>
            <Typography variant="body2" color="text.secondary" component="a" href="https://www.nrel.gov/" target="_blank" rel="noopener noreferrer" display="block" sx={{ mb: 1 }}>
              National Renewable Energy Laboratory
            </Typography>
            <Typography variant="body2" color="text.secondary" component="a" href="https://www.irena.org/" target="_blank" rel="noopener noreferrer" display="block">
              International Renewable Energy Agency
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ mt: 4, mb: 4 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {new Date().getFullYear()}
          {' Renewable Energy Portal. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer; 