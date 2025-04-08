import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  Container,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import TimelineIcon from '@mui/icons-material/Timeline';
import RecommendIcon from '@mui/icons-material/Recommend';

const navItems = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'Products', path: '/products', icon: <SolarPowerIcon /> },
  { name: 'Energy Forecast', path: '/forecast', icon: <TimelineIcon /> },
  { name: 'Recommendations', path: '/recommendations', icon: <RecommendIcon /> },
];

function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Renewable Energy Portal
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.name} 
            component={Link} 
            to={item.path}
            selected={isActive(item.path)}
            sx={{ 
              color: isActive(item.path) ? 'primary.main' : 'text.primary',
              '&.Mui-selected': {
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
              }
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? 'primary.main' : 'text.secondary' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SolarPowerIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'text.primary',
              textDecoration: 'none',
            }}
          >
            Renewable Energy Portal
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  flexGrow: 1,
                  fontWeight: 700,
                  color: 'text.primary',
                  textDecoration: 'none',
                }}
              >
                RE Portal
              </Typography>
            </>
          ) : (
            <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  component={Link}
                  to={item.path}
                  sx={{ 
                    my: 2, 
                    mx: 1,
                    color: isActive(item.path) ? 'primary.main' : 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: isActive(item.path) ? 700 : 500,
                    '&:hover': {
                      backgroundColor: 'rgba(46, 125, 50, 0.08)',
                    }
                  }}
                  startIcon={item.icon}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </Container>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
}

export default Header; 