import React from 'react'
import { Box, Dialog, DialogTitle, Typography, Divider, Stack, TextField, List, ListItem, ListItemButton, Checkbox, ListItemText, IconButton, Button } from '@mui/material'
import { Close } from '@mui/icons-material'
import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const InvoiceItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    amount: z.number({ invalid_type_error: 'Enter a valid amount' }).min(1, 'Amount must be greater than 0')
})


export const InvoiceSchema = z.object({
    due_date: z.string().optional(),
    items: z.array(InvoiceItemSchema).min(1, 'Add at least one line item')
})

export type InvoiceFormType = z.infer<typeof InvoiceSchema>

export const InvoiceModalForm = () => {

    const { register, control, handleSubmit, formState: {
        errors
    } } = useForm<InvoiceFormType>({
        resolver: zodResolver(InvoiceSchema),
        defaultValues: {
            due_date: '',
            items: [
                {
                    description: '',
                    amount: 0
                }
            ]
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items'
    })

    const onSubmit = (data: InvoiceFormType) => {
        console.log(data)
    }


    return (

        <Dialog open={true}>
            <DialogTitle>
                <Typography>
                    Create Invoice
                </Typography>

            </DialogTitle>

            <Divider></Divider>

            <Box component='form' sx={{ p: 2 }} onSubmit={handleSubmit(onSubmit)}>

                <Stack direction='column' sx={{ gap: 2 }}>
                    <Box >
                        <TextField label="Project" value="Momo palace website" disabled sx={{ mr: 2 }} />
                        <TextField label="Client" value="Sita maharjan" disabled />
                    </Box>

                    <TextField type='date' {...register('due_date')}></TextField>

                    <Typography>Completed milestone - Click to add</Typography>
                    <Divider></Divider>
                    {/* Milestones mockup - import from listMilestones */}
                    <List>
                        <ListItem sx={{ border: 'green', borderRadius: '5px', display: 'flex', bgcolor: '#13973f7d', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Stack direction='row' sx={{ alignItems: 'center' }}>
                                <ListItemButton>
                                    <Checkbox checked />
                                </ListItemButton>
                                <ListItemText>
                                    Design Mockup
                                </ListItemText>
                            </Stack>

                            <ListItemText sx={{ flex: 1 }}>Rs 10000</ListItemText>
                        </ListItem>
                    </List>

                    <Typography>Invoice items</Typography>
                    <Divider></Divider>

                    <Stack direction='row' sx={{ width: 'full' }}>
                        <Typography variant='body2' sx={{ flexBasis: '70%' }}>Description</Typography>
                        <Typography variant='body2'>Amount</Typography>
                    </Stack>


                    {fields.map((field, index) => (
                        <Stack key={field.id} direction='row' sx={{ width: 'full', gap: 2 }}>
                            <TextField sx={{ flexBasis: '70%' }} placeholder='Custom item e.g. Extra revision' {...register(`items.${index}.description`)} />
                            <TextField placeholder='Amount'  {...register(`items.${index}.amount`, {
                                valueAsNumber: true
                            })} />
                            <IconButton onClick={() => remove(index)}>
                                <Close></Close>
                            </IconButton>
                        </Stack>

                    ))}




                    <Button sx={{ textAlign: 'left', border: '1px solid gray' }} onClick={() => append({
                        description: '',
                        amount: 0
                    })}>Add custom line item</Button>
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-between', bgcolor: 'lightgrey', p: 1, border: '1px', borderRadius: '5px'
                    }}>
                        <Typography>
                            Total
                        </Typography>

                        <Typography>Amount</Typography>
                    </Box>

                    <Divider></Divider>

                    <Box >
                        <Button sx={{ border: '1px solid gray', mr: 2 }}>Cancel</Button>
                        <Button sx={{ border: '1px solid gray' }} type='submit'>Save as draft</Button>

                    </Box>
                </Stack>

            </Box>


        </Dialog>

    )
}

export default InvoiceModalForm
