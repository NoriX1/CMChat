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
import mySaga from 'sagas/sagas';
import Header from 'components/Header/Header';
import Landing from 'components/Landing/Landing';
import GoogleAuth from 'components/GoogleAuth/GoogleAuth';
import Registration from 'components/Registration/Registration';
import RoomList from 'components/Rooms/RoomList';
import CreateRoom from 'components/Rooms/CreateRoom';
import CloseRoom from 'components/Rooms/CloseRoom';
import Toasts from 'components/Notifications/Toasts';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers, {
    auth: { authenticated: localStorage.getItem("token") }
}, composeEnhancers(applyMiddleware(sagaMiddleware)));

sagaMiddleware.run(mySaga);

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
                <Route path="/rooms/close/:id" component={CloseRoom} />
            </App>
        </Router>
    </Provider>,
    document.querySelector('#root'));