import {createSlice} from '@reduxjs/toolkit';

export const goalSlice = createSlice({
    name: 'goal',
    initialState: {
        goalNotes: {}
    },
    reducers: {
        setGoalNotes: (state, action) => {
            state.goalNotes = action.payload
        }
    }
})

export const {setGoalNotes} = goalSlice.actions;
export default goalSlice.reducer;