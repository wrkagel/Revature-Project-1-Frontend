import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import ReimbursementItem from "./entities/reimbursement-item";
import User from "./entities/user";


export interface PageState {
    user:User,
    reimbursementList:ReimbursementItem[]
}


// const initialState:pageState = {
//     user:{isAuthenticated:false, isManager:false, id:""},
//     reimbursementList:[]
// };

const initialState:PageState = {user:{name:"", id:"", isAuthenticated:false, isManager:false}, reimbursementList:[]};

const pageSlice = createSlice({
    name:"PageStore",
    initialState,
    reducers: {

        updateUser (state:PageState, action:PayloadAction<User>) {
            state.user = action.payload;
        },

        addReimbursementItemToList (state:PageState, action:PayloadAction<ReimbursementItem>) {
            state.reimbursementList.push(action.payload);
        },

        updateReimbursementList (state:PageState, action:PayloadAction<ReimbursementItem[]>) {
            state.reimbursementList = action.payload;
        },

        clearEmployeeId (state:PageState) {
            state.user.employeeId = undefined;
        }

    }
});

export const pageStore = configureStore({reducer: pageSlice.reducer});

export const actions = pageSlice.actions;