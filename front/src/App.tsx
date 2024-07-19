import React, { useContext, useEffect, useState } from 'react';
import Login from './components/login';
import Register from './components/register';
import Chat from './components/chat';
import {observer} from "mobx-react-lite";
import {Context} from "./index";

const App: React.FC = () => {
  const {store} = useContext(Context);
  const [isRegisteringButton, setIsRegisteringButton] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('token')) {
        store.checkAuth()
    }
}, [])

const handleRegister = () => {
  setIsRegisteringButton(false);
};

  return (
    <div className="app">
      {!store.isAuth ? (
        isRegisteringButton ? (
          <Register onRegister={handleRegister} />
        ) : (
          <Login  onSwitchToRegister={() => setIsRegisteringButton(true)} />
        )
      ) : (
        <Chat/>
      )}
    </div>
  );
};

export default observer(App);
