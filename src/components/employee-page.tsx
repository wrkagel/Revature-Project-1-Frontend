import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendAddress } from "..";
import ReimbursementItem from "../entities/reimbursement-item";
import { actions, PageState } from "../store";
import ReimbursementTable from "./reimbursement-table";


export default function EmployeePage() {

    const id = useSelector((state:PageState) => state.user.id);
    
    const dispatch = useDispatch();

    const [show, setShow] = useState<boolean>(false);

    useLayoutEffect(() => {(async () => {
        const action = actions.clearEmployeeId();
        dispatch(action);
        const response = await fetch(`${backendAddress}/reimbursements/${id}`);
        if(!response || response.status !== 200) {
            alert('Failure retrieving reimbursements from server.');
            return;
        }
        const reimbursements:ReimbursementItem[] = await response.json();
        const action2 = actions.updateReimbursementList(reimbursements);
        dispatch(action2);
        setShow(true);
        })()}, 
        [id, dispatch]
    );

    return (<>
        {show && <ReimbursementTable />}
    </>)
}