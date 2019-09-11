import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';

import App from 'components/App';
import reducers from 'reducers';
import Header from 'components/Header/Header';
import Landing from 'components/Landing/Landing';
import GoogleAuth from 'components/GoogleAuth/GoogleAuth';
import Registration from 'components/Registration/Registration';
import RoomList from 'components/Rooms/RoomList';
import CreateRoom from 'components/Rooms/CreateRoom';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, {
    auth: { authenticated: localStorage.getItem("token") }
}, composeEnhancers(applyMiddleware(reduxThunk)));

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App>
                <Route path="/" component={Header} />
                <Route exact path="/" component={Landing} />
                <Route path="/google/:token" component={GoogleAuth} />
                <Route path="/register" component={Registration} />
                <Route exact path="/rooms" component={RoomList} />
                <Route path="/rooms/new" component={CreateRoom} />
            </App>
        </BrowserRouter>
    </Provider>,
    document.querySelector('#root'));