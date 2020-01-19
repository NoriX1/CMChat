import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import App from 'components/App';
import history from './history';
import reducers from 'reducers';
import rootSaga from 'sagas/sagas';
import Header from 'components/Header/Header';
import Landing from 'components/Landing/Landing';
import GoogleAuth from 'components/GoogleAuth/GoogleAuth';
import Registration from 'components/Users/Registration';
import RoomList from 'components/Rooms/RoomList';
import CreateRoom from 'components/Rooms/CreateRoom';
import CloseRoom from 'components/Rooms/CloseRoom';
import Toasts from 'components/Notifications/Toasts';
import Room from 'components/Rooms/Room';
import EditUser from 'components/Users/EditUser';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = process.env.NODE_ENV === 'development' ?
  createStore(reducers, { auth: { authenticated: localStorage.getItem("token") } }, composeEnhancers(applyMiddleware(sagaMiddleware))) :
  createStore(reducers, { auth: { authenticated: localStorage.getItem("token") } }, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App>
        <Route path="/" component={Header} />
        <Route path="/" component={Toasts} />
        <Route exact path="/" component={Landing} />
        <Route path="/google/:token" component={GoogleAuth} />
        <Route path="/register" component={Registration} />
        <Route exact path="/rooms" component={RoomList} />
        <Route path="/rooms/new" component={CreateRoom} />
        <Route path="/room/:id" component={Room} />
        <Route path="/rooms/close/:id" component={CloseRoom} />
        <Route path="/profile" component={EditUser} />
      </App>
    </Router>
  </Provider>,
  document.querySelector('#root'));