import { configureStore } from '@reduxjs/toolkit';
import checkpoint1Reducer from './checkpoint1';
import checkpoint2Reducer from './checkpoint2';
import checkpoint3Reducer from './checkpoint3';
import goalReducer from './goal';

export default configureStore({
    reducer: {
        checkpoint1: checkpoint1Reducer,
        checkpoint2: checkpoint2Reducer,
        checkpoint3: checkpoint3Reducer,
        goal: goalReducer
    }
})