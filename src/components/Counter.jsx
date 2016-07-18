"use strict";

const React = require('react');

module.exports = class Counter extends React.Component {

    render() {
        return (
            <div>
                <h1>Counter: {this.props.counter}</h1>

                <button onClick={this.props.actions.increment}>Increment</button>
            </div>
        );
    }
};