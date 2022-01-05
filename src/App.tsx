import { useSelector } from "react-redux";
import EmployeePage from "./components/employee-page";
import Login from "./components/login";
import ManagerPage from "./components/manager-page";
import { pageState } from "./store";

function App() {

  const user = useSelector((state:pageState)=>state.user);

  return (<>
    <h1>Reimbursement System</h1>
    <Login />
    {user.isAuthenticated && (user.isManager ? <ManagerPage /> : <EmployeePage />)}
  </>);
}

export default App;
