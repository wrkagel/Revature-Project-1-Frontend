import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { backendAddress } from "../..";
import ReimbursementItem, { ReimbursementStatus } from "../../entities/reimbursement-item";
import { actions, PageState } from "../../store";


export default function ReimbursementForm(props:{employeeId:string}) {

    const dispatch = useDispatch();

    const {id} = useSelector((state:PageState) => state.user);

    const {employeeId} = props;


    const typeInput = useRef<HTMLInputElement>(null);
    const descInput = useRef<HTMLInputElement>(null);
    const amountInput = useRef<HTMLInputElement>(null);
    const dateInput = useRef<HTMLInputElement>(null);

    const [submit, setSubmit] = useState<{}>();

    useEffect(() => {
        if(!submit) return;
        const controller = new AbortController();
        (
            async () => {
                const type:string = typeInput.current?.value ?? "";
                const desc:string = descInput.current?.value ?? "";
                const amount = amountInput.current?.valueAsNumber ?? NaN;
                const date = dateInput.current?.valueAsNumber ?? NaN;
                const {valid, alertMessage } = checkValid(type, desc, amount, date);
                if(!valid) {
                    alert(alertMessage);
                    return;
                }
        
                const newReimbursement:ReimbursementItem = {
                    type:type,
                    desc:desc,
                    amount:parseFloat(amount.toFixed(2)),
                    date: date + (new Date()).getTimezoneOffset() * 60000, // Adjust for local timezone
                    id:"",
                    employeeId: employeeId ?? id,
                    status:ReimbursementStatus.pending
                };
                const response = await fetch(`${backendAddress}/reimbursements`, {
                    method: "POST",
                    headers: {'Content-Type': 'application/json'},
                    body:JSON.stringify(newReimbursement),
                    signal:controller.signal
                })
                if(response.status === 201) {
                    alert('Submitted');
                    const returnedReimbursement:ReimbursementItem = await response.json();
                    clearForm();
                    const action = actions.addReimbursementItemToList(returnedReimbursement);
                    dispatch(action);
                } else {
                    alert(await response.text());
                }
            }
        )();
        return () => controller.abort();
    }, [submit, dispatch, employeeId, id])

    function checkValid(type:string, desc:string, amount:number, date:number) {
        let valid = true;
        let alertMessage = "";
        if(!type) {
            valid = false;
            alertMessage += "You must enter a type.\n ";
        }
        if(!desc) {
            valid = false; 
            alertMessage += "You must enter a desc.\n ";
        }
        if(!amount) {
            valid = false; 
            alertMessage += "Amount not a valid number.";
        }
        if(!date) {
            valid = false;
            alertMessage += "Date is not valid. Make sure it is in the format mm/dd/yyyy.";
        }
        return {valid, alertMessage};
    }

    function clearForm() {
        if(typeInput.current) {
            typeInput.current.value = "";
        }
        if(descInput.current) {
            descInput.current.value = "";
        }
        if(amountInput.current) {
            amountInput.current.value = "0.01";
        }
    }
    
    return (<>
    <table className="fs-5">
        <tbody>
            <tr>
                <td className="text-end"><label data-bs-placement="right" data-bs-toggle="tooltip" title="1-2 words telling what the reimbursement is for such as Groceries or Office Supplies" className="form-label" htmlFor="type"><b>Type</b></label></td>
                <td><input className="form-control" id="type" type="text" ref={typeInput} /></td>
            </tr>
            <tr>
                <td className="text-end"><label data-bs-placement="right" data-bs-toggle="tooltip" title="Longer more detailed description such as 'Reimbursement for driving mileage see attached driving logs and receipts.'" className="form-label" htmlFor="desc"><b>Description</b></label></td>
                <td><input className="form-control" id="desc" type="text" ref={descInput}/></td>
            </tr>
            <tr>
                <td className="text-end"><label data-bs-placement="right" data-bs-toggle="tooltip" title="The amount of money to be reimbursed. All numbers past two decimal places will be ignored." className="form-label" htmlFor="amount"><b>Amount</b></label></td>
                <td>
                    <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input className="form-control" id="amount" type="number" step={0.01} min={0.01} defaultValue={10} ref={amountInput}/>
                    </div>
                    </td>
            </tr>
            <tr>
                <td className="text-end"><label data-bs-placement="right" data-bs-toggle="tooltip" title="Select the date of the reimbursement. If multiple dates then select the last one and indicate in the description" className="form-label" htmlFor="date"><b>Date</b></label></td>
                <td><input className="form-control" type={"date"} id="date" ref={dateInput} /></td>
            </tr>
        </tbody>
    </table>
    <button className="btn btn-success btn-lg" onClick={() => setSubmit({...submit})}>Submit</button>
    </>)
}