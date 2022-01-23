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
        <label className="btn btn-outline-dark btn-lg position-absolute end-0 mt-3" htmlFor="logoutBtn" tabIndex={0}>Logout</label>
        <button className="d-none" id="logoutBtn" onClick={logout}/>
    </>)
}