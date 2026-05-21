import { create } from 'zustand'

export type WarningDialogStoreType = {
    openModal: boolean,
    setOpenModal: (value: boolean) => void;
}

export const useWarningDialogStore = create<WarningDialogStoreType>((set) => ({
    openModal: false,
    setOpenModal: (value) => {
        set(() => ({
            openModal: value
        }))
    }

}))