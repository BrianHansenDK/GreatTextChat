import React from 'react';
import { Switch } from 'react-router';
import 'rsuite/dist/styles/rsuite-default.css'
import SignIn from './pages/SignIn';
import Index from './pages/Home/Index';
import './styles/main.scss';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { ProfileProvider } from './context/profile.context';

const App = () => {

  return (
    <ProfileProvider>
      <Switch>
        <PublicRoute path='/sign-in'>
          <SignIn />
        </PublicRoute>
        <PrivateRoute path='/'>
          <Index />
        </PrivateRoute>
      </Switch>
    </ProfileProvider>
  );
}

export default App;
