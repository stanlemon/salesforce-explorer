const React = require('react');
const ReactDOM = require('react-dom');
const { Router, Route, IndexRoute, hashHistory, withRouter } = require('react-router');

const { createStore, combineReducers, bindActionCreators } = require('redux');
const { Provider, connect } = require('react-redux');

const { syncHistoryWithStore } = require('react-router-redux');

const actions = require('./actions');
const reducer = require('./reducer/');

const localForage = require('localForage');
const { persistStore, autoRehydrate } = require('redux-persist');

const store = createStore(reducer, undefined, autoRehydrate());
const history = syncHistoryWithStore(hashHistory, store)

persistStore(store, { storage: localForage });

const App = require('./components/App');
const Home = require('./components/Home');
const ObjectList = require('./components/ObjectList');
const ObjectView = require('./components/ObjectView');
const RecordList = require('./components/RecordList');
const RecordView = require('./components/RecordView');
const PushTopicList = require('./components/PushTopicList');
const PushTopicView = require('./components/PushTopicView');

const Root = connect(state => state, dispatch => {
    return { actions: bindActionCreators(actions, dispatch) };
})(withRouter(App));

const path = __dirname + '/index.html';

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={Root}>
                <IndexRoute component={Home}/>
                <Route path="/objects" component={ObjectList}/>
                <Route path="/objects/:name" component={ObjectView}/>
                <Route path="/records/:name" component={RecordList}/>
                <Route path="/records/:name/:id" component={RecordView}/>
                <Route path="/push" component={PushTopicList}/>
                <Route path="/push/:id" component={PushTopicView}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);
