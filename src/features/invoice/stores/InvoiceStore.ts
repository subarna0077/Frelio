import { create } from 'zustand'


export interface InvoiceStoreType {
    openModal: boolean,
    setOpenModal: (value: boolean) => void,
}

export const useInvoiceStore = create<InvoiceStoreType>(
    (set) => ({
        openModal: false,
        setOpenModal: (value) => {
            set(() => ({
                openModal: value,
            }))
        }
    })
)