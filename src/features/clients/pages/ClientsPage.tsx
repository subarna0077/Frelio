import {
    Box,
    Typography,
    Card,
    CardContent,
    Avatar,
    Stack,
    Button,
    Chip,
    Divider,
    Paper,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import BusinessIcon from '@mui/icons-material/Business'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useGetClients } from '../hooks/useGetClients'
import { useDeleteClient } from '../hooks/useDeleteClient'
import { useClientStore } from '../stores/ClientStore'
import { AddClientModal } from '../components/AddClientModal'

export const ClientsPage = () => {

    const { data: clients, isLoading: isClientLoading } = useGetClients()

    const {mutate: deleteClient} = useDeleteClient();
    const handleDeleteClient = (id: string)=>{
        deleteClient(id)
    }

    const openModal = useClientStore(state=> state.openModal)
    const setOpenModal = useClientStore(state=> state.setOpenModal)




    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: '#f5f5f5',
                p: 4,
            }}
        >

            {/* Header */}
            <Stack
                sx={{
                    direction: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,


                }}
            >
                <Box>
                    <Typography
                        variant="h4"
                        sx={{ fontWeight: 'bold' }}
                    >
                        Clients
                    </Typography>

                    <Typography color="text.secondary">
                        Manage all your clients here
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={()=> setOpenModal(true)}
                >
                    Add Client
                </Button>
            </Stack>

            {/* Client List */}
            <Stack spacing={3}>

                {(clients ?? []).map((client) => (

                    <Card
                        key={client.id}
                        sx={{
                            borderRadius: 3,
                            boxShadow: 2,
                        }}
                    >
                        <CardContent>

                            {/* Top */}
                            <Stack
                                sx={{
                                    direction: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    mb: 3
                                }}
                            >

                                {/* Left */}
                                <Stack
                                    sx={{
                                        direction: 'row',
                                        spacing: 2,
                                        alignItems: 'center'
                                    }}

                                >
                                    <Avatar
                                        sx={{
                                            width: 56,
                                            height: 56,
                                        }}
                                    >
                                        {client.name.charAt(0)}
                                    </Avatar>

                                    <Box>
                                        <Typography
                                            variant="h6"
                                            sx={{ fontWeight: 'bold' }}
                                        >
                                            {client.name}
                                        </Typography>


                                    </Box>
                                </Stack>

                                {/* Right */}
                                <Stack
                                    sx={
                                        {
                                            direction: 'row',
                                            spacing: 2,
                                            alignItems: 'center'
                                        }
                                    }

                                >

                                    <Chip
                                        label={client.created_at}
                                    />

                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                    >
                                        Edit
                                    </Button>

                                    <IconButton color="error" onClick={()=>handleDeleteClient(client.id)}>
                                        <DeleteIcon />
                                    </IconButton>

                                </Stack>
                            </Stack>

                            <Divider sx={{ mb: 3 }} />

                            {/* Client Details */}
                            <Stack spacing={2}>

                                <Stack
                                sx={{
                                    direction: 'row', alignItems: 'center'
                                }}
                                   
                                >
                                    <EmailIcon fontSize="small" />

                                    <Typography>
                                        {client?.email}
                                    </Typography>
                                </Stack>

                                <Stack
                                sx={{direction: 'row', spacing: 1, alignItems: 'center'}}
                                  
                                >
                                    <PhoneIcon fontSize="small" />

                                    <Typography>
                                        {client.phone}
                                    </Typography>
                                </Stack>

                                <Stack
                                sx={{
                                    direction: 'row', spacing:1, alignItems: 'center'
                                }}
                                    
                                >
                                    <BusinessIcon fontSize="small" />

                                    <Typography>
                                        {client.projects.length} Active Projects
                                    </Typography>
                                </Stack>
                            </Stack>

                            {/* Recent Projects */}
                            <Box mt={4}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 'bold',
                                        mb: 2,
                                    }}
                                >
                                    Recent Projects
                                </Typography>

                                {client.projects.length > 0 ?  <Paper variant="outlined">
                                    <List>

                                        {client?.projects.map(project=>
                                        <ListItem>
                                            {project.title}

                                        </ListItem>)}

                                    </List>
                                </Paper>: <Typography>No projects available.</Typography>}

                               
                            </Box>

                        </CardContent>
                    </Card>
                ))}

                {openModal && <AddClientModal/>}

            </Stack>
        </Box>
    )
}