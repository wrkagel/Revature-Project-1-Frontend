import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {render, screen} from '@testing-library/react';
import Login from '../components/User/login';
import { Provider } from 'react-redux';
import { pageStore } from '../store';
import '../style/bootstrap.min.css'
import { MemoryRouter} from 'react-router-dom';
import { FC } from 'react';

window.alert = jest.fn();

const testProviders:FC = ({children}) => {
  return (
    <Provider store={pageStore}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </Provider>
  )
}

test("allows the user to login", () => {
    render(
      <Login />,
      {wrapper:testProviders}
    );

    screen.debug();
});