import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import ReimbursementItem from "./entities/reimbursement-item";
import User from "./entities/user";


export interface pageState {
    user:User,
    reimbursementList:ReimbursementItem[]
}


// const initialState:pageState = {
//     user:{isAuthenticated:false, isManager:false, id:""},
//     reimbursementList:[]
// };

const initialState:pageState = {user:{id:"", isAuthenticated:false, isManager:false}, reimbursementList:[]};

const pageSlice = createSlice({
    name:"PageStore",
    initialState,
    reducers: {

        updateUser (state:pageState, action:PayloadAction<User>) {
            state.user = action.payload;
        },

        addReimbursementItemToList (state:pageState, action:PayloadAction<ReimbursementItem>) {
            state.reimbursementList.push(action.payload);
        }

    }
});

export const pageStore = configureStore({reducer: pageSlice.reducer});

export const actions = pageSlice.actions;