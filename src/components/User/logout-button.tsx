import { useDispatch } from "react-redux"
import { actions } from "../../store";


export default function LogoutButton() {

    const dispatch = useDispatch();

    function logout() {
        sessionStorage.clear();
        const action = actions.updateUser({name: "", id:"", isAuthenticated:false, isManager:false})
        const action2 = actions.updateReimbursementList([]);
        dispatch(action2);
        dispatch(action);
    }

    return (<>
        <button className="btn btn-primary btn-lg" id="logoutBtn" onClick={logout} style={{float:"right"}}>Logout</button>
    </>)
}