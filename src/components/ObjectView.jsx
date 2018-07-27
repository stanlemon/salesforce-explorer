import React from 'react';
import Header from './lds/Header';
import DataTable from './lds/DataTable';

export default class ObjectView extends React.Component {
    componentWillMount() {
        this.loadDescribe(this.props);
    }

    componentWillReceiveProps(props) {
        this.loadDescribe(props);
    }

    loadDescribe(props) {
        console.log(this.props);
        const { conn, route } = props;
        const { params } = route;
        const { name } = params;

        if (!conn) return;

        conn.describe(name, (error, object) => {
            if (error) {
                console.error(error);
                this.setState({
                    error,
                });
                return;
            }

            this.setState({
                object,
            });
        });
    }

    render() {
        if (this.state && this.state.error) {
            return <div className="padding">{this.state.error}</div>;
        }

        if (!this.state || !this.state.object) {
            return (
                <div className="padding">
                    <em>Loading object...</em>
                </div>
            );
        }

        return (
            <div>
                <Header
                    title={this.state.object.label}
                    subtitle="Object"
                    menu={[
                        {
                            label: 'View Records',
                            link: `/records/${this.state.object.name}`,
                        },
                    ]}
                />

                <DataTable
                    headers={['label', 'name', 'type', 'custom']}
                    records={this.state.object.fields}
                />
            </div>
        );
    }
}
