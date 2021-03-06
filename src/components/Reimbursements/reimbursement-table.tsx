import { useSelector } from "react-redux"
import { PageState } from "../../store";
import ReimbursementRow from "./reimbursement-row";
import ReimbursementForm from "./reimbursement-form";


export default function ReimbursementTable(props:{employeeId:string}) {

    const {employeeId} = props;
    
    const reimbursementList = useSelector((state:PageState) => state.reimbursementList);
    const {isManager, id} = useSelector((state:PageState) => state.user);
    const reimbursementRows = reimbursementList.map(r => <ReimbursementRow key={r.id} {...r}/> )

    return (<>
        <table className="table">
            <thead>
                <tr><th>Type</th><th>Description</th><th>Amount</th><th>Status</th><th>Date</th><th>id</th>{
                (isManager && id !== employeeId) && (<><th>Employee ID</th><th>Manager Only</th></>)}
                <th>Files</th></tr>
            </thead>
            <tbody>
                {reimbursementRows}
            </tbody>    
        </table>
        <ReimbursementForm employeeId={employeeId}/>
    </>)
}