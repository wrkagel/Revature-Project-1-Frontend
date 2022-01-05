import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import EmployeePage from "./components/employee-page";
import Login from "./components/login";
import ManagerPage from "./components/manager-page";
import { pageState } from "./store";

function App() {

  const user = useSelector((state:pageState)=>state.user);

  return (<>
    <h1>Reimbursement System</h1>
    <BrowserRouter>
    <Routes>
    {user.isAuthenticated ? 
      <>      
      <Route path='/employee' element={<EmployeePage />}/>
      <Route path='/manager' element={<ManagerPage />}/>
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
