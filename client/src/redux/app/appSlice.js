import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
    name: 'app',
    initialState: {
        searchValue: '',
        searchResults: null,
        selectedResult: null,
        selectedDashboard: '',
    },
    reducers: {
        setSearchValue(state, action) {
            state.searchValue = action.payload;
        },
        setSearchResults(state, action) {
            state.searchResults = action.payload;
        },
        setSelectedResult(state, action) {
            state.selectedResult = action.payload;
        },
        setSelectedDashboard: (state, action) => {
            state.selectedDashboard = action.payload;
        }
    },
});

export const { setSearchResults, setSearchValue, setSelectedResult, setSelectedDashboard } = appSlice.actions;

export default appSlice.reducer;
