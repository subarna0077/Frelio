import React from 'react'
import { Box, Dialog, DialogTitle, Typography, Divider, Stack, TextField, List, ListItem, ListItemButton, Checkbox, ListItemText, IconButton, Button } from '@mui/material'
import { Close } from '@mui/icons-material'
import { z } from 'zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useInvoiceStore } from '../stores/InvoiceStore'
import { useParams } from 'react-router-dom'
import { useCreateInvoice } from '../hooks/useCreateInvoice'
import type { Project } from '../../projects/types/types'
import type { Milestone } from '../../milestone/types/types'
import { useState } from 'react'

export const InvoiceItemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    amount: z.number({ invalid_type_error: 'Enter a valid amount' }).min(1, 'Amount must be greater than 0')
})


export const InvoiceSchema = z.object({
    due_date: z.string().optional(),
    items: z.array(InvoiceItemSchema).min(1, 'Add at least one line item')
})

export type InvoiceFormType = z.infer<typeof InvoiceSchema>

export const InvoiceModalForm = ({
    client_id,
    project_data: initialData,
    milestone_data
}: { client_id: string, project_data: Project, milestone_data: Milestone[] }) => {


    const [selectedMilestone, setSelectedMilestone] = useState<string[]>([]);
    console.log(selectedMilestone)

    const selected = milestone_data.filter(milestone => selectedMilestone.includes(milestone.id))
    console.log(selected);

    const selectedItems = selected.map(item=> ({
        description: item.name,
        amount: item.amount
    }))

    console.log(selectedItems)

    const toggleCheckBox = (id: string) => {
        setSelectedMilestone(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id)
            }

            return [...prev, id] // add only if not exists.

        })
    }


    const setOpenModal = useInvoiceStore(state => state.setOpenModal)
    const { id: project_id } = useParams();

    const { mutate: createInvoice, isPending } = useCreateInvoice(client_id, project_id ?? '')
    console.log(project_id)

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

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'items'
    })

    const onSubmit = (data: InvoiceFormType) => {
        console.log(data)
        createInvoice(data);
    }


    return (

        <Dialog open={true} onClose={() => setOpenModal(false)}>
            <DialogTitle>
                <Typography>
                    Create Invoice
                </Typography>

            </DialogTitle>

            <Divider></Divider>

            <Box component='form' sx={{ p: 2 }} onSubmit={handleSubmit(onSubmit)}>

                <Stack direction='column' sx={{ gap: 2 }}>
                    <Box >
                        <TextField label="Project" value={initialData?.title} disabled sx={{ mr: 2 }} />
                        <TextField label="Client" value={initialData.clients?.name} disabled />
                    </Box>

                    <TextField error={!!errors.due_date} helperText={errors.due_date?.message} type='date' {...register('due_date')}></TextField>

                    <Typography>Completed milestone - Click to add</Typography>
                    <Divider></Divider>
                    {/* Milestones mockup - import from listMilestones */}
                    <List>
                        {milestone_data.map(milestone => <ListItem sx={{ border: 'green', borderRadius: '5px', display: 'flex', bgcolor: '#13973f7d', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Stack direction='row' sx={{ alignItems: 'center' }}>
                                <ListItemButton>
                                    <Checkbox onClick={() => toggleCheckBox(milestone.id)} />
                                </ListItemButton>
                                <ListItemText>
                                    {milestone.name}
                                </ListItemText>
                            </Stack>

                            <ListItemText sx={{ flex: 1 }}>{milestone.amount}</ListItemText>
                        </ListItem>)}

                    </List>

                    <Button onClick={()=> replace(selectedItems)} >Fill from milestone</Button>

                    <Typography>Invoice items</Typography>
                    <Divider></Divider>

                    <Stack direction='row' sx={{ width: 'full' }}>
                        <Typography variant='body2' sx={{ flexBasis: '70%' }}>Description</Typography>
                        <Typography variant='body2'>Amount</Typography>
                    </Stack>


                    {fields.map((field, index) => (
                        <Stack key={field.id} direction='row' sx={{ width: 'full', gap: 2 }}>
                            <TextField sx={{ flexBasis: '70%' }} placeholder='Custom item e.g. Extra revision' error={!!errors.items?.[index]?.description} helperText={errors.items?.[index]?.description?.message} {...register(`items.${index}.description`)} />
                            <TextField placeholder='Amount'  {...register(`items.${index}.amount`, {
                                valueAsNumber: true
                            })} error={!!errors.items?.[index]?.amount} helperText={errors.items?.[index]?.amount?.message} />
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
                        <Button sx={{ border: '1px solid gray', mr: 2 }} onClick={() => setOpenModal(false)}>Cancel</Button>
                        <Button sx={{ border: '1px solid gray' }} type='submit'>{isPending ? 'Saving' : 'Save to draft'}</Button>

                    </Box>
                </Stack>

            </Box>


        </Dialog>

    )
}

export default InvoiceModalForm
