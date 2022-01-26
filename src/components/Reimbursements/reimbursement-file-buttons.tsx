import { useEffect, useRef, useState } from "react";
import { backendAddress } from "../../store";


export default function FileButtons(props:{id:string}) {

    const {id} = props;

    const downloadAnchor = useRef<HTMLAnchorElement>(null);
    const fileInput = useRef<HTMLInputElement>(null);
    const [uploadClicked, setUploadClicked] = useState<{}>();
    const [downloadClicked, setDownloadClicked] = useState<{}>();

    useEffect(() => {
        if(!uploadClicked) return;
        const controller = new AbortController();
        (
            async () => {
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
                    body:fd,
                    signal:controller.signal
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
        )();
        return () => {controller.abort()}
    },[uploadClicked, id]);

    useEffect(() => {
        if(!downloadClicked) return;
        const controller = new AbortController();
        (
            async () => {
                const response = await fetch(`${backendAddress}/reimbursements/${id}/download`, {signal:controller.signal});
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
        )();
        return () => {controller.abort()}
    }, [downloadClicked, id])

    return (<>
        <label className="me-3 btn btn-info" htmlFor={`${id}_input`}>Upload Files</label>
        <input multiple className="d-none btn btn-outline-info" id={`${id}_input`} ref={fileInput} type="file" accept=".pdf,image/png,image/jpeg" onChange={
            () => setUploadClicked({...uploadClicked})}/>
        <button className="btn btn-outline-info" onClick={() => setDownloadClicked({...downloadClicked})}>Download Files</button>
        {/* eslint-disable-next-line */}
        <a ref={downloadAnchor} href="#!" download={`${id}_files.zip`} hidden={true} style={{display:"none"}}>Download Files</a>
    </>)
}