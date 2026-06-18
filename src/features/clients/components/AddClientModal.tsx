import { useEffect, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Box, Typography, Stepper, Step, StepLabel
} from '@mui/material';
import {
  CloseRounded,
} from '@mui/icons-material';
import { useForm, FormProvider } from 'react-hook-form';
import type { SubmitHandler, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { useClientStore } from '../stores/ClientStore';
import { ClientAddSchema } from '../types/types';
import type { Client, ClientFormType } from '../types/types';
import { useCreateClient } from '../hooks/useCreateClient';
import { useEditClient } from '../hooks/useEditClient';
import { StepType } from './steps/StepType';
import { StepDetails } from './steps/StepDetails';
import { StepAddress } from './steps/StepAddress';

// ── types ─────────────────────────────────────────────────────────────────────

type Props = {
  initialData?: Client | null;
  resetOnClose?: () => void;
};


const STEPS = ['Type', 'Basic Info', 'Address']

const VALIDATION_STEP_FIELDS: Record<number, Path<ClientFormType>[]> = {
  0: ['client_type'],
  1: ['name', 'billing_name', 'email', 'phone', 'pan_number'],
  2: ['office_address.address_line_1', 'office_address.address_line_2', 'office_address.city', 'office_address.province_id', 'office_address.district_id']
};



export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
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


export const AddClientModal = ({ initialData }: Props) => {
  const open = useClientStore(state => state.openModal);
  const setOpenModal = useClientStore(state => state.setOpenModal);

  const { mutate: createClient } = useCreateClient();
  const { mutate: editClient } = useEditClient();

  const [activeStep, setActiveStep] = useState(0)

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
  const billingIsDifferent = form.watch('billing_is_different')


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


  const validateSteps = async()=> {
    const isValid = await form.trigger(VALIDATION_STEP_FIELDS[activeStep as keyof typeof VALIDATION_STEP_FIELDS]);
    if (isValid) setActiveStep(prev=> prev+1);

  }

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (selectedType === 'individual') {
      form.setValue('billing_is_different', false);
      form.setValue('billing_address', undefined);
    }

  }, [selectedType])


  useEffect(()=> {
    if(!billingIsDifferent){
      form.setValue('billing_address', undefined)
      form.clearErrors('billing_address')
    }
  }, [billingIsDifferent])

  return (
    <FormProvider {...form}>
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
          <Stepper sx={{ py: 2 }} activeStep={activeStep}>
            {STEPS.map(step =>
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>)}
          </Stepper>


          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>

            {/* ── Client type ── */}
            {activeStep === 0 && <StepType />}
            {/* ── Basic info ── */}
            {activeStep === 1 && <StepDetails />}
            {/* ── Office address ── */}
            {activeStep === 2 && <StepAddress />}


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

          {activeStep !== 0 && <Button variant='contained' sx={{ fontSize: 13 }} onClick={()=> setActiveStep(prev=> prev-1)}>Back</Button>}

          {activeStep !== STEPS.length - 1 && <Button variant='contained' sx={{ fontSize: 13 }} onClick={validateSteps} >Next step</Button>}

          {activeStep === STEPS.length - 1 && <Button variant="contained" type="submit" sx={{ fontSize: 13 }}>
            {isEdit ? 'Save changes' : 'Create client'}
          </Button>}
        </DialogActions>
      </Dialog>
    </FormProvider>

  );
};