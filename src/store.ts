import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import ReimbursementItem, { ReimbursementStatus } from "./models/reimbursement-item";
import User from "./models/user";


export interface pageState {
    user:User,
    reimbursementList:ReimbursementItem[]
}


// const initialState:pageState = {
//     user:{isAuthenticated:false, isManager:false, id:""},
//     reimbursementList:[]
// };

const dummyUser:User = {isAuthenticated:false, isManager:false, id:"007"}
const dummyList:ReimbursementItem[] = [
    {id:'01', employeeId:'007', type:'Car', desc:'The car got blown up and I need a new one.', amount:40000, status:ReimbursementStatus.pending},
    {id:'02', employeeId:'007', type:'Lunch', desc:'Staking out the target.', amount:500, status:ReimbursementStatus.denied},
    {id:'03', employeeId:'007', type:'Gun', desc:'I needed a new golden gun.', amount:20000, status:ReimbursementStatus.pending},
    {id:'04', employeeId:'007', type:'Suit', desc:'Suit was shredded in a knife fight.', amount:5000, status:ReimbursementStatus.approved},
    {id:'05', employeeId:'007', type:'Car', desc:'I need another new car. This one also blew up.', amount:40000, status:ReimbursementStatus.pending}
];

const initialState:pageState = {user:dummyUser, reimbursementList:dummyList};

const pageSlice = createSlice({
    name:"PageStore",
    initialState,
    reducers: {

        updateUser (state:pageState, action:PayloadAction<User>) {
            state.user = action.payload;
        }

    }
});

export const pageStore = configureStore({reducer: pageSlice.reducer});

export const actions = pageSlice.actions;