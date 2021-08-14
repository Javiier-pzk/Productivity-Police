import {createSlice} from '@reduxjs/toolkit';

export const checkpoint1Slice = createSlice({
    name: 'checkpoint1',
    initialState: {
        cp1: {}
    },
    reducers: {
        setCP1: (state, action) => {
            state.cp1 = action.payload
        }
    }
})

export const {setCP1} = checkpoint1Slice.actions;
export default checkpoint1Slice.reducer;