import { Dispatch } from "@reduxjs/toolkit";
import { useRef } from "react"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import User from "../entities/user";
import Employee from "../entities/employee";
import { actions } from "../store";
import { backendAddress } from "..";


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
        const response = await fetch(`${backendAddress}/login`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user:username, pass:password})
        })
        if(!response) {
            alert('There was an error communicating with the server.');
            return;
        }
        if(response.status === 404) {
            alert('No matching username and password found.');
            return;
        } else if (response.status !== 200) {
            alert(await response.text());
            return;
        } else if (!response.ok) {
            alert('There was an error communicating with the server.');
            return;
        }
        const employee:Employee = await response.json();
        const id:string = employee.id;
        const isManager:boolean = employee.manages ? true : false;
        const name = `${employee.fname} ${employee.mname ?? " "} ${employee.lname ?? " "}`;
        const action = actions.updateUser({name, id, isAuthenticated:true, isManager});
        dispatch(action);
        sessionStorage.setItem("name", name);
        sessionStorage.setItem("id", id);
        sessionStorage.setItem("isAuthenticated", "true");
        if(isManager) sessionStorage.setItem("isManager", "true");
        navigate(isManager ? '/manager' : '/employee');
    }

    return (<div className="flex-column d-flex p-3">
        <input className="d-inline-flex p-3" ref={nameInput} id="nameInput" placeholder="username" type="text" /><br />
        <input className="d-inline-flex p-3" ref={passInput} id="passInput" placeholder="password" type="password" /><br />
        <label className="text-center btn btn-primary" htmlFor="Login">Login</label>
        <button className="d-none" onClick={validateUser} id="Login">Login</button>
    </div>)
}