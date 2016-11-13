"use strict";

const jsforce = require('jsforce');
const React = require('react');
const { Link } = require('react-router');
const { Header } = require('./lds');
const querystring = require('querystring');
const keytar = require('keytar');

const KEYTAR_SERVICE = 'Salesforce Explorer';
const KEYTAR_ACCOUNT = 'Oauth';


module.exports = class App extends React.Component {

    componentWillMount() {
        const auth = JSON.parse(keytar.getPassword(KEYTAR_SERVICE, KEYTAR_ACCOUNT));

        if (auth !== null) {
            this.conn = new jsforce.Connection({
                instanceUrl: auth.instance_url,
                accessToken: auth.access_token,
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
