import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendAddress } from "../../store";
import ReimbursementItem from "../../entities/reimbursement-item";
import { actions, PageState } from "../../store";
import ReimbursementTable from "../Reimbursements/reimbursement-table";


export default function EmployeePage() {

    const id = useSelector((state:PageState) => state.user.id);
    
    const dispatch = useDispatch();

    const [show, setShow] = useState<boolean>(false);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            const response = await fetch(`${backendAddress}/reimbursements/${id}`, {signal:controller.signal});
            if(!response || response.status !== 200) {
                alert('Failure retrieving reimbursements from server.');
                return;
            }
            const reimbursements:ReimbursementItem[] = await response.json();
            const action2 = actions.updateReimbursementList(reimbursements);
            dispatch(action2);
            setShow(true);
        })();
        return () => {controller.abort()};
        }, [id, dispatch]
    );

    return (<>
        {show ? <ReimbursementTable employeeId={id}/> : <h2>Loading Reimbursements</h2>}
    </>)
}