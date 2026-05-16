import { useForm } from 'react-hook-form'
import { Dialog, Box, DialogTitle, DialogContent, TextField, DialogActions, Button, Select, FormControl, InputLabel, MenuItem } from '@mui/material'
import { type ProjectDataType, AddProjectSchema } from '../types/types'
import { useProjectStore } from '../stores/ProjectStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetClients } from '../../clients/hooks/useGetClients'
import {useState, useEffect} from 'react'
import {type SelectChangeEvent} from '@mui/material/Select'
import { useCreateProject } from '../hooks/useCreateProject'
import { useEditProject } from '../hooks/useEditProject'

export interface AddProjectModalProps {
    project_id: string | undefined;
    initialData?: ProjectDataType

}

export const AddProjectModal = ({project_id, initialData}: AddProjectModalProps) => {
    const openModal = useProjectStore(state => state.openModal) // first state it is false
    const setOpenModal = useProjectStore(state => state.setOpenModal) // this is function
    const [clientId, setClientId] = useState<string>('') // ''

    const handleClose = () => {
        setOpenModal(false);
    }

    const {mutate: createProject} = useCreateProject(clientId);

    const {mutate: editProject} = useEditProject(project_id as string)
    

    const handleChange = (event: SelectChangeEvent) => {
        setClientId(event.target.value as string)
    }

    const { data: clients, isLoading } = useGetClients() // this is the culprit
    console.log(clients)

    // But useGetClient is asynchronous. it doesnt just run once and stop. it has its own lifecycle that happens after the first render.
    // component mounts at first - it logs undefined as client is undefined.
    // tanstack query starts the network request
    // isLoading = true // log2

    // data comes from the supabase
    //isLoading set to false -3rd rerender
    // clients = [{...}] log4


    /// Understand in a way that the componetn didnt
    // re-render because i changed it, it rerendered because something it was subscribed was changed.


    // useGetClients is a subscription. = your component is saying whenerver this data changes, update me. Tanstack query  is the one triggering the re-renders, not my code directly.

    // My component is subscribed to useGetClients
    // Tanstack query does it work in the background
    // Everytime tanstack query state changes.
    // component rerenders to reflect the new state


    // This is the fundamental model of React - component rerendered when their state or subscription change, not just when the user does something.
    

    const { register, handleSubmit, reset , formState: {
        errors
    } } = useForm<ProjectDataType>({
        resolver: zodResolver(AddProjectSchema)
    });

    const onSubmit = (data: ProjectDataType) => {
        const payload = {
            ...data,
            client_id: clientId
        }
        if(initialData) {
            editProject({
                ...data
            })
        }
        else {
            createProject(payload)
        }
    }

    useEffect(()=>{
        if(initialData){
            reset({
                title: initialData.title,
                status: initialData.status
            })
            
        }

    }, [initialData, reset])

   

    
    return (
        <div>
            <Dialog open={openModal} onClose={handleClose} fullWidth maxWidth="sm">
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>

                    <DialogTitle>Add Project</DialogTitle>

                    <DialogContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            mt: 1
                        }}
                    >
                        <TextField error={!!errors.title} helperText={errors.title?.message} {...register('title')} label="Project title" fullWidth />
                        <TextField error={!!errors.status} helperText={errors.status?.message} {...register('status')} label="Status" fullWidth />

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Select client</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={clientId}
                                label="Client"
                                onChange={handleChange}
                            >
                                {clients?.map(client => <MenuItem value={client.id}>{client.name}
                                </MenuItem>)}

                            </Select>
                        </FormControl>





                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose}>
                            Cancel
                        </Button>

                        <Button variant="contained" type='submit'>
                            Save
                        </Button>
                    </DialogActions>
                </Box>

            </Dialog>

        </div>
    )
}


