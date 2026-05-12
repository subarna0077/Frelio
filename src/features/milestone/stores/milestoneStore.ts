import {create} from 'zustand'

export interface MilestoneStoreType {
    openModal: boolean,
    setOpenModal: (value: boolean)=> void;
}

export const useMilestoneStore = create<MilestoneStoreType>((set)=>({
    openModal : false,
    setOpenModal : (value)=> {
        set(()=>({
            openModal: value
        }))
    }
}))