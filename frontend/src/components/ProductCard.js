import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons for different energy categories
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import WindPowerIcon from '@mui/icons-material/Air';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import WaterIcon from '@mui/icons-material/Water';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';

function ProductCard({ product, similarityScore, predictedRating }) {
  const navigate = useNavigate();

  // Get the appropriate icon based on product category
  const getCategoryIcon = () => {
    switch (product.category) {
      case 'solar':
        return <SolarPowerIcon />;
      case 'wind':
        return <WindPowerIcon />;
      case 'storage':
        return <BatteryFullIcon />;
      case 'hydro':
        return <WaterIcon />;
      case 'biomass':
        return <LocalFireDepartmentIcon />;
      case 'efficiency':
        return <EnergySavingsLeafIcon />;
      default:
        return <EnergySavingsLeafIcon />;
    }
  };

  // Format category for display
  const formatCategory = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Calculate efficiency percentage for display
  const efficiencyPercentage = Math.round(product.efficiency * 100);

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Chip 
            icon={getCategoryIcon()} 
            label={formatCategory(product.category)} 
            color={product.category === 'solar' ? 'secondary' : 'primary'} 
            size="small" 
            sx={{ borderRadius: '4px' }}
          />
          {(similarityScore || predictedRating) && (
            <Box>
              {similarityScore && (
                <Chip 
                  label={`${Math.round(similarityScore * 100)}% Similar`} 
                  size="small" 
                  variant="outlined" 
                  sx={{ borderRadius: '4px' }}
                />
              )}
              {predictedRating && (
                <Rating 
                  value={predictedRating} 
                  precision={0.5} 
                  size="small" 
                  readOnly 
                />
              )}
            </Box>
          )}
        </Box>
        
        <Typography variant="h6" component="div" gutterBottom>
          {product.name}
        </Typography>
        
        <Box sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Efficiency: {efficiencyPercentage}%
          </Typography>
          <Typography variant="h6" color="primary.main">
            ${product.price}
          </Typography>
        </Box>
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          color="primary" 
          onClick={() => navigate(`/products/${product.id}`)}
        >
          View Details
        </Button>
        <Button 
          size="small" 
          variant="contained" 
          color="primary"
          sx={{ ml: 'auto' }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}

export default ProductCard; 