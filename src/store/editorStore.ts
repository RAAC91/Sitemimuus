import { create } from 'zustand'
import { DesignData } from '@/types'

interface EditorStore {
  designData: DesignData
  selectedLayer: string | null
  updateDesign: (data: Partial<DesignData>) => void
  resetDesign: () => void
  setSelectedLayer: (id: string | null) => void
}

const initialDesign: DesignData = {
  text: 'MEU NOME',
  textColor: '#FFFFFF',
  textFont: 'Inter',
  fontSize: 48,
  backgroundColor: '#FF4586',
  backgroundPattern: 'solid',
  layers: [],
}

export const useEditorStore = create<EditorStore>((set) => ({
  designData: initialDesign,
  selectedLayer: null,
  
  updateDesign: (data) => {
    set((state) => ({
      designData: { ...state.designData, ...data }
    }))
  },
  
  resetDesign: () => set({ designData: initialDesign }),
  
  setSelectedLayer: (id) => set({ selectedLayer: id }),
}))
