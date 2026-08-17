import { useState } from 'react';
import {
  Box, Button, Typography, IconButton, Menu, MenuItem,
  Skeleton, Chip, Avatar,
} from '@mui/material';
import {
  AddOutlined,
  MoreVertRounded,
  FolderOpenOutlined,
  PersonOutlined,
  PhoneOutlined,
  LocationOnOutlined,
} from '@mui/icons-material';
import { useGetClients } from '../hooks/useGetClients';
import type { Client } from '../types/types';
import { AddClientModal } from '../components/AddClientModal';
import { useClientStore } from '../stores/ClientStore';
import { useDeleteClient } from '../hooks/useDeleteClient';
import { toast } from 'react-hot-toast';
import { useWarningDialogStore } from '../../../shared/hooks/useWarningDialogStore';
import { WarningDialog } from '../../../shared/components/WarningDialog';
import {useNavigate} from 'react-router-dom'
import { usePlanLimits } from '../../billing/hooks/usePlanLimits';


export const Clients = () => {
  const setOpenModal = useClientStore(state => state.setOpenModal);
  const navigate = useNavigate();
  const warningType = useWarningDialogStore(state => state.type);
  const setWarningType = useWarningDialogStore(state => state.setType);

  const { data: clients = [], isLoading } = useGetClients();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);


   

  const { mutate: deleteClient } = useDeleteClient();

  const handleEdit = () => {
    setOpenMenu(false);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenMenu(false);
    setMenuAnchor(null);
    setSelectedClient(null);
  };

  const handleDeleteDialog = () => {
    setWarningType('client-delete');
    setMenuAnchor(null);
    setOpenMenu(false);
  };

  const onConfirm = () => {
    if (!selectedClient?.id) return;
    deleteClient(selectedClient.id, {
      onSuccess: () => {
        toast.success('Client deleted.');
        setSelectedClient(null);
        setWarningType('none');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  const onCancel = () => setWarningType('none');

  const { canCreateClient, clientCount, plan } = usePlanLimits();

  const handleAddClient = () => {
    if (!canCreateClient) {
      toast.error(`You've reached the ${plan?.max_clients} client limit on the ${plan?.name} plan.`);
      navigate('/billing');
      return;
    }
    setOpenModal(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 500 }}>Clients</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.25 }}>
            Manage your client relationships
            {!!plan?.max_clients && ` · ${clientCount}/${plan.max_clients} clients used on the ${plan.name} plan`}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddOutlined sx={{ fontSize: 15 }} />}
          onClick={handleAddClient}
          sx={{ fontSize: 13 }}
        >
          Add client
        </Button>
      </Box>

      {/* Client list card */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {isLoading ? (
          <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {[1, 2, 3, 4].map(i => (
              <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Skeleton variant="circular" width={36} height={36} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton width="35%" height={16} />
                  <Skeleton width="55%" height={13} sx={{ mt: 0.5 }} />
                </Box>
              </Box>
            ))}
          </Box>
        ) : clients.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center', px: 2.5 }}>
            <PersonOutlined sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
            <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>
              No clients yet
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5, mb: 2 }}>
              Add your first client to get started
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddOutlined sx={{ fontSize: 15 }} />}
              onClick={handleAddClient}
              sx={{ fontSize: 13 }}
            >
              Add client
            </Button>
          </Box>
        ) : (
          clients.map((client, idx) => (
            <Box onClick={()=> navigate(`/clients/${client.id}`)}
            
            
              key={client.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2.5,
                py: 1.5,
                borderBottom: idx < clients.length - 1 ? '0.5px solid' : 'none',
                borderColor: 'divider',
                cursor: 'pointer',
                ":hover": {
                  bgcolor: 'action.hover'
                  // be clear on how the action.hover is working.
                  
                  
                }
              }}
            >
              {/* Avatar */}
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  fontSize: 13,
                  fontWeight: 500,
                  bgcolor: '#E1F5EE',
                  color: '#0F6E56',
                  flexShrink: 0,
                }}
              >
                {client.name?.charAt(0).toUpperCase()}
              </Avatar>

              {/* Name + meta */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: 'text.primary' }}>
                    {client.name}
                  </Typography>
                  {client.projects?.length > 0 && (
                    <Chip
                      icon={<FolderOpenOutlined />}
                      label={`${client.projects.length} project${client.projects.length > 1 ? 's' : ''}`}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: 11,
                        fontWeight: 500,
                        bgcolor: '#E6F1FB',
                        color: '#185FA5',
                        '& .MuiChip-label': { px: 1.25 },
                        '& .MuiChip-icon': { fontSize: 13, color: '#185FA5', ml: '6px' },
                      }}
                    />
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.25 }}>
                  {client.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PhoneOutlined sx={{ fontSize: 12, color: 'text.disabled' }} />
                      <Typography sx={{ fontSize: 12, color: 'text.secondary' }} noWrap>
                        {client.phone}
                      </Typography>
                    </Box>
                  )}
                  {client.phone && client.address && (
                    <Typography sx={{ fontSize: 12, color: 'text.disabled' }}>·</Typography>
                  )}
                  {client.address && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                      <LocationOnOutlined sx={{ fontSize: 12, color: 'text.disabled', flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 12, color: 'text.secondary' }} noWrap>
                        {client.address}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Actions */}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  setMenuAnchor(e.currentTarget);
                  setOpenMenu(true);
                  setSelectedClient(client);
                }}
                sx={{ color: 'text.disabled', flexShrink: 0 }}
              >
                <MoreVertRounded sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          ))
        )}
      </Box>

      <AddClientModal />

      <Menu
        open={openMenu}
        onClose={handleClose}
        anchorEl={menuAnchor}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{
          paper: {
            sx: {
              fontSize: 13,
              minWidth: 140,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ fontSize: 13 }}>Edit</MenuItem>
        <MenuItem
          onClick={handleDeleteDialog}
          sx={{ fontSize: 13, color: 'error.main' }}
        >
          Delete
        </MenuItem>
      </Menu>

      {warningType === 'client-delete' && (
        <WarningDialog
          handleCancel={onCancel}
          handleConfirm={onConfirm}
          message="Are you sure you want to delete this client? All linked projects will be deleted too."
          title="Delete client"
        />
      )}
    </Box>
  );
};