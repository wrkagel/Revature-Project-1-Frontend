import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {fireEvent, render, screen, waitFor} from '@Testing-library/react';
import Login from '../components/User/login';
import { Provider } from 'react-redux';
import { backendAddress, pageStore } from '../store';
import '../style/bootstrap.min.css'
import { MemoryRouter, Route, Routes} from 'react-router-dom';
import { FC } from 'react';
import userEvent from '@Testing-library/user-event';
import Employee from '../entities/employee';

const server = setupServer(
  rest.patch<{user:string, pass:string}, {}>(`${backendAddress}/login`, (req, res, ctx) => {
    const {user, pass} = req.body;
    const testUsers = [{user:"Employee", pass:"Employee"}, {user:"Manager", pass:"Manager"}];
    const index = testUsers.findIndex(u => {return u.user === user && u.pass === pass});
    if(index === -1) {
      return res(ctx.status(404, 'No such user found'));
    };
    const employee:Employee = {id:"test", fname:"Harvey", lname:"Harvey", manages: index ? [] : undefined};
    return res(ctx.json(employee));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const testProviders:FC = ({children}) => {

  return (
    <Provider store={pageStore}>
      <MemoryRouter initialIndex={0} initialEntries={['/login']}>
        <Routes >
          {children}
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

test("allows the user to login as an Employee", async () => {
    render(<>
        <Route path='/login' element={<Login />}/>
        <Route path='/employee' element={<h1>Employee</h1>}/>
      </>,
      {wrapper:testProviders}
    );

    userEvent.type(screen.getByPlaceholderText("username"), "Employee");
    userEvent.type(screen.getByPlaceholderText("password"), "Employee");
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByRole("heading").innerHTML).toBe("Employee");
    });
});

test("allows the user to login as a Manager", async () => {
  render(<>
    <Route path='/login' element={<Login />}/>
    <Route path='/manager' element={<h1>Manager</h1>}/>
  </>,
  {wrapper:testProviders}
  );

  userEvent.type(screen.getByPlaceholderText("username"), "Manager");
  userEvent.type(screen.getByPlaceholderText("password"), "Manager");
  fireEvent.click(screen.getByRole("button"));
  await waitFor(() => {
    expect(screen.getByRole("heading").innerHTML).toBe("Manager");
  });
});

test("alert happens when username is invalid", async () => {
  render(<Route path='/login' element={<Login />}/>, {wrapper:testProviders});
  let alertMessage = "";
  jest.spyOn(window, 'alert').mockImplementation((message) => alertMessage = message);
  userEvent.type(screen.getByPlaceholderText("username"), "Invalid");
  userEvent.type(screen.getByPlaceholderText("password"), "Manager");
  fireEvent.click(screen.getByRole("button"));
  await waitFor(() => {
    expect(alertMessage).toBe('No matching username and password found.');
  });
});

  test("alert happens when password is invalid", async () => {
    render(<Route path='/login' element={<Login />}/>, {wrapper:testProviders});
    let alertMessage = "";
    jest.spyOn(window, 'alert').mockImplementation((message) => alertMessage = message);
    userEvent.type(screen.getByPlaceholderText("username"), "Manager");
    userEvent.type(screen.getByPlaceholderText("password"), "Invalid");
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(alertMessage).toBe('No matching username and password found.');
    });
  });