import {createSlice} from '@reduxjs/toolkit';

export const checkpoint3Slice = createSlice({
    name: 'checkpoint3',
    initialState: {
        cp3: {}
    },
    reducers: {
        setCP3: (state, action) => {
            state.cp3 = action.payload
        }
    }
})

export const {setCP3} = checkpoint3Slice.actions;
export default checkpoint3Slice.reducer;