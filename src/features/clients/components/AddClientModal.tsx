import { useEffect } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Box, Typography, TextField, FormControlLabel, Checkbox, MenuItem
} from '@mui/material';
import {
  CloseRounded, PersonOutlined, BusinessOutlined,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useClientStore } from '../stores/ClientStore';
import { ClientAddSchema } from '../types/types';
import type { Client, ClientFormType } from '../types/types';
import { useCreateClient } from '../hooks/useCreateClient';
import { useEditClient } from '../hooks/useEditClient';
import { useGetProvince } from '../hooks/useGetProvince';
import { useGetDistrictsByProvince } from '../hooks/useGetDistrictsByProvince';

// ── types ─────────────────────────────────────────────────────────────────────

type Props = {
  initialData?: Client | null;
  resetOnClose?: () => void;
};

// ── client type selector cards ────────────────────────────────────────────────

const CLIENT_TYPES = [
  {
    value: 'individual' as const,
    label: 'Individual',
    sub: 'A freelancer or solo person',
    icon: <PersonOutlined sx={{ fontSize: 20 }} />,
  },
  {
    value: 'business' as const,
    label: 'Business',
    sub: 'A company or organization',
    icon: <BusinessOutlined sx={{ fontSize: 20 }} />,
  },
];

// ── section label ─────────────────────────────────────────────────────────────

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Typography
    sx={{
      fontSize: 11,
      fontWeight: 500,
      color: 'text.disabled',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      mb: 1.5,
    }}
  >
    {children}
  </Typography>
);


const fieldProps = {
  size: 'small' as const,
  fullWidth: true,
  slotProps: {
    inputLabel: { sx: { fontSize: 13 } },
    input: { sx: { fontSize: 13 } },
  },
};



export const AddClientModal = ({ initialData, resetOnClose }: Props) => {
  const open = useClientStore(state => state.openModal);
  const setOpenModal = useClientStore(state => state.setOpenModal);

  const { mutate: createClient } = useCreateClient();
  const { mutate: editClient } = useEditClient();
  const { data: provinces } = useGetProvince();

  const form = useForm<ClientFormType>({
    resolver: zodResolver(ClientAddSchema),
    defaultValues: {
      currency: 'NPR',
      billing_is_different: false,

      office_address: {
        address_line_1: '',
        address_line_2: '',
        city: '',
        province_id: 0,
        district_id: 0,
      },

      billing_address: undefined,
      billing_name: '',
      pan_number: '',
      notes: '',
    },
  })

  const selectedType = form.watch('client_type');
  const selectedOfficeProvinceId = form.watch('office_address.province_id');
  const selectedBillingProvinceId = form.watch('billing_address.province_id');
  const billingIsDifferent = form.watch('billing_is_different');

  const { data: districtsByOffice } = useGetDistrictsByProvince(selectedOfficeProvinceId);
  const { data: districtsByBilling } = useGetDistrictsByProvince(Number(selectedBillingProvinceId));


  const handleFormClose = () => {
    setOpenModal(false);
    form.reset();
  };

  const onSubmit: SubmitHandler<ClientFormType> = (data) => {
    if (initialData) {
      editClient({ id: initialData.id, formData: data }, {
        onSuccess: () => { toast.success('Client updated.'); handleFormClose(); },
        onError: () => toast.error('Error updating client.'),
      });
    } else {
      createClient(data, {
        onSuccess: () => { toast.success('Client created.'); handleFormClose(); },
        onError: () => toast.error('Error creating client.'),
      });
    }
  };

  const isEdit = Boolean(initialData);

  // this useEffect fix is for the error faced during client creation when going through business type to individual, the billing address was asking for validation error.
  useEffect(() => {
    if (selectedType === 'individual') {
      form.setValue('billing_is_different', false);
      form.setValue('billing_address', undefined);
    }

  }, [selectedType])

  return (
    <Dialog
      open={open}
      onClose={handleFormClose}
      maxWidth="sm"
      fullWidth
      component="form"
      onSubmit={form.handleSubmit(onSubmit)}
      slotProps={{
        paper: {
          sx: {
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          },
        },
      }}
    >
      {/* Title */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          pt: 2.5,
          pb: 0,
        }}
      >
        <Typography sx={{ fontSize: 15, fontWeight: 500 }}>
          {isEdit ? 'Edit client' : 'New client'}
        </Typography>
        <IconButton size="small" onClick={handleFormClose} sx={{ color: 'text.disabled' }}>
          <CloseRounded sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, pt: 2, pb: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

          {/* ── Client type ── */}
          <Box>
            <SectionLabel>Client type</SectionLabel>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {CLIENT_TYPES.map(type => {
                const isSelected = selectedType === type.value;
                return (
                  <Box
                    key={type.value}
                    onClick={() => {
                      form.setValue('client_type', type.value)
                      form.trigger('client_type')
                    }}
                    sx={{
                      flex: 1,
                      border: '1px solid',
                      borderColor: isSelected ? '#0F6E56' : 'divider',
                      borderRadius: 2,
                      p: 2,
                      cursor: 'pointer',
                      bgcolor: isSelected ? '#E1F5EE' : 'transparent',
                      transition: 'all 0.12s ease',
                      '&:hover': {
                        bgcolor: isSelected ? '#E1F5EE' : 'action.hover',
                        borderColor: isSelected ? '#0F6E56' : 'text.disabled',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1.5,
                        bgcolor: isSelected ? '#0F6E56' : 'action.hover',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? '#fff' : 'text.disabled',
                        mb: 1,
                      }}
                    >
                      {type.icon}
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: isSelected ? '#0F6E56' : 'text.primary' }}>
                      {type.label}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: 'text.secondary', mt: 0.25 }}>
                      {type.sub}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            {form.formState.errors.client_type && (
              <Typography sx={{
                fontSize: 12, color: 'error.main', mt: 0.5
              }}>{form.formState.errors.client_type.message}</Typography>
            )}
          </Box>

          {/* ── Basic info ── */}
          <Box>
            <SectionLabel>Basic info</SectionLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                label="Full name"
                {...form.register('name')}
                error={!!form.formState.errors.name}
                helperText={form.formState.errors.name?.message}
                autoFocus
                {...fieldProps}
              />
              <TextField
                label="Billing name"
                {...form.register('billing_name')}
                error={!!form.formState.errors.billing_name}
                helperText={form.formState.errors.billing_name?.message}
                {...fieldProps}
              />
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <TextField
                  label="Email"
                  {...form.register('email')}
                  error={!!form.formState.errors.email}
                  helperText={form.formState.errors.email?.message}
                  {...fieldProps}
                />
                <TextField
                  label="Phone"
                  {...form.register('phone')}
                  error={!!form.formState.errors.phone}
                  helperText={form.formState.errors.phone?.message}
                  {...fieldProps}
                />
              </Box>
              <TextField
                label="PAN / VAT number"
                {...form.register('pan_number')}
                error={!!form.formState.errors.pan_number}
                helperText={form.formState.errors.pan_number?.message}
                {...fieldProps}
              />
              <TextField
                label="Notes"
                {...form.register('notes')}
                multiline
                rows={2}
                {...fieldProps}
                slotProps={{
                  inputLabel: { sx: { fontSize: 13 } },
                  input: { sx: { fontSize: 13 } },
                  formHelperText: { sx: { fontSize: 11 } },
                }}
                helperText="Private — not shown on invoices"
              />
            </Box>
          </Box>

          {/* ── Office address ── */}
          <Box>
            <SectionLabel>Office address</SectionLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                label="Address line 1"
                {...form.register('office_address.address_line_1')}
                error={!!form.formState.errors.office_address?.address_line_1}
                helperText={form.formState.errors.office_address?.address_line_1?.message}
                {...fieldProps}
              />
              <TextField
                label="Address line 2"
                {...form.register('office_address.address_line_2')}
                error={!!form.formState.errors.office_address?.address_line_2}
                helperText={form.formState.errors.office_address?.address_line_2?.message}
                {...fieldProps}
              />
              <TextField
                label="City"
                {...form.register('office_address.city')}
                error={!!form.formState.errors.office_address?.city}
                helperText={form.formState.errors.office_address?.city?.message}
                {...fieldProps}
              />
              <Box sx={{ display: 'flex', gap: 1.5 }}>

                <Controller
                  name="office_address.province_id"
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Provinces"
                      {...field}
                      error={!!form.formState.errors.office_address?.province_id}
                      helperText={form.formState.errors.office_address?.province_id?.message}
                      sx={{ flex: 1 }}
                    >
                      {provinces?.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <Controller
                  name="office_address.district_id"
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Districts"
                      {...field} // field attaches ref, onblur, onchange, value, and name attribute to the input
                      error={!!form.formState.errors.office_address?.district_id}
                      helperText={form.formState.errors.office_address?.district_id?.message}
                      sx={{ flex: 1 }}
                    >
                      {districtsByOffice?.map((p) => (
                        <MenuItem key={p.id} value={p.id}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

              </Box>
            </Box>
          </Box>

          {/* ── Billing address (business only) ── */}
          {selectedType === 'business' && (
            <Box>
              <Box sx={{ borderTop: '0.5px solid', borderColor: 'divider', pt: 2.5 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      {...form.register('billing_is_different')}
                      sx={{ '& .MuiSvgIcon-root': { fontSize: 16 } }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13, color: 'text.primary' }}>
                      Billing address differs from office address
                    </Typography>
                  }
                />
              </Box>

              {billingIsDifferent && (
                <Box sx={{ mt: 2 }}>
                  <SectionLabel>Billing address</SectionLabel>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <TextField
                      label="Address line 1"
                      {...form.register('billing_address.address_line_1')}
                      {...fieldProps}
                       error={!!form.formState.errors.billing_address?.address_line_1}
                            helperText={form.formState.errors.billing_address?.address_line_1?.message}
                    />
                    <TextField
                      label="Address line 2"
                      {...form.register('billing_address.address_line_2')}
                      {...fieldProps}
                       error={!!form.formState.errors.billing_address?.address_line_2}
                            helperText={form.formState.errors.billing_address?.address_line_2?.message}
                    />
                    <TextField
                      label="City"
                      {...form.register('billing_address.city')}
                      {...fieldProps}
                      error={!!form.formState.errors.billing_address?.city}
                      helperText={form.formState.errors.billing_address?.city?.message}

                      
                      
                    />
                    <Box sx={{ display: 'flex', gap: 1.5 }}>


                      <Controller
                        name='billing_address.province_id'
                        control={form.control}
                        render={({ field }) => (
                          <TextField
                            select
                            label="Select province"
                            {...field}
                            sx={{ flex: 1 }}
                            error={!!form.formState.errors.billing_address?.province_id}
                            helperText={form.formState.errors.billing_address?.province_id?.message}
                          >
                            {provinces?.map(p =>
                              <MenuItem key={p.id} value={p.id}>
                                {p.name}
                              </MenuItem>
                            )}
                          </TextField>

                        )}
                      />


                      <Controller
                        name='billing_address.district_id'
                        control={form.control}
                        render={({ field }) => (
                          <TextField
                            select
                            label="Select districts"
                            sx={{ flex: 1 }}
                            {...field}
                             error={!!form.formState.errors.billing_address?.district_id}
                            helperText={form.formState.errors.billing_address?.district_id?.message}
                          >
                            {districtsByBilling?.map(d =>
                              <MenuItem
                                value={d.id}
                                key={d.id}
                              >{d.name}</MenuItem>)}

                          </TextField>
                        )}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}

        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 2.5,
          py: 2,
          gap: 1,
          borderTop: '0.5px solid',
          borderColor: 'divider',
          mt: 2,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleFormClose}
          sx={{ fontSize: 13, color: 'text.secondary', borderColor: 'divider' }}
        >
          Cancel
        </Button>
        <Button variant="contained" type="submit" sx={{ fontSize: 13 }}>
          {isEdit ? 'Save changes' : 'Create client'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};