"use strict";

const React = require('react');

module.exports = class Login extends React.Component {

    handleLogin() {
        const username = this.username.value;
        const password = this.password.value;

        this.props.conn.login(username, password, (error, res) => {
            if (error) {
                console.error(error);
                this.setState({
                    error
                });
                return;
            }

            this.props.actions.authenticate(
                this.props.conn.accessToken,
                this.props.conn.instanceUrl
            );
        });
    }

    render() {
        return (
            <div>
                <h1>Login</h1>

                <div>
                    <input defaultValue={this.props.debugUsername} ref={(n) => this.username = n} />
                </div>

                <div>
                    <input defaultValue={this.props.debugPassword} ref={(n) => this.password = n} />
                </div>

                <button onClick={this.handleLogin.bind(this)}>Login</button>
            </div>
        );
    }
};
