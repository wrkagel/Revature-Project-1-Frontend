import { useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Employee from "../entities/employee";
import ReimbursementItem from "../entities/reimbursement-item";
import { actions, PageState } from "../store";
import ReimbursementTable from "./reimbursement-table";
import StatisticsPage from "./statistics-page";


export default function ManagerPage() {

    const id = useSelector((state:PageState) => state.user.id);
    const dispatch = useDispatch();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const employeeInput = useRef<HTMLSelectElement>(null);
    useLayoutEffect(() => {(async () => {        
        const action = actions.updateReimbursementList([]);
        dispatch(action);
        const response = await fetch(`http://localhost:5000/employees/${id}`);
        const {manages} = await response.json();
        const response2 = await fetch('http://localhost:5000/employees/managed', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(manages)
        })
        const employees:Employee[] = await response2.json();
        setEmployees(employees)})()}, [id, dispatch]);

    async function updateReimbursementList() {
        const id:string = employeeInput.current?.value ?? "";
        if(!id) return;
        const response = await fetch(`http://localhost:5000/reimbursements/${id}`);
        const reimbursements:ReimbursementItem[] = await response.json();
        const action = actions.updateReimbursementList(reimbursements);
        dispatch(action);
    }

    return (<>
        <h3>You are on the Manager Page</h3>
        <Routes>
            <Route path={'/statistics'} element={<StatisticsPage />}/>
            <Route path={'/reimbursements'} element={<>
                <label htmlFor="employeeInput">Choose an Employee</label>
                <select defaultValue={""} onChange={updateReimbursementList} ref={employeeInput} id="employeeInput">
                    <option value="">Please choose an option</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.fname + (e.mname ?? "") + (e.lname ?? "")}</option>)}
                </select>
                <ReimbursementTable />
            </>}>
            </Route>
        </Routes>
    </>)
}