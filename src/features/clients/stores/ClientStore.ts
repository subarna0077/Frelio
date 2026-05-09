import {create} from 'zustand'

export interface ClientStoreType {
    openModal: boolean,
    setOpenModal: (value: boolean)=> void;
}

export const useClientStore = create<ClientStoreType>((set)=>({
    openModal : false,
    setOpenModal : (value)=> {
        set(()=>({
            openModal: value
        }))
    }
}))