import { useDispatch, useSelector } from "react-redux";
import { backendAddress } from "..";
import ReimbursementItem from "../entities/reimbursement-item";
import { actions, PageState } from "../store";


export default function ReimbursementRow(props:ReimbursementItem) {

    const {isManager, id:userId} = useSelector((state:PageState) => state.user);
    const dispatch = useDispatch();

    const {id, employeeId, type, desc, amount, date, status} = props;

    async function updateReimbursement(newStatus:string) {
        const response = await fetch(`${backendAddress}/reimbursements/update`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body:JSON.stringify({id, status:newStatus})
        });
        if(response.status === 200) {
            const returnedReimbursement:ReimbursementItem = await response.json();
            const action = actions.updateReimbursement(returnedReimbursement);
            dispatch(action)
        } else {
            alert(await response.text());
        }
    }
    
    return (
        <tr>
            <td>{type}</td>
            <td>{desc}</td>
            <td id="amount">{amount}</td>
            <td id="status">{status}</td>
            <td>{(new Date(date + 1)).toDateString()}</td>
            <td>{id}</td>{
            (isManager && userId !== employeeId) && 
            (<><td>{employeeId}</td><td>
                <button onClick={() => updateReimbursement('approved')}>Approve</button>
                <button onClick={() => updateReimbursement('denied')}>Deny</button>
            </td></>)
    }</tr>)
}