import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import EmployeePage from "./components/employee-page";
import Login from "./components/login";
import LogoutButton from "./components/logout-button";
import ManagerNavBar from "./components/manager-nav-bar";
import ManagerPage from "./components/manager-page";
import { PageState } from "./store";

function App() {

  const user = useSelector((state:PageState)=>state.user);

  return (<>
    <h1>Reimbursement System</h1>
    <BrowserRouter>
    {user.name && <h2>Welcome {user.name}</h2>}
    {user.isManager && <ManagerNavBar />}
    {user.isAuthenticated ? 
      <>
        <LogoutButton /><br />
        <Routes>
          <Route path='/employee' element={<EmployeePage />}/>
          <Route path='/manager/*' element={<ManagerPage />}/>
        </Routes>
      </>
      :
      <>
        <Routes>
          <Route path='/login' element={<Login />}/>
          <Route path='*' element={<Navigate to={"/login"}/>}/>
        </Routes>
      </>}
    </BrowserRouter>
  </>);
}

export default App;
