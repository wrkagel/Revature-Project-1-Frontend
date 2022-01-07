import { Route, Routes } from "react-router-dom";
import ManagerNavBar from "./manager-nav-bar";
import ReimbursementTable from "./reimbursement-table";
import StatisticsPage from "./statistics-page";


export default function ManagerPage() {

    return (<>
        <h3>You are on the Manager Page</h3>
        <Routes>
            <Route path={'/statistics'} element={<StatisticsPage />}/>
            <Route path={'/reimbursements'} element={<>
                <select className="" id=""></select>
                <ReimbursementTable />
            </>}>
            </Route>
        </Routes>
    </>)
}