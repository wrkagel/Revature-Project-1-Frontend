import { render, waitFor, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { FC } from "react";
import { Provider } from "react-redux";
import EmployeePage from "../components/User/employee-page";
import ReimbursementItem, { ReimbursementStatus } from "../entities/reimbursement-item";
import { actions, backendAddress, pageStore } from "../store";

const reimbursements: ReimbursementItem[] = [{
    id: "testReimbursement", employeeId: "test", type: "type", desc: "desc", amount: 2, date: 0, status: ReimbursementStatus.approved
}];

const server = setupServer(
    rest.get<{}, { id: string }>(`${backendAddress}/reimbursements/:id`, (req, res, ctx) => {
        const { id } = req.params;
        if (id !== "test") {
            return res(ctx.status(404, "No employee with that id found."))
        }
        return res(ctx.json(reimbursements));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const testProviders: FC = ({ children }) => {

    return (
        <Provider store={pageStore}>
            {children}
        </Provider>
    )
}

test("getting an employee's reimbursements", async () => {
    const action = actions.updateUser({id:"test", name:"Steve", isManager:false, isAuthenticated:true});
    pageStore.dispatch(action);

    render(<EmployeePage />, {wrapper:testProviders})
    await waitFor(()=> screen.getAllByRole("table"));
    expect(pageStore.getState().reimbursementList).toEqual(reimbursements);
});

test("Check invalid employee id causes alert", async () => {
    const action = actions.updateUser({id:"wrong", name:"Steve", isManager:false, isAuthenticated:true});
    pageStore.dispatch(action);
    
    let alertMessage = "";
    jest.spyOn(window, 'alert').mockImplementation((message) => alertMessage = message);

    render(<EmployeePage />, {wrapper:testProviders})
    await waitFor(()=> expect(alertMessage).toBe('Failure retrieving reimbursements from server.'));
});