import { createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
    name: 'language',
    initialState: {
        selectedLanguage: 'en',
        languages: ['en', 'am', 'ti']
    },
    reducers: {
        setLanguage: (state, action) => {
            state.selectedLanguage = action.payload;
        }
    }
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;