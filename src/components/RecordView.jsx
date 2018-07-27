import React from 'react';
import Loading from './Loading';
import Header from './lds/Header';
import FormElement from './lds/FormElement';
import Panel from './lds/Panel';
import PanelSection from './lds/PanelSection';

export default class RecordView extends React.Component {
    componentDidMount() {
        this.loadSObject(this.props);
    }

    loadSObject(props) {
        const { conn, route } = props;
        const { params } = route;
        const { name, id } = params;

        if (!conn) return;

        conn.sobject(name)
            .select('*')
            .where({ Id: id })
            .limit(1)
            .execute((error, records) => {
                if (error) {
                    this.setState({
                        error,
                    });
                    return;
                }

                this.setState({
                    record: records[0],
                });
            });
    }

    render() {
        if (!this.state) {
            return <Loading />;
        }

        // TODO: Add error component

        const keys = ['Id', 'Name'].concat(
            Object.keys(this.state.record)
                .filter(v => v !== 'attributes' && v !== 'Id' && v !== 'Name')
                .sort()
        );

        return (
            <div>
                <Header title={this.state.record.Name} subtitle="Record" />
                <Panel>
                    <PanelSection title="Details">
                        {keys.map(key => (
                            <FormElement key={key} label={key}>
                                {this.state.record[key] + ''}
                            </FormElement>
                        ))}
                    </PanelSection>
                </Panel>
            </div>
        );
    }
}
