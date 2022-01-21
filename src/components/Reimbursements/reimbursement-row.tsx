import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendAddress } from "../..";
import ReimbursementItem, { ReimbursementStatus } from "../../entities/reimbursement-item";
import { actions, PageState } from "../../store";


export default function ReimbursementRow(props:ReimbursementItem) {

    const {isManager, id:userId} = useSelector((state:PageState) => state.user);
    const dispatch = useDispatch();

    const downloadAnchor = useRef<HTMLAnchorElement>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    
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

    async function uploadFile() {
        const files:FileList | null = fileInput.current?.files ?? null;
        const fd = new FormData();
        if(!files) return;
        for(let i = 0; i < files.length; i++) {
            const file:File | null = files.item(i);
            if(file) {
                fd.append('uploads', file)
            }
        }
        const response = await fetch(`${backendAddress}/reimbursements/${id}/upload`, {
            method:"POST",
            body:fd
        });
        if(!response) {
            alert('Error communicating with server.');
            return;
        }
        if(response.status === 201) {
            alert(`File${files.length > 1 ? "s": ""} uploaded successfully`);
        } else {
            alert(await response.text());
        }
        if(fileInput.current) fileInput.current.value = "";
    }

    async function downloadFiles() {
        const response = await fetch(`${backendAddress}/reimbursements/${id}/download`);
        if(!response) {
            alert('Error communicating with server.');
            return;
        }
        if(response.status === 200) {
            const blob:Blob = await response.blob();
            const url = URL.createObjectURL(blob);
            if(downloadAnchor.current) {
                downloadAnchor.current.href = url;
                downloadAnchor.current.click();
                URL.revokeObjectURL(url);
                downloadAnchor.current.href = "#!";
            } else {
                alert('Error while trying to download files to your computer.');
            }
        } else {
            alert(await response.text());
        }
    }

    const ManagerButtons = () => {
        switch(props.status) {
            case ReimbursementStatus.pending: {
                return (<>
                    <button className="btn btn-outline-success" onClick={() => updateReimbursement('approved')}>Approve</button>
                    <button className="btn btn-outline-danger" onClick={() => updateReimbursement('denied')}>Deny</button>
                </>)
            }
            case ReimbursementStatus.approved:
            case ReimbursementStatus.denied: {
                return <button className="btn btn-outline-info" onClick={() => updateReimbursement('pending')}>Set Pending</button>;
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
                <td>{<ManagerButtons/>}
            </td></>)}
            <td>
                <label className="me-3 btn btn-info" htmlFor={`${id}_input`}>Upload Files</label>
                <input multiple className="d-none btn btn-outline-info" id={`${id}_input`} ref={fileInput} type="file" accept=".pdf,image/png,image/jpeg" onChange={uploadFile}/>
                <button className="btn btn-outline-info" onClick={downloadFiles}>Download Files</button>
                {/* eslint-disable-next-line */}
                <a ref={downloadAnchor} href="#!" download={`${id}_files.zip`} hidden={true} style={{display:"none"}}>Download Files</a>
            </td>
        </tr>)
}