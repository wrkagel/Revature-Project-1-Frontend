import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import ReimbursementItem, { ReimbursementStatus } from "../entities/reimbursement-item";
import { actions, pageState } from "../store";


export default function ReimbursementForm() {

    const dispatch = useDispatch();

    const {id, employeeId} = useSelector((state:pageState) => state.user);


    const typeInput = useRef<HTMLInputElement>(null);
    const descInput = useRef<HTMLInputElement>(null);
    const amountInput = useRef<HTMLInputElement>(null);

    function addReimbursement() {
        const type = typeInput.current?.value;
        const desc = descInput.current?.value;
        const amount = amountInput.current?.valueAsNumber;
        const {valid, alertMessage } = checkValid(type, desc, amount);
        if(!valid) {
            alert(alertMessage);
            return;
        }

        const newReimbursement:ReimbursementItem = {
            type:type ?? "",
            desc:desc ?? "",
            amount:amount ?? 0,
            id:"",
            employeeId: employeeId ?? id,
            status:ReimbursementStatus.pending
        };
        alert('Submitted');
        clearForm();
        const action = actions.addReimbursementItemToList(newReimbursement);
        dispatch(action);
    }

    function checkValid(type:any, desc:any, amount:any) {
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
        </tbody>
    </table>
    <button onClick={addReimbursement}>Submit</button>
    </>)
}