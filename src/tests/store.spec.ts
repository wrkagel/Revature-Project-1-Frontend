import ReimbursementItem, { ReimbursementStatus } from '../entities/reimbursement-item';
import User from '../entities/user';
import {PageState, pageStore, actions} from '../store';

describe("Testing for Redux store", () => {

    const dispatch = pageStore.dispatch;
    const time = Date.now();

    it("should return a state with initial parameters", () => {
        const initialState:PageState = {
            user:{
                name:"", 
                id:"", 
                isAuthenticated:false, 
                isManager:false
            },
            reimbursementList:[]};
        const state:PageState = pageStore.getState();
        expect(state).toEqual(initialState);
    });

    it("should update the user in the store", () => {
        const user:User = {
            name:"Harvey the Ghost",
            id:"test",
            isAuthenticated:true,
            isManager:true
        }
        const action = actions.updateUser(user);
        dispatch(action);
        const state:PageState = pageStore.getState();
        expect(state.user).toEqual(user);
    });

    it("should update the reimbursement list with a new reimbursementList", () => {
        const reimbursementList:ReimbursementItem[] = [{
            id:"id",
            employeeId: "employeeId",
            type: "type",
            desc: "desc",
            amount: 1.01,
            status: ReimbursementStatus.pending,
            date: time
        }];
        const action = actions.updateReimbursementList(reimbursementList);
        dispatch(action);
        const state:PageState = pageStore.getState();
        expect(state.reimbursementList).toEqual(reimbursementList);
    });

    it("should add a reimbursement to the reimbursement list in the store", () => {
        const reimbursement:ReimbursementItem = {
            id:"test",
            employeeId:"test",
            type:"type",
            desc:"desc",
            amount:0.02,
            status:ReimbursementStatus.pending,
            date: time
        }
        const action = actions.addReimbursementItemToList(reimbursement);
        dispatch(action);
        const state:PageState = pageStore.getState();
        expect(state.reimbursementList).toContainEqual(reimbursement);
    });

    it("should update the reimbursement in the reimbursementList", () => {
        const reimbursement:ReimbursementItem = {
            id:"test",
            employeeId:"test",
            type:"type",
            desc:"desc",
            amount:0.02,
            status:ReimbursementStatus.pending,
            date: time
        }
        const reimbursementNew = {...reimbursement, type:"newType", desc:"newDesc", amount:0.04, status:ReimbursementStatus.approved}
        const action = actions.updateReimbursement(reimbursementNew);
        dispatch(action);
        const state = pageStore.getState();
        expect(state.reimbursementList).toContainEqual(reimbursementNew);
        expect(state.reimbursementList).not.toContainEqual(reimbursement);
    })
})