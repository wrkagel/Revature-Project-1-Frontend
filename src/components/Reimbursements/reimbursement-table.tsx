import { useSelector } from "react-redux"
import { PageState } from "../../store";
import ReimbursementRow from "./reimbursement-row";
//import '../style/reimbursement-table.css'
import ReimbursementForm from "./reimbursement-form";


export default function ReimbursementTable() {
    
    const reimbursementList = useSelector((state:PageState) => state.reimbursementList);
    const {isManager, id} = useSelector((state:PageState) => state.user);
    const reimbursementRows = reimbursementList.map(r => <ReimbursementRow key={r.id} {...r}/> )

    return (<>
        <table className="table">
            <thead>
                <tr><th>Type</th><th>Description</th><th>Amount</th><th>Status</th><th>Date</th><th>id</th>{
                (isManager && id !== reimbursementList[0]?.employeeId) && (<><th>Employee ID</th><th>Manager Only</th></>)}
                <th>Upload File</th></tr>
            </thead>
            <tbody>
                {reimbursementRows}
            </tbody>    
        </table>
        <ReimbursementForm />
    </>)
}