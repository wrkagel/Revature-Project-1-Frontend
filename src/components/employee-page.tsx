import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReimbursementItem from "../entities/reimbursement-item";
import { actions, PageState } from "../store";
import ReimbursementTable from "./reimbursement-table";


export default function EmployeePage() {

    const id = useSelector((state:PageState) => state.user.id);
    
    const dispatch = useDispatch();

    useLayoutEffect(() => {(async () => {
        const action = actions.clearEmployeeId();
        dispatch(action);
        const response = await fetch(`http://localhost:5000/reimbursements/${id}`);
        if(!response || response.status !== 200) {
            alert('Failure retrieving reimbursements from server.');
            return;
        }
        const reimbursements:ReimbursementItem[] = await response.json();
        const action2 = actions.updateReimbursementList(reimbursements);
        dispatch(action2);
    })()}, [id, dispatch]);

    return (<>
        <h3>You are on the Employee page</h3>
        <ReimbursementTable />
    </>)
}