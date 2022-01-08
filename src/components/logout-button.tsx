import { useDispatch } from "react-redux"
//import { useNavigate } from "react-router-dom";
import { actions } from "../store";


export default function LogoutButton() {

    const dispatch = useDispatch();
    //const navigate = useNavigate();

    function logout() {
        const action = actions.updateUser({name: "", id:"", isAuthenticated:false, isManager:false})
        const action2 = actions.updateReimbursementList([]);
        dispatch(action2);
        dispatch(action);
    }

    return (<>
        <button id="logoutBtn" onClick={logout}>Logout</button>
    </>)
}