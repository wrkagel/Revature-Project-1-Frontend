import { useDispatch } from "react-redux"
//import { useNavigate } from "react-router-dom";
import { actions } from "../store";


export default function LogoutButton() {

    const dispatch = useDispatch();
    //const navigate = useNavigate();

    function logout() {
        const action = actions.updateUser({id:"", isAuthenticated:false, isManager:false})
        dispatch(action);
    }

    return (<>
        <button id="logoutBtn" onClick={logout}>Logout</button>
    </>)
}