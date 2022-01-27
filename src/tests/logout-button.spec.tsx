import { fireEvent, render, screen } from "@testing-library/react"
import { FC } from "react"
import { Provider } from "react-redux"
import LogoutButton from "../components/User/logout-button"
import { ReimbursementStatus } from "../entities/reimbursement-item"
import { actions, PageState, pageStore } from "../store"
import '../style/bootstrap.min.css'


const testProviders:FC = ({children}) => {
    return (
      <Provider store={pageStore}>
          {children}
      </Provider>
    )
}

test("logout button clears storage", () => {
    const dispatch = pageStore.dispatch;
    const action = actions.updateUser({name:"Tester", isAuthenticated:true, isManager:true, id:"test"});
    dispatch(action);
    const action2 = actions.updateReimbursementList([{id:"blank", amount:0, employeeId:"test", type:"type", desc:"desc", status:ReimbursementStatus.paid, date:0}])
    dispatch(action2);
    sessionStorage.setItem("name", "Tester");

    render(<div><LogoutButton/></div>, {wrapper:testProviders});
    fireEvent.click(screen.getByRole("button"));
    const testState:PageState = {
        user:{name:"", isAuthenticated:false, isManager:false, id:""},
        reimbursementList:[]
    };
    expect(pageStore.getState()).toEqual(testState);
    expect(sessionStorage.key(0)).toEqual(null);
})