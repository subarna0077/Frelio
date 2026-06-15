// import { useEffect, useState } from 'react'
// import { useFormContext, Controller } from 'react-hook-form'
// import { Box, TextField, Autocomplete, CircularProgress } from '@mui/material'
// import type { ClientFormType, Province, District } from '../../types/types'
// import { supabase } from '../../../lib/supabase'

// interface Props {
//   prefix: 'office_address' | 'billing_address'
//   provinces: Province[]
//   provincesLoading: boolean
// }

// export function AddressFields({ prefix, provinces, provincesLoading }: Props) {
//   const { control, watch, register, formState: { errors } } =
//     useFormContext<ClientFormType>()

//   const provinceId = watch(`${prefix}.province_id`)

//   const [districts, setDistricts] = useState<District[]>([])
//   const [districtsLoading, setDistrictsLoading] = useState(false)

//   const addressErrors = errors[prefix]

//   // 🔥 fetch districts when province changes
//   useEffect(() => {
//     if (!provinceId) {
//       setDistricts([])
//       return
//     }

//     const fetchDistricts = async () => {
//       setDistrictsLoading(true)

//       const { data, error } = await supabase.from('districts').select("*").eq('province_id', provinceId)
//       if (error) throw error;

//       console.log(data, error)

//       setDistricts(data)
//       setDistrictsLoading(false)
//     }

//     fetchDistricts()
//   }, [provinceId])

//   return (
   
//   )
// }