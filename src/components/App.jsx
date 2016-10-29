"use strict";

const jsforce = require('jsforce');
const React = require('react');
const { Link } = require('react-router');
const { Header } = require('./lds');
const querystring = require('querystring');

module.exports = class App extends React.Component {

    componentWillMount() {
        const {
            accessToken,
            instanceUrl
        } = querystring.parse(window.location.search.substring(1));

        if (accessToken && instanceUrl) {
            this.conn = new jsforce.Connection({
                instanceUrl,
                accessToken,
            });
        } // else throw an error!
    }

    logout() {
        this.conn.logout((error) => {
            if (error) {
                console.error(err);
            }
        });
    }

    render() {
        return (
            <div>
                <div className="titlebar">
                    <span style={{ color: '#fff' }} className="slds-icon_container slds-icon-standard-default" />
                    <Link to={`/`}>Home</Link> | <Link to={`/objects`}>Objects</Link> | <Link to={`/push`}>Push Topics</Link> | <a onClick={this.logout.bind(this)}>Logout</a>
                </div>

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
