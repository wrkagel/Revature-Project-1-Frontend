import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReimbursementItem from "../entities/reimbursement-item";
import { actions, PageState } from "../store";
import ReimbursementTable from "./reimbursement-table";


export default function EmployeePage() {

    const id = useSelector((state:PageState) => state.user.id);
    
    const dispatch = useDispatch();
    useEffect(() => {getReimbursements()}, [id]);

    async function getReimbursements() {

        const response = await fetch(`http://localhost:5000/reimbursements/${id}`);
        if(!response || !response.ok) {
            alert('Failure retrieving reimbursements from server.');
            return;
        }
        const reimbursements:ReimbursementItem[] = await response.json();
        const action = actions.updateReimbursementList(reimbursements);
        dispatch(action);
    }

    return (<>
        <h3>You are on the Employee page</h3>
        <ReimbursementTable />
    </>)
}