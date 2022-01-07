import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import EmployeePage from "./components/employee-page";
import Login from "./components/login";
import ManagerNavBar from "./components/manager-nav-bar";
import ManagerPage from "./components/manager-page";
import { PageState } from "./store";

function App() {

  const user = useSelector((state:PageState)=>state.user);

  return (<>
    <h1>Reimbursement System</h1>
    <BrowserRouter>
    {user.isManager && <ManagerNavBar />}
    <Routes>
    {user.isAuthenticated ? 
      <>      
      <Route path='/employee' element={<EmployeePage />}/>
      <Route path='/manager/*' element={<ManagerPage />}/>
      </>
      :
      <>
      <Route path='/login' element={<Login />}/>
      <Route path='*' element={<Navigate to={"/login"}/>}/>
      </>}
    </Routes>
    </BrowserRouter>
  </>);
}

export default App;
