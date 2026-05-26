import React, { useState } from 'react';
import {
  Box, Button, Typography, Card, CardContent, List, ListItem,
  ListItemText, ListItemAvatar, Avatar, IconButton, Menu, MenuItem,
  Skeleton, Divider, Chip,
} from '@mui/material';
import {
  AddRounded, MoreVertRounded, PeopleRounded, FolderRounded,
} from '@mui/icons-material';
import { useGetClients } from '../hooks/useGetClients';
import type { Client } from '../types/types';
import { AddClientModal } from '../components/AddClientModal';
import { useClientStore } from '../stores/ClientStore';
import { useDeleteClient } from '../hooks/useDeleteClient';
import { toast } from 'react-hot-toast'
import { useWarningDialogStore } from '../../../shared/hooks/useWarningDialogStore';
import { WarningDialog } from '../../../shared/components/WarningDialog';


export const Clients = () => {
  const open = useClientStore(state => state.openModal)
  const setOpenModal = useClientStore(state => state.setOpenModal)

  const warningType = useWarningDialogStore(state => state.type)
  const setWarningType = useWarningDialogStore(state => state.setType)

  const { data: clients = [], isLoading } = useGetClients();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [openMenu, setOpenMenu] = useState(false);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { mutate: deleteClient } = useDeleteClient()
  console.log(selectedClient)

  const handleEdit = () => {
    setOpenMenu(false)
    setOpenModal(true);
  }

  const handleClose = () => {
    setOpenMenu(false);
    setMenuAnchor(null);
    setSelectedClient(null);
  }

  const handleDeleteDialog = () => {
    setWarningType('client-delete')
    setMenuAnchor(null)
    setOpenMenu(false)
  }

  const onConfirm = () => {
    if (!selectedClient?.id) return;
    deleteClient(selectedClient.id, {
      onSuccess: () => {
        toast.success('Client deleted successfully.')
        setSelectedClient(null);
        setWarningType('none')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  const onCancel = () => {
    setWarningType('none')
  }


  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Clients</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
            Manage your client relationships
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddRounded />}
          onClick={() => {
            setOpenModal(true)
          }}
          sx={{
            cursor: 'pointer'
          }}


        >
          Add client
        </Button>
      </Box>

      <Card elevation={0}>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[1, 2, 3, 4].map(i => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                  <Skeleton variant="circular" width={44} height={44} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton width="40%" height={20} />
                    <Skeleton width="60%" height={16} />
                  </Box>
                </Box>
              ))}
            </Box>
          ) : clients.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <PeopleRounded sx={{ fontSize: 52, color: '#E0E0E0', mb: 1.5 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "text.secondary" }}>No clients yet</Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5, mb: 2 }}>
                Add your first client to get started
              </Typography>
              <Button variant="contained" startIcon={<AddRounded />} onClick={() => setOpenModal(true)}>
                Add client
              </Button>
            </Box>
          ) : (
            <List disablePadding>
              {clients.map((client, idx) => (
                <React.Fragment key={client.id}>
                  <ListItem
                    sx={{ px: 2.5, py: 1.5 }}
                    secondaryAction={
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          setMenuAnchor(e.currentTarget)
                          setOpenMenu(true)
                          setSelectedClient(client)
                        }}
                      >
                        <MoreVertRounded fontSize="small" />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'rgba(29,158,117,0.12)', color: 'primary.main', fontWeight: 700 }}>
                        {client.name?.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{client.name}</Typography>
                          {client.projects?.length > 0 && (
                            <Chip
                              icon={<FolderRounded sx={{ fontSize: '14px !important' }} />}
                              label={`${client.projects.length} projects`}
                              size="small"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      }
                      secondary={`${client.phone} · ${client.address}`}
                      slotProps={{
                        secondary: {
                          variant: 'caption', noWrap: true
                        }
                      }}
                    // secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
                    />
                  </ListItem>
                  {idx < clients.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {open && <AddClientModal initialData={selectedClient} resetOnClose={handleClose} />}

      {/* Context Menu */}
      <Menu
        open={openMenu}
        onClose={handleClose}
        anchorEl={menuAnchor}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteDialog}
        >
          Delete
        </MenuItem>
      </Menu>

      {warningType === 'client-delete' && <WarningDialog handleCancel={onCancel} handleConfirm={onConfirm} message='Are you sure u want to delete this client? All linked projects related to this client will be deleted too.' title='Delete client' />}
    </Box>
  );
};
