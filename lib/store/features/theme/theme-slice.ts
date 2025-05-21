import { createSlice, PayloadAction } from '@reduxjs/toolkit'
const initialState = {
  theme: 'light',
  loading: false,
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setTheme, setLoading } = themeSlice.actions
export default themeSlice.reducer
