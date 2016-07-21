"use strict";

const React = require('react');
const { Link } = require('react-router');
const { Header, DataTable } = require('./lds');

module.exports = class ObjectList extends React.Component {

    componentWillMount() {
        this.props.conn.describeGlobal((error, res) => {
            if (error) {
                console.error(error);
                this.setState({
                    error
                });
                return;
            }

            this.setState({
                objects: res.sobjects
            });
        });
    }

    render() {
        if (this.state && this.state.error) {
            return (
                <div>{this.state.error.message}</div>
            );
        }

        if (!this.state || !this.state.objects) {
            return (
                <div><em>Loading objects...</em></div>
            );
        }

        return (
            <div>
                <Header title="Objects"/>
                <DataTable
                    headers={['keyPrefix', 'name', 'label', 'custom']}
                    records={this.state.objects}
                    onClick={(record) => {
                        this.props.router.push(`/objects/${record.name}`)
                    }}
                />
            </div>
        );
    }
};
