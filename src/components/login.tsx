import { Dispatch } from "@reduxjs/toolkit";
import { useRef } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import User from "../models/user";
import { actions } from "../store";


export default function Login() {

    const nameInput = useRef<HTMLInputElement>(null);
    const passInput = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch<Dispatch<{type:string, payload:User}>>();
    const navigate = useNavigate();

    function validateUser() {
        //Dummy code to be fixed after Backend created
        const dummyUser:User = {isAuthenticated:true, id:'007', isManager:false}
        const action = actions.updateUser(dummyUser);
        dispatch(action);
        navigate(dummyUser.isManager ? '/manager' : '/employee');
    }

    return (<>
        <input ref={nameInput} id="nameInput" placeholder="username" type="text" /><br />
        <input ref={passInput} id="passInput" placeholder="password" type="text" /><br />
        <button onClick={validateUser}>Login</button>
    </>)
}