import {create} from 'zustand'

export interface ProjectStoreType {
    openModal: boolean,
    setOpenModal: (value: boolean)=> void;
}

export const useProjectStore = create<ProjectStoreType>((set)=>({
    openModal : false,
    setOpenModal : (value)=> {
        set(()=>({
            openModal: value
        }))
    }
}))