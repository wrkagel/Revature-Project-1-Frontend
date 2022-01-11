import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import ReimbursementItem from "./entities/reimbursement-item";
import User from "./entities/user";


export interface PageState {
    user:User,
    reimbursementList:ReimbursementItem[],
    show:boolean
}


// const initialState:pageState = {
//     user:{isAuthenticated:false, isManager:false, id:""},
//     reimbursementList:[]
// };

const initialState:PageState = {user:{name:"", id:"", isAuthenticated:false, isManager:false}, reimbursementList:[], show:true};

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

        updateReimbursement(state:PageState, action:PayloadAction<ReimbursementItem>) {
            const reimbursementIndex:number = state.reimbursementList.findIndex(r => r.id === action.payload.id);
            if(reimbursementIndex !== -1) {
                state.reimbursementList[reimbursementIndex] = action.payload;
            }
        },

        updateReimbursementList (state:PageState, action:PayloadAction<ReimbursementItem[]>) {
            state.reimbursementList = action.payload;
        },

        updateEmployeeId (state:PageState, action:PayloadAction<string>) {
            state.user.employeeId = action.payload;
        },

        clearEmployeeId (state:PageState) {
            state.user.employeeId = undefined;
        },

        updateShow (state:PageState, action:PayloadAction<boolean>) {
            state.show = action.payload;
        }

    }
});

export const pageStore = configureStore({reducer: pageSlice.reducer});

export const actions = pageSlice.actions;