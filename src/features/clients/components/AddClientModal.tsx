import { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, IconButton, Stepper, Step, StepLabel
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { useClientStore } from '../stores/ClientStore';
import { ClientAddSchema } from '../types/types';
import type { Client, ClientFormType } from '../types/types';
import { useCreateClient } from '../hooks/useCreateClient';
import { useEditClient } from '../hooks/useEditClient';
import { StepType } from './steps/StepType';
import { StepDetails } from './steps/StepDetails';
import { StepAddress } from './steps/StepAddress';

const STEPS = ['Type', 'Details', 'Address']

type Props = {
  initialData?: Client | null
  resetOnClose: () => void
}

export const AddClientModal = ({ initialData, resetOnClose }: Props) => {
  const open = useClientStore(state => state.openModal)
  const setOpenModal = useClientStore(state => state.setOpenModal)
  const [step, setStep] = useState(0)

  const { mutate: createClient } = useCreateClient()
  const { mutate: editClient } = useEditClient()

  const form = useForm<ClientFormType>({
    resolver: zodResolver(ClientAddSchema),
    defaultValues: {
      client_type: undefined,
      name: '',
      phone: '',
      email: '',
      address: '',
      billing_name: '',
      pan_number: '',
      currency: 'NPR',
      notes: '',
      billing_is_different: false,
      office_address: {
        address_line_1: '',
        address_line_2: '',
        city: '',
        province_id: '',
        district_id: '',
      },
    }
  })

  const handleFormClose = () => {
    setOpenModal(false)
    setStep(0)
    form.reset()
    resetOnClose()
  }

  // populate form when editing
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        phone: initialData.phone,
        email: initialData.email,
        address: initialData.address ?? '',
        client_type: initialData.client_type,
        billing_name: initialData.billing_name ?? '',
        pan_number: initialData.pan_number ?? '',
        currency: initialData.currency,
        notes: initialData.notes ?? '',
      })
    }
  }, [initialData, form])

  const onSubmit = (data: ClientFormType) => {
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
    <Dialog open={open} onClose={handleFormClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        {initialData ? 'Edit client' : 'Add client'}
        <IconButton size="small" onClick={handleFormClose}>
          <CloseRounded fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* step indicator */}
      <Stepper activeStep={step} sx={{ px: 3, pb: 2 }}>
        {STEPS.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* FormProvider makes form available to all steps */}
      <FormProvider {...form}>
        <DialogContent sx={{ pt: 1 }}>
          {step === 0 && <StepType />}
          {step === 1 && <StepDetails />}
          {step === 2 && <StepAddress />}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ color: 'text.secondary', borderColor: '#E0E0E0' }}
            onClick={step === 0 ? handleFormClose : () => setStep(s => s - 1)}
          >
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>

          {step < 2
            ? <NextButton step={step} onNext={() => setStep(s => s + 1)} />
            : <Button variant="contained" onClick={form.handleSubmit(onSubmit)}>
                {initialData ? 'Save changes' : 'Submit'}
              </Button>
          }
        </DialogActions>
      </FormProvider>
    </Dialog>
  )
}

// validates current step fields before advancing
function NextButton({ step, onNext }: { step: number, onNext: () => void }) {
  const { trigger, watch } = useFormContext<ClientFormType>()  // add this import
  const clientType = watch('client_type')

  const handleNext = async () => {
    let valid = false

    if (step === 0) {
      valid = await trigger('client_type')
    }
    if (step === 1) {
      const fields: (keyof ClientFormType)[] = ['name', 'email', 'phone']
      if (clientType === 'business') fields.push('billing_name')
      valid = await trigger(fields)
    }

    if (valid) onNext()
  }

  return (
    <Button variant="contained" onClick={handleNext}>
      Next
    </Button>
  )
}