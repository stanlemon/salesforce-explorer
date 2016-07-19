const React = require('react');
const ReactDOM = require('react-dom');
const { Router, Route, IndexRoute, browserHistory } = require('react-router');

const { createStore, bindActionCreators } = require('redux');
const { Provider, connect } = require('react-redux');

const actions = require('./actions');
const reducer = require('./reducer/');

const store = createStore(reducer);

if (process.env.NODE_ENV === 'development') {
    require('watch-glob')(['src/reducer/**/*.js'], {callbackArg: 'absolute'}, f => {
        console.log('Hot reload reducer', f);
        delete require.cache[require.resolve(f)];
        const nextReducer = require(f);
        store.replaceReducer(nextReducer);
    });
}

const App = require('./components/App');
const Home = require('./components/Home');
const ObjectList = require('./components/ObjectList');
const ObjectView = require('./components/ObjectView');

const Root = connect(state => state, dispatch => {
    return { actions: bindActionCreators(actions, dispatch) };
})(App);

const path = __dirname + '/index.html';

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
            <Route path={path} component={Root}>
                <IndexRoute component={Home}/>
                <Route path="/objects" component={ObjectList}/>
                <Route path="/objects/:name" component={ObjectView}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);
