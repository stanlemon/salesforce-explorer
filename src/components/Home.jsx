"use strict";

const React = require('react');
const { Header } = require('./lds');

module.exports = class Home extends React.Component {

    render() {
        return (
            <div>
                <Header title="Salesforce Exploer" />
                <div style={{ padding: 10 }}>
                    <p>Welcome...</p>
                </div>
            </div>
        );
    }
};