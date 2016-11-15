"use strict";

const React = require('react');
const { Header } = require('./lds');

module.exports = class Home extends React.Component {

    render() {
        return (
            <div>
                <Header title="Salesforce Exploer" />
                <div className="padding">
                    <p>Welcome...</p>
                </div>
            </div>
        );
    }
};