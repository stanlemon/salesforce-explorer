"use strict";

const React = require('react');

module.exports = class ObjectView extends React.Component {

    componentWillMount() {
        const { name } = this.props.params;

        this.props.conn.describe(name, (error, object) => {
            if (error) {
                console.error(error);
                this.setState({
                    error
                });
                return;
            }

            this.setState({
                object
            });
        });
    }

    render() {
        if (this.state && this.state.error) {
            return (
                <div>{this.state.error}</div>
            );
        }

        if (!this.state || !this.state.object) {
            return (
                <div><em>Loading object...</em></div>
            );
        }

        console.log(this.state.object);

        return (
            <div>
                <div>ObjectView</div>
                <ul>
                    {this.state.object.fields.map((field, i) => 
                        <li key={'field-' + i}>
                            {field.label}
                        </li>
                    )}
                </ul>
            </div>
        );
    }
}
