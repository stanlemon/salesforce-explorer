'use strict';

const React = require('react');
const { Header, Panel, PanelSection, FormElement } = require('./lds');

module.exports = class RecordView extends React.Component {

    componentWillMount() {
        this.loadSObject(this.props);
    }

    componentWillReceiveProps(props) {
        this.loadSObject(props);
    }

    loadSObject(props) {
        const { conn, params } = props;
        const { name, id } = params;

        if (!conn) return;

        conn.sobject(name)
            .select('*')
            .where({ Id: id })
            .limit(1)
            .execute((error, records) => {
                if (error) {
                    console.error(error);
                    this.setState({
                        error
                    });
                    return;
                }

                this.setState({
                    record: records[0]
                });
            });
    }

    render() {
        if (!this.state) {
            return (
                <div className="padding"><em>Loading...</em></div>
            );
        }

        const keys = ['Id', 'Name'].concat(Object.keys(this.state.record).filter((v) =>
            v !== 'attributes' && v !== 'Id' && v !== 'Name'
        ).sort());

        return (
            <div>
                <Header title={this.state.record.Name} subtitle="Record" />
                <Panel>
                    <PanelSection title="Details">
                        {keys.map((key) =>
                        <FormElement key={key} label={key}>
                            {this.state.record[key] + ''}
                        </FormElement>
                        )}
                    </PanelSection>
                </Panel>
            </div>
        );
    }
};
