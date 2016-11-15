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
                <div className="padding">{this.state.error}</div>
            );
        }

        if (!this.state || !this.state.object) {
            return (
                <div className="padding"><em>Loading object...</em></div>
            );
        }

        return (
            <div>
                <Header title={this.state.object.label} subtitle="Object" menu={[
                    {
                        label: 'View Records',
                        link: `/records/${this.state.object.name}`,
                    },
                ]} />

                <DataTable headers={['label', 'name', 'type', 'custom', ]} records={this.state.object.fields} />
            </div>
        );
    }
}
