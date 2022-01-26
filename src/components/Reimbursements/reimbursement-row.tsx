import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendAddress } from "../../store";
import ReimbursementItem, { ReimbursementStatus } from "../../entities/reimbursement-item";
import { actions, PageState } from "../../store";
import FileButtons from "./reimbursement-file-buttons";


export default function ReimbursementRow(props:ReimbursementItem) {

    const {isManager, id:userId} = useSelector((state:PageState) => state.user);
    const dispatch = useDispatch();
    const [update, setUpdate] = useState<string>("");
    
    const {id, employeeId, type, desc, amount, date, status} = props;

    useEffect(() => {
        if(!update) return;
        const controller = new AbortController();
        (
            async () => {
                const response = await fetch(`${backendAddress}/reimbursements/update`, {
                    method: "PATCH",
                    headers: {"Content-Type": "application/json"},
                    body:JSON.stringify({id, status:update}),
                    signal:controller.signal
                });
                if(response.status === 200) {
                    const returnedReimbursement:ReimbursementItem = await response.json();
                    const action = actions.updateReimbursement(returnedReimbursement);
                    dispatch(action)
                } else {
                    alert(await response.text());
                }
            }
        )();
        return () => controller.abort();
    }, [update, dispatch, id])

    const ManagerButtons = () => {
        switch(props.status) {
            case ReimbursementStatus.pending: {
                return (<>
                    <button className="btn btn-outline-success col" onClick={() => setUpdate(ReimbursementStatus.approved)}>Approve</button>
                    <button className="btn btn-outline-danger col" onClick={() => setUpdate(ReimbursementStatus.denied)}>Deny</button>
                </>)
            }
            case ReimbursementStatus.approved:
            case ReimbursementStatus.denied: {
                return <button className="btn btn-outline-info" onClick={() => setUpdate(ReimbursementStatus.pending)}>Set Pending</button>;
            }
            case ReimbursementStatus.paid: {
                return <button className="btn btn-secondary disabled">Paid</button>
            }
            default: {
                console.log('Reached default in managerButtons switch in reimbursement-row.tsx');
            }
        }
        return null;
    }
    
    return (
        <tr>
            <td>{type}</td>
            <td>{desc}</td>
            <td id="amount">${amount}</td>
            <td id="status">{status}</td>
            <td>{(new Date(date)).toDateString()}</td>
            <td>{id}</td>{
            (isManager && userId !== employeeId) && 
            (<><td>{employeeId}</td>
                <td className="d-flex">
                    <div className="container">
                        <div className="row">
                            {<ManagerButtons/>}
                        </div>
                    </div>
            </td></>)}
            <td>
                <FileButtons id={id}/>
            </td>
        </tr>)
}