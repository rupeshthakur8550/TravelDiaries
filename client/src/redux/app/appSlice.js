import { createSlice } from '@reduxjs/toolkit'

const appSlice = createSlice({
    name: 'app',
    initialState: {
        searchValue: null,
        searchResults: null,
        selectedResult: null,
    },
    reducers: {
        setSearchValue(state, action) {
            state.searchValue = action.payload
        },
        setSearchResults(state, action) {
            state.searchResults = action.payload
        },
        setSelectedResult(state, action) {
            state.selectedResult = action.payload
        },
    }
})

export const { setSearchResults, setSearchValue, setSelectedResult } = appSlice.actions;

export default appSlice.reducer;