import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backendAddress } from "../..";
import ReimbursementItem, { ReimbursementStatus } from "../../entities/reimbursement-item";
import { actions, PageState } from "../../store";


export default function ReimbursementRow(props:ReimbursementItem) {

    const {isManager, id:userId} = useSelector((state:PageState) => state.user);
    const downloadAnchor = useRef<HTMLAnchorElement>(null);
    const dispatch = useDispatch();

    const {id, employeeId, type, desc, amount, date, status} = props;

    const fileInput = useRef<HTMLInputElement>(null);

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
        if(response.status === 404) {
            alert('No matching reimbursement found in database.')
        }
        if(response.status === 201) {
            alert(`File${files.length > 1 ? "s": ""} uploaded successfully`);
        } else {
            alert(await response.text());
        }
    }

    async function downloadFiles() {
        const response = await fetch(`${backendAddress}/reimbursements/${id}/download`);
        if(!response) {
            alert('Error communicating with server.');
            return;
        }
        if(response.status === 404) {
            alert('No matching reimbursement found in database.')
        }
        if(response.status === 200) {
            const blob:Blob = await response.blob();
            const url = URL.createObjectURL(blob);
            if(downloadAnchor.current) {
                downloadAnchor.current.href = url;
                downloadAnchor.current.click();
                URL.revokeObjectURL(url);
                downloadAnchor.current.href = "";
            } else {
                alert('Error while trying to download files to your computer.');
            }
        } else {
            alert(await response.text());
        }
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
                <td>{status === ReimbursementStatus.pending && <>
                    <button className="btn btn-outline-info" onClick={() => updateReimbursement('approved')}>Approve</button>
                    <button className="btn btn-outline-info" onClick={() => updateReimbursement('denied')}>Deny</button>
                </>}
            </td></>)}
            <td>
                <input multiple className="btn btn-secondary" id="fileInput" ref={fileInput} type="file" accept=".pdf,image/png,image/jpeg" onInput={uploadFile}/>
                <button onClick={downloadFiles}>Download Files</button>
                {/* eslint-disable-next-line */}
                <a ref={downloadAnchor} href="javascript:void(0)" download={`${id}_files.zip`} hidden={true} style={{display:"none"}}>Download Files</a>
            </td>
        </tr>)
}