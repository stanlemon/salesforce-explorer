"use strict";

const jsforce = require('jsforce');
const React = require('react');
const { Link } = require('react-router');
const Login = require('./Login');
const { Header } = require('./lds');

module.exports = class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillReceiveProps(nextProps) {
        // After rehydration we might get an accessToken, we should use it to relogin
        if (!this.props.accessToken && nextProps.accessToken) {
            this.conn = new jsforce.Connection({
                instanceUrl: nextProps.instanceUrl,
                accessToken: nextProps.accessToken,
            });
        }
    }

    componentWillMount() {
        // Our default connection object is NOT connected
        this.conn = new jsforce.Connection();
    }

    logout() {
        this.conn.logout((error) => {
            if (error) {
                console.error(err);
            }

            this.props.actions.unauthenticate();
        });
    }

    render() {
        if (!this.conn.accessToken) {
            return <Login {...this.props} conn={this.conn} />
        }

        return (
            <div>
                <p>
                    <Link to={`/`}>Home</Link> | <Link to={`/objects`}>Objects</Link> | <a onClick={this.logout.bind(this)}>Logout</a>
                </p>

                <br />

                <div>
                    {React.cloneElement(
                        this.props.children,
                        Object.assign({}, this.props, { conn: this.conn })
                    )}
                </div>
            </div>
        );
    }
};
