import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Box, Typography, Card, CardActionArea, TextField, Autocomplete, FormControlLabel, Checkbox, Divider
} from '@mui/material';
import { CloseRounded, PersonRounded, BusinessRounded } from '@mui/icons-material';
import { useForm, useFormContext, Controller } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { useClientStore } from '../stores/ClientStore';
import { ClientAddSchema } from '../types/types';
import type { Client, ClientFormType } from '../types/types';
import { useCreateClient } from '../hooks/useCreateClient';
import { useEditClient } from '../hooks/useEditClient';
import { useGetProvince } from '../hooks/useGetProvince';
import { useGetDistrictsByProvince } from '../hooks/useGetDistrictsByProvince';


type Props = {
  initialData?: Client | null
  resetOnClose: () => void
}

const CLIENT_TYPES = [
  {
    value: 'individual',
    label: 'Individual',
    sub: 'A freelancer or solo person',
    icon: <PersonRounded sx={{ fontSize: 32 }} />
  },
  {
    value: 'business',
    label: 'Business',
    sub: 'A company or organization',
    icon: <BusinessRounded sx={{ fontSize: 32 }} />
  },
] as const

export const AddClientModal = ({ initialData, resetOnClose }: Props) => {
  const open = useClientStore(state => state.openModal)
  const setOpenModal = useClientStore(state => state.setOpenModal)
  const [step, setStep] = useState(0)

  const { mutate: createClient } = useCreateClient()
  const { mutate: editClient } = useEditClient()

  const { data: Provinces } = useGetProvince();

  const form = useForm<ClientFormType>({
    resolver: zodResolver(ClientAddSchema)
  })


  const selectedOfficeProvinceId = form.watch('office_address.province_id')
  const selectedBillingProvinceId = form.watch('billing_address.province_id')
  const billingIsDifferent = form.watch('billing_is_different');
  const selectedType = form.watch('client_type');
  console.log(selectedType)

  console.log('Province ids', selectedOfficeProvinceId, selectedBillingProvinceId)

  const { data: districtsByOffice } = useGetDistrictsByProvince(Number(selectedOfficeProvinceId))


  const { data: districtsByProv } = useGetDistrictsByProvince(Number(selectedBillingProvinceId))


  const handleFormClose = () => {
    setOpenModal(false)
    setStep(0)
    form.reset()
    resetOnClose()
  }

  console.log(form.formState.errors)

  const onSubmit: SubmitHandler<ClientFormType> = (data) => {
    console.log('Sumbitted data', data);
    console.log(form.formState.errors)
    if (initialData) {
      editClient({ id: initialData.id, formData: data }, {
        onSuccess: () => { toast.success('Client edited successfully.'); handleFormClose() },
        onError: () => toast.error('Error occurred on editing.')
      })
    } else {
      createClient(data, {
        onSuccess: () => { toast.success('Client created successfully.'); handleFormClose() },
        onError: () => toast.error('Error occurred on creating.')
      })
    }
  }

  return (
    <Dialog open={open} onClose={handleFormClose} maxWidth="sm" fullWidth component='form' onSubmit={form.handleSubmit(onSubmit)}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        {initialData ? 'Edit client' : 'Add client'}
        <IconButton size="small" onClick={handleFormClose}>
          <CloseRounded fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>

        <Box>
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Select the type of client you are adding.
          </Typography>


          <Box sx={{ display: 'flex', gap: 2 }}>
            {CLIENT_TYPES.map(type => {
              const isSelected = selectedType === type.value;


              return (
                <>
                  <Card
                    key={type.value}
                    variant="outlined"
                    sx={{
                      flex: 1,
                      transition: 'all .15s',
                      border: isSelected && '2px solid blue'
                    }}
                  >
                    <CardActionArea
                      sx={{ p: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}
                      onClick={() => form.setValue("client_type", type.value)}
                    >
                      <Box sx={{}}>
                        {type.icon}
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 500 }}>{type.label}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {type.sub}
                        </Typography>
                      </Box>
                    </CardActionArea>
                  </Card>

                  {/* {!!form.formState.errors.client_type && <Typography>{form.formState.errors.client_type?.message}</Typography>} */}
                </>

              )
            })}
          </Box>

        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">

          </Typography>

          <TextField
            label="Name *"
            {...form.register('name')}
            error={!!form.formState.errors.name}
            helperText={form.formState.errors.name?.message}
            fullWidth
            autoFocus
          />

          <TextField
            label="Billing name"
            {...form.register('billing_name')}
            error={!!form.formState.errors.billing_name}
            helperText={form.formState.errors.billing_name?.message}
            fullWidth
          />

          <TextField
            label="Email *"
            {...form.register('email')}
            error={!!form.formState.errors.email}
            helperText={form.formState.errors.email?.message}
            fullWidth
          />

          {/* phone */}
          <TextField
            label="Phone *"
            {...form.register('phone')}
            error={!!form.formState.errors.phone}
            helperText={form.formState.errors.phone?.message}
            fullWidth
          />

          {/* pan */}
          <TextField
            label="Pan number or company vat number"
            {...form.register('pan_number')}
            error={!!form.formState.errors.pan_number}
            helperText={form.formState.errors.pan_number?.message}
            fullWidth
          />

          {/* old address field — keep until data is migrated */}
          <TextField
            label="Address (legacy)"
            {...form.register('address')}
            error={!!form.formState.errors.address}
            helperText={form.formState.errors.address?.message}
            fullWidth
            rows={2}
          />

          {/* notes */}
          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={2}
            helperText="Private — not shown on invoices"
            {...form.register('notes')}
          />
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Typography variant="body2" color="text.secondary">
            Contact address
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Address line 1 *"
              {...form.register('office_address.address_line_1')}
              error={!!form.formState.errors.office_address?.address_line_1}
              helperText={form.formState.errors.office_address?.address_line_1?.message}
            />

            <TextField
              label="Address line 2"
              {...form.register('office_address.address_line_2')}
              error={!!form.formState.errors.office_address?.address_line_2}
              helperText={form.formState.errors.office_address?.address_line_2?.message}
            />

            <TextField
              label="City *"
              {...form.register('office_address.city')}
              error={!!form.formState.errors.office_address?.city}
              helperText={form.formState.errors.office_address?.city?.message}
            />

            <Controller // controller wrapper means telling rhf, that this field is controlled by react, not a normal input
              name='office_address.province_id'
              control={form.control}
              render={({ field }) => ( // field is obj storing value, onchange, onblur, name , ref
                <Autocomplete
                  options={Provinces ?? []}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.name} // mean showing the option name in the dropdown. if the option is object then it is required cumpolsory. Otherwise we end up with [object object] in the label.
                  value={Provinces?.find(province => province.id === field.value) || null}
                  onChange={(_, selectedOption) => {
                    console.log(selectedOption)
                    field.onChange(selectedOption?.id)
                  }}




                  renderInput={(params) => (
                    <TextField
                      label="Province"
                      {...params}
                      error={!!form.formState.errors.office_address?.province_id}
                      helperText={form.formState.errors.office_address?.province_id?.message}
                    />
                  )}
                />
              )}
            >

            </Controller>

            <Controller // controller wrapper means telling rhf, that this field is controlled by react, not a normal input
              name='office_address.district_id'
              control={form.control}
              render={({ field }) => ( // field is obj storing value, onchange, onblur, name , ref
                <Autocomplete
                  options={districtsByOffice ?? []}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => option.name} // mean showing the option name in the dropdown. if the option is object then it is required cumpolsory. Otherwise we end up with [object object] in the label.
                  value={districtsByOffice?.find(district => district.id === field.value) || null}
                  onChange={(_, selectedOption) => {
                    console.log(selectedOption)
                    field.onChange(selectedOption?.id)
                  }}




                  renderInput={(params) => (
                    <TextField
                      label="Districts"
                      {...params}
                      error={!!form.formState.errors.office_address?.district_id}
                      helperText={form.formState.errors.office_address?.district_id?.message}
                    />
                  )}
                />
              )}
            >

            </Controller>



          </Box>


          {selectedType === 'business' &&
            <>
              <Divider />

              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    {...form.register('billing_is_different')}
                  />
                }
                label={
                  <Typography variant="body2">
                    Billing address is different from office address
                  </Typography>
                }
              />

              {
                billingIsDifferent && <>
                  <Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      Billing address
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <TextField
                        label="Address line 1 *"
                        {...form.register('billing_address.address_line_1')}
                      />

                      <TextField
                        label="Address line 2"
                        {...form.register('billing_address.address_line_2')}
                      />

                      <TextField
                        label="City *"
                        {...form.register('billing_address.city')}
                      />

                      <Controller
                        name='billing_address.province_id'
                        control={form.control}
                        render={({ field }) => (

                          <Autocomplete
                            options={Provinces ?? []}
                            getOptionLabel={(option) => option.name}
                            onChange={(_, selectedVal) => field.onChange(selectedVal?.id)}
                            value={Provinces?.find(province => province.id === field.value) || null}

                            renderInput={
                              (params) => <TextField {...params} label="Provinces" />
                            }

                          >

                          </Autocomplete>
                        )



                        }

                      >

                      </Controller>


                      <Controller
                        name='billing_address.district_id'
                        control={form.control}
                        render={({ field }) => (

                          <Autocomplete
                            options={districtsByProv ?? []}
                            getOptionLabel={(option) => option.name}
                            onChange={(_, selectedVal) => field.onChange(selectedVal?.id)}
                            value={districtsByProv?.find(district => district.id === field.value) || null}

                            renderInput={
                              (params) => <TextField {...params} label="District" />
                            }

                          >

                          </Autocomplete>
                        )



                        }

                      >

                      </Controller>

                    </Box>

                  </Box>

                </>
              }
            </>}



        </Box>

      </DialogContent >

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          variant="outlined"
          color="inherit"
          type='submit'
          sx={{ color: 'text.secondary', borderColor: '#E0E0E0' }}
        >
          Submit form

        </Button>


      </DialogActions>
    </Dialog >
  )
}

