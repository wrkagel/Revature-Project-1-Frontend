import { useSelector } from "react-redux";
import ReimbursementItem from "../entities/reimbursement-item";
import { pageState } from "../store";


export default function ReimbursementRow(props:ReimbursementItem) {

    const isManager = useSelector((state:pageState) => state.user.isManager);

    const {id, employeeId, type, desc, amount, status} = props;
    
    return (<tr><td>{type}</td><td>{desc}</td><td id="amount">{amount}</td><td id="status">{status}</td><td>{id}</td>{
        isManager && (<><td>{employeeId}</td><td><button>Allow</button><button>Deny</button></td></>)
    }</tr>)
}