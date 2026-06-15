import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, IconButton, Tooltip, useMediaQuery, useTheme,
  AppBar, Toolbar,
} from '@mui/material';
import {
  DashboardOutlined, PersonOutlined, FolderOpenOutlined, ReceiptOutlined,
  SettingsOutlined, MenuRounded, CloseRounded, BoltRounded,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/stores/authStore';

const DRAWER_WIDTH = 232;
const COLLAPSED_WIDTH = 64;

const navItems = [
  { label: 'Dashboard', icon: <DashboardOutlined />, path: '/dashboard' },
  { label: 'Clients',   icon: <PersonOutlined />,   path: '/clients' },
  { label: 'Projects',  icon: <FolderOpenOutlined />, path: '/projects' },
  { label: 'Invoices',  icon: <ReceiptOutlined />,   path: '/invoices' },
  { label: 'Settings',  icon: <SettingsOutlined />,  path: '/settings' },
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
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      {/* Logo row */}
      <Box
        sx={{
          px: collapsed ? 1.5 : 2.5,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minHeight: 56,
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            borderRadius: 1.5,
            bgcolor: '#0F6E56',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <BoltRounded sx={{ color: '#fff', fontSize: 17 }} />
        </Box>

        {!collapsed && (
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: 'text.primary', letterSpacing: '-0.3px', flex: 1 }}>
            Frelio
          </Typography>
        )}

        {!isMobile && (
          <IconButton
            size="small"
            onClick={() => setCollapsed(!collapsed)}
            sx={{ color: 'text.disabled', ml: collapsed ? 'auto' : 0, p: 0.5 }}
          >
            <MenuRounded sx={{ fontSize: 17 }} />
          </IconButton>
        )}
      </Box>

      {/* Divider */}
      <Box sx={{ mx: 2, borderBottom: '0.5px solid', borderColor: 'divider' }} />

      {/* Nav items */}
      <List sx={{ flex: 1, px: 1, pt: 1, pb: 1 }}>
        {navItems.map(({ label, icon, path }) => {
          const active = location.pathname === path;
          return (
            <ListItem key={path} disablePadding sx={{ mb: 0.25 }}>
              <Tooltip title={collapsed ? label : ''} placement="right" slotProps={{ tooltip: { sx: { fontSize: 12 } } }}>
                <ListItemButton
                  onClick={() => {
                    navigate(path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: 1.5,
                    minHeight: 38,
                    px: collapsed ? 1.25 : 1.5,
                    bgcolor: active ? '#E1F5EE' : 'transparent',
                    color: active ? '#0F6E56' : 'text.secondary',
                    '&:hover': {
                      bgcolor: active ? '#E1F5EE' : 'action.hover',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 32,
                      color: 'inherit',
                      '& svg': { fontSize: 18 },
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={label}
                      slotProps={{
                        primary: {
                          sx: {
                            fontSize: 13,
                            fontWeight: active ? 500 : 400,
                            color: 'inherit',
                          },
                        },
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Divider */}
      <Box sx={{ mx: 2, borderBottom: '0.5px solid', borderColor: 'divider' }} />

      {/* User footer */}
      <Box
        sx={{
          px: collapsed ? 1.25 : 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: '#E1F5EE',
            color: '#0F6E56',
            fontSize: 12,
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>

        {!collapsed && (
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'text.primary', lineHeight: 1.3 }} noWrap>
              {user?.name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: 'text.disabled' }} noWrap>
              Frelio account
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
          sx={{
            bgcolor: 'background.default',
            borderBottom: '0.5px solid',
            borderColor: 'divider',
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ gap: 1, minHeight: '52px !important' }}>
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ color: 'text.secondary' }}
            >
              {mobileOpen
                ? <CloseRounded sx={{ fontSize: 18 }} />
                : <MenuRounded sx={{ fontSize: 18 }} />
              }
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: 1.5,
                  bgcolor: '#0F6E56',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BoltRounded sx={{ color: '#fff', fontSize: 15 }} />
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary' }}>
                Frelio
              </Typography>
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? mobileOpen : true}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: 'width 0.15s ease',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 'none',
            borderRight: '0.5px solid',
            borderColor: 'divider',
            overflowX: 'hidden',
            transition: 'width 0.15s ease',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Page content */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          mt: isMobile ? '52px' : 0,
          p: { xs: 2, md: 3 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;