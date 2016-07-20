"use strict";

const React = require('react');
const { Link } = require('react-router');
const { Header, DataTable } = require('./lds');

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

        return (
            <div>
                <Header title={this.state.object.label} />
                <p>
                    <Link to={`/records/${this.state.object.name}`}>View Records</Link>
                </p>
                <DataTable headers={['label', 'name', 'type', 'custom', ]} records={this.state.object.fields} />
            </div>
        );
    }
}
