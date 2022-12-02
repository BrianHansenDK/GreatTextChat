import React from 'react';
import { Switch } from 'react-router';
import "rsuite/dist/rsuite.min.css";
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import './styles/main.scss';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

const App = () => {

  return (
    <Switch>
      <PublicRoute path='/sign-in'>
        <SignIn />
      </PublicRoute>
      <PrivateRoute path='/'>
        <Home />
      </PrivateRoute>
    </Switch>
  );
}

export default App;