import { Suspense, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendAddress } from "..";
import ReimbursementItem from "../entities/reimbursement-item";
import { actions, PageState } from "../store";
import ReimbursementTable from "./reimbursement-table";


export default function EmployeePage() {

    const {id, show} = useSelector((state:PageState) => {return {id:state.user.id, show:state.show}});
    
    const dispatch = useDispatch();

    useLayoutEffect(() => {(async () => {
        const setShowFalse = actions.updateShow(false);
        dispatch(setShowFalse);
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
        const setShowTrue = actions.updateShow(true);
        dispatch(setShowTrue)})()}, 
        [id, dispatch]
    );

    return (<>
        <Suspense fallback={<h2 className="Loading">Loading Component...</h2>}>
            {show && <ReimbursementTable />}
        </Suspense>
    </>)
}