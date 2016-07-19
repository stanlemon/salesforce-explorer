"use strict";

const { omit } = require('lodash');
const React = require('react');
const Login = require('./Login');
const jsforce = require('jsforce');

module.exports = class App extends React.Component {

    constructor(props) {
        super(props);

        this.conn = new jsforce.Connection();
    }

    render() {
        if (!this.props.auth) {
            return <Login {...this.props} conn={this.conn} />
        }

        return React.cloneElement(
            this.props.children,
            Object.assign({}, this.props, { conn: this.conn })
        );
    }
};
