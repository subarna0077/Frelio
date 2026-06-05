import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../lib/supabase';
import { type ClientFormType } from '../types/types';
import { useAuthStore } from '../../auth/stores/authStore'
import { createAddress } from '../api/createAddress';

export const useCreateClient = () => {
  const queryClient = useQueryClient()
  const user = useAuthStore(state => state.user)

  const createClient = async (form: ClientFormType) => {
    const { province_id, ...officePayload } = form.office_address;

    const officeAddress = await createAddress(officePayload);

    let billingAddress = null
    if (form.billing_is_different && form.billing_address) {
      const { province_id: _, ...billingPayload } = form.billing_address;
      billingAddress = await createAddress(billingPayload)
    }



    const clientInsertData = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      client_type: form.client_type,
      currency: form.currency,
      notes: form.notes,
      pan_number: form.pan_number,
      billing_name: form.billing_name,
      address_id: officeAddress.id,
      billing_address_id: billingAddress?.id,
      user_id: user?.id,
    }

    const { data: client, error: clientErr } = await supabase
      .from('clients')
      .insert(clientInsertData)
      .select()
      .single()

    if (clientErr) {
      console.error('Client insert error:', clientErr)
      throw clientErr
    }

    return client
  }


  return useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    }
  })
}