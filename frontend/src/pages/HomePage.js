import React from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  CardActionArea
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import WindPowerIcon from '@mui/icons-material/Air';
import TimelineIcon from '@mui/icons-material/Timeline';
import RecommendIcon from '@mui/icons-material/Recommend';

function HomePage() {
  const navigate = useNavigate();

  // Features for the feature section
  const features = [
    { 
      title: 'Solar Energy', 
      description: 'Discover high-efficiency solar panels, inverters, and complete solar energy systems for your home or business.',
      icon: <SolarPowerIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
      action: () => navigate('/products?category=solar')
    },
    { 
      title: 'Wind Energy', 
      description: 'Explore our selection of wind turbines and generators designed for residential and commercial applications.',
      icon: <WindPowerIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      action: () => navigate('/products?category=wind')
    },
    { 
      title: 'Energy Forecasting', 
      description: 'Use our advanced energy demand forecasting tool to optimize your energy usage and reduce costs.',
      icon: <TimelineIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      action: () => navigate('/forecast')
    },
    { 
      title: 'Personalized Recommendations', 
      description: 'Get tailored renewable energy product recommendations based on your needs and preferences.',
      icon: <RecommendIcon sx={{ fontSize: 60, color: 'secondary.main' }} />,
      action: () => navigate('/recommendations')
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          bgcolor: 'background.paper',
          pt: 8,
          pb: 6,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(https://source.unsplash.com/1600x900/?solar,renewable)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Renewable Energy Portal
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary" paragraph>
            Discover the best renewable energy products, get personalized recommendations,
            and forecast your energy demand to optimize your renewable energy solutions.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => navigate('/products')}
            >
              Explore Products
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              onClick={() => navigate('/forecast')}
            >
              Energy Forecasting
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h4" align="center" color="text.primary" gutterBottom>
          Our Features
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Everything you need to transition to renewable energy and optimize your usage
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardActionArea onClick={feature.action} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
                    {feature.icon}
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography gutterBottom variant="h5" component="h2" align="center">
                      {feature.title}
                    </Typography>
                    <Typography align="center" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.light', py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" color="background.paper" gutterBottom>
            Ready to Switch to Renewable Energy?
          </Typography>
          <Typography variant="body1" align="center" color="background.paper" paragraph>
            Get started with our personalized recommendation system to find the perfect renewable energy solutions for your needs.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              onClick={() => navigate('/recommendations')}
            >
              Get Recommendations
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage; 