import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Divider, IconButton, Tooltip, useMediaQuery, useTheme,
  AppBar, Toolbar,
} from '@mui/material';
import {
  DashboardRounded, PeopleRounded, FolderRounded, ReceiptRounded,
  SettingsRounded, MenuRounded, CloseRounded, BoltRounded,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/stores/authStore';

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 72;

const navItems = [
  { label: 'Dashboard', icon: <DashboardRounded />, path: '/dashboard' },
  { label: 'Clients', icon: <PeopleRounded />, path: '/clients' },
  { label: 'Projects', icon: <FolderRounded />, path: '/projects' },
  { label: 'Invoices', icon: <ReceiptRounded />, path: '/invoices' },
  { label: 'Settings', icon: <SettingsRounded />, path: '/settings' },
];

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore(state => state.user);

  const drawerWidth = collapsed && !isMobile ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#FFFFFF' }}>
      {/* Logo */}
      <Box sx={{ px: collapsed ? 1.5 : 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: 2,
          bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <BoltRounded sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        {!collapsed && (
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.5px' }}>
            Frelio
          </Typography>
        )}
        {!isMobile && (
          <IconButton
            size="small"
            onClick={() => setCollapsed(!collapsed)}
            sx={{ ml: 'auto', color: 'text.secondary' }}
          >
            <MenuRounded fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ mx: 2, borderColor: '#F0F0F0' }} />

      {/* Nav Items */}
      <List sx={{ flex: 1, px: 1.5, pt: 1 }}>
        {navItems.map(({ label, icon, path }) => {
          const active = location.pathname === path;
          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={collapsed ? label : ''} placement="right">
                <ListItemButton
                  onClick={() => { navigate(path); if (isMobile) setMobileOpen(false); }}
                  sx={{
                    borderRadius: 2,
                    minHeight: 44,
                    px: collapsed ? 1.5 : 2,
                    bgcolor: active ? 'rgba(29,158,117,0.1)' : 'transparent',
                    color: active ? 'primary.main' : 'text.secondary',
                    '&:hover': { bgcolor: active ? 'rgba(29,158,117,0.12)' : 'rgba(0,0,0,0.04)' },
                    transition: 'all 0.15s ease',
                  }}
                >
                  <ListItemIcon sx={{
                    minWidth: collapsed ? 0 : 36,
                    color: 'inherit',
                    mr: collapsed ? 0 : 0.5,
                    '& svg': { fontSize: 22 },
                  }}>
                    {icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={label}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 2, borderColor: '#F0F0F0' }} />

      {/* User Avatar Footer */}
      <Box sx={{ px: collapsed ? 1.5 : 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
          {user?.name.slice(0, 1).toUpperCase()}
        </Avatar>
        {!collapsed && (
          <Box>
            <Typography sx={{
              textTransform:
                'capitalize',
              fontWeight: 600,
              lineHeight: 1.2,
              color: 'text.primary'
            }}  >
              {user?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              NPR Account
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{ bgcolor: '#fff', borderBottom: '1px solid #E5E7EB', zIndex: theme.zIndex.drawer + 1 }}
        >
          <Toolbar sx={{ gap: 1 }}>
            <IconButton edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ color: 'text.primary' }}>
              {mobileOpen ? <CloseRounded /> : <MenuRounded />}
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BoltRounded sx={{ color: '#fff', fontSize: 16 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', fontSize: '1rem' }}>
                Frelio
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: 'width 0.2s ease',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            borderRight: '1px solid #E5E7EB',
            overflowX: 'hidden',
            transition: 'width 0.2s ease',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          ml: 0,
          mt: isMobile ? '64px' : 0,
          p: { xs: 2, md: 3 },
          maxWidth: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;