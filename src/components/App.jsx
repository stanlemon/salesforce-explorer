"use strict";

const React = require('react');
const Login = require('./Login');
const Accounts = require('./Accounts');
const jsforce = require('jsforce');

module.exports = class App extends React.Component {

    componentWillMount() {
        this.setState({
            conn: new jsforce.Connection()
        });
    }

    render() {
        if (!this.props.auth) {
            return <Login {...this.props} conn={this.state.conn} />
        }

        return (
            <Accounts {...this.props} conn={this.state.conn} />
        );
    }
};