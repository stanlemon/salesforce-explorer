"use strict";

const React = require('react');
const { Link } = require('react-router');

module.exports = class Home extends React.Component {

    render() {
        return (
            <div>
                <h1>Home</h1>
                <Link to={`/objects`}>Go to Objects</Link>
            </div>
        );
    }
};