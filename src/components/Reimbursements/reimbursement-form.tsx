import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { backendAddress } from "../..";
import ReimbursementItem, { ReimbursementStatus } from "../../entities/reimbursement-item";
import { actions, PageState } from "../../store";


export default function ReimbursementForm() {

    const dispatch = useDispatch();

    const {id, employeeId} = useSelector((state:PageState) => state.user);


    const typeInput = useRef<HTMLInputElement>(null);
    const descInput = useRef<HTMLInputElement>(null);
    const amountInput = useRef<HTMLInputElement>(null);
    const dateInput = useRef<HTMLInputElement>(null);

    async function addReimbursement() {
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
        alert('Submitted');
        const response = await fetch(`${backendAddress}/reimbursements`, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(newReimbursement)
        })
        if(response.status === 200) {
            const returnedReimbursement:ReimbursementItem = await response.json();
            clearForm();
            const action = actions.addReimbursementItemToList(returnedReimbursement);
            dispatch(action);
        } else {
            alert(await response.text());
        }
    }

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
    <table>
        <tbody>
            <tr>
                <td><label htmlFor="type">Type</label></td>
                <td><input id="type" type="text" ref={typeInput} /></td>
            </tr>
            <tr>
                <td><label htmlFor="desc">Description</label></td>
                <td><input id="desc" type="text" ref={descInput}/></td>
            </tr>
            <tr>
                <td><label htmlFor="amount">Amount</label></td>
                <td><input id="amount" type="number" step={0.01} min={0.01} defaultValue={10} ref={amountInput}/></td>
            </tr>
            <tr>
                <td><label htmlFor="date">Date</label></td>
                <td><input type={"date"} id="date" ref={dateInput} /></td>
            </tr>
        </tbody>
    </table>
    <button className="btn btn-secondary" onClick={addReimbursement}>Submit</button>
    </>)
}