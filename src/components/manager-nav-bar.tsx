import { NavLink} from "react-router-dom";


export default function ManagerNavBar() {

    return (<>
        <table>
            <tbody>
                <tr><td><NavLink to={'/manager/reimbursements'}>Reimbursements</NavLink></td><td><NavLink to={'/manager/statistics'}>Statistics</NavLink></td></tr>
            </tbody>
        </table>
    </>)
}