import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { backendAddress } from "../../store";
import Employee from "../../entities/employee";
import ReimbursementItem from "../../entities/reimbursement-item";
import { actions, PageState } from "../../store";
import ReimbursementTable from "../Reimbursements/reimbursement-table";
import StatisticsPage from "./statistics-page";

export default function ManagerPage() {

    const user = useSelector((state:PageState) => state.user);
    const dispatch = useDispatch();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const [employeeId, setEmployeeId] = useState<string>("");
    const employeeInput = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        const controller = new AbortController();
        (async () => {   
            const action = actions.updateReimbursementList([]);
            dispatch(action);
            const response = await fetch(`${backendAddress}/employees/managed/${user.id}`, {signal:controller.signal});
            const managedEmployees:Employee[] = await response.json();
            setEmployees(managedEmployees);
            setShow(true);
        })();
        return () => controller.abort();
    }, [user.id, dispatch]
    );

    async function updateReimbursementList() {
        const id:string = employeeInput.current?.value ?? "";
        if(!id) return;
        const response = await fetch(`${backendAddress}/reimbursements/${id}`);
        const reimbursements:ReimbursementItem[] = await response.json();
        const action = actions.updateReimbursementList(reimbursements);
        dispatch(action);
        setEmployeeId(id);
    }

    return (<>
        <Routes>
            <Route path={'/statistics'} element={<StatisticsPage />}/>
            {show && <>
                <Route path={'/reimbursements'} element={employees.length > 0 ? <>
                    <label htmlFor="employeeInput">Choose an Employee</label>
                    <select className="dropdown" defaultValue={""} onChange={updateReimbursementList} ref={employeeInput} id="employeeInput">
                        <option className="dropdown-item" value="">Please choose an option</option>
                        {employees.map(e => <option key={e.id} value={e.id}>{`${e.fname} ${e.mname ?? " "} ${e.lname ?? " "}`}</option>)}
                    </select>
                    {employeeId && <ReimbursementTable employeeId={employeeId}/>}</>
                    :
                    <h2>Loading Employees</h2>}>
                </Route>
            </>}
        </Routes>
    </>)
}