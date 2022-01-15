import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import EmployeePage from "./components/employee-page";
import Login from "./components/login";
import LogoutButton from "./components/logout-button";
import ManagerNavBar from "./components/Manager/manager-nav-bar";
import ManagerPage from "./components/Manager/manager-page";
import { PageState } from "./store";

function App() {

  const user = useSelector((state:PageState)=>state.user);

  return (<>
    <div className="jumbotron">
      <h1 className="display-3">Reimbursement System</h1>
    </div>
    <BrowserRouter>
    {user.isManager && <ManagerNavBar />}
    {user.isAuthenticated ? 
      <>
      <div>
        <h2>Welcome {user.name}<LogoutButton /></h2>
      </div>
        <Routes>
          <Route path='/employee' element={<EmployeePage />}/>
          <Route path='/manager/*' element={<ManagerPage />}/>
          <Route path='/*' element={<h2>404 Page Not Found</h2>}/>
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
