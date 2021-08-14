import {createSlice} from '@reduxjs/toolkit';

export const checkpoint2Slice = createSlice({
    name: 'checkpoint2',
    initialState: {
        cp2: {}
    },
    reducers: {
        setCP2: (state, action) => {
            state.cp2 = action.payload
        }
    }
})

export const {setCP2} = checkpoint2Slice.actions;
export default checkpoint2Slice.reducer;