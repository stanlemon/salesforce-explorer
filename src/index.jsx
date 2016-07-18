const React = require('react');
const ReactDOM = require('react-dom');

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

const Root = connect(state => state, dispatch => {
    return { actions: bindActionCreators(actions, dispatch) };
})(App);

ReactDOM.render(
    <Provider store={store}>
        <Root />
    </Provider>,
    document.getElementById('root')
);
