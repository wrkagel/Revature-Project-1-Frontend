import { Dispatch } from "@reduxjs/toolkit";
import { useRef } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import User from "../entities/user";
import Employee from "../entities/employee";
import { actions } from "../store";


export default function Login() {

    const nameInput = useRef<HTMLInputElement>(null);
    const passInput = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch<Dispatch<{type:string, payload:User}>>();
    const navigate = useNavigate();

    async function validateUser() {
        const username:string = nameInput.current?.value ?? "";
        const password:string = passInput.current?.value ?? "";
        if(!username || !password) {
            alert('Both username and password must be non-empty.')
            return;
        }
        const response = await fetch('http://localhost:5000/login', {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user:username, pass:password})
        })
        //const response = await fetch(`http://localhost:5000/login?user=${username}&&pass=${password}`);
        if(!response || !(response.ok)) {
            alert('There was an error communicating with the server.');
            return;
        }
        if(response.status === 404) {
            alert('No matching username and password found.')
            return;
        } else if (response.status !== 200) {
            alert(await response.text());
            return;
        }
        const employee:Employee = await response.json();
        const id:string = employee.id;
        const isManager:boolean = employee.manages ? true : false;
        const action = actions.updateUser({id, isAuthenticated:true, isManager});
        dispatch(action);
        navigate(isManager ? '/manager' : '/employee')
    }

    return (<>
        <input ref={nameInput} id="nameInput" placeholder="username" type="text" /><br />
        <input ref={passInput} id="passInput" placeholder="password" type="text" /><br />
        <button onClick={validateUser}>Login</button>
    </>)
}