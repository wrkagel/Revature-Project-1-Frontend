import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import EmployeePage from "./components/User/employee-page";
import Login from "./components/User/login";
import LogoutButton from "./components/User/logout-button";
import ManagerNavBar from "./components/Manager/manager-nav-bar";
import ManagerPage from "./components/Manager/manager-page";
import { PageState } from "./store";

function App() {

  const user = useSelector((state:PageState)=>state.user);

  return (<>
    <div className="jumbotron">
      <h1 className="display-3 text-center">Reimbursement System{user.isAuthenticated && <LogoutButton />}</h1>
    </div>
    <BrowserRouter>
    {user.isManager && <ManagerNavBar />}
    {user.isAuthenticated ? 
      <>
      <div className="jumbotron">
        <h2 className="display-4">Welcome {user.name}</h2>
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
