import { create } from 'zustand'

type WarningDialogType = 'none' | 'edit' | 'delete' | 'milestoneDelete';

export type WarningDialogStoreType = {
    type: WarningDialogType;
    setType: (type: WarningDialogType) => void;
}

export const useWarningDialogStore = create<WarningDialogStoreType>((set) => ({
    type: 'none',
    setType: (type) => set({
        type
    })
}))