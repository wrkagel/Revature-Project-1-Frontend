import { NavLink} from "react-router-dom";


export default function ManagerNavBar() {

    return (<>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <ul className="navbar-nav me-auto">
                <li className="nav-item"><NavLink className={"nav-link h3"} to={'/manager/reimbursements'}>Employee Reimbursements</NavLink></li>
                <li className="nav-item"><NavLink className={"nav-link h3"} to={'/employee'}>Your Reimbursements</NavLink></li>
                <li className="nav-item"><NavLink className={"nav-link h3"} to={'/manager/statistics'}>Statistics</NavLink></li>
            </ul>
        </nav>
    </>)
}