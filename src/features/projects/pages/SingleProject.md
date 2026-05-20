Data flow after the modified ui

useGetSingleProject hook - require the projectId - get the project id from the params

useListMilestones - list milestones for a specific project - require the projectId - comes from the params

useCreateMilestone - it requires the projectId in the hook and the data in the mutate function - we can pass the projectId through the modalform props

useCompleteMilestone - it requires milestone_id. we use this in the singleProjectPage itself, marking the dot icon, this will call the hook.

useCreateInvoice - it requires the 
