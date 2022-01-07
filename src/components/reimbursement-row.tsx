import { useSelector } from "react-redux";
import ReimbursementItem from "../entities/reimbursement-item";
import { PageState } from "../store";


export default function ReimbursementRow(props:ReimbursementItem) {

    const {isManager, id:userId} = useSelector((state:PageState) => state.user);

    const {id, employeeId, type, desc, amount, date, status} = props;
    
    return (<tr><td>{type}</td><td>{desc}</td><td id="amount">{amount}</td><td id="status">{status}</td><td>{(new Date(date + 1)).toDateString()}</td><td>{id}</td>{
        (isManager && userId !== employeeId) && (<><td>{employeeId}</td><td><button>Allow</button><button>Deny</button></td></>)
    }</tr>)
}