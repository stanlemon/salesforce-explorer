"use strict";

const React = require('react');

module.exports = class DataTable extends React.Component {

    render() {
        const headers = [];
        const records = [];

        return (
            <table className="slds-table slds-table--bordered slds-table--cell-buffer">
                <thead>
                    <tr className="slds-text-heading--label">
                        {headers.map((header, i) =>
                            <th key={'header-' + i} scope="col" title="{header}">
                                <div className="slds-truncate">{header}</div>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {records.map((record, i) => 
                    <tr>
                        <th scope="row" data-label="Opportunity Name" title="Cloudhub">
                            <div className="slds-truncate"><a href="javascript:void(0);">Cloudhub</a></div>
                        </th>
                        <td data-label="Account Name" title="Cloudhub">
                            <div className="slds-truncate">Cloudhub</div>
                        </td>
                        <td data-label="Close Date" title="4/14/2015">
                            <div className="slds-truncate">4/14/2015</div>
                        </td>
                        <td data-label="Prospecting" title="Prospecting">
                            <div className="slds-truncate">Prospecting</div>
                        </td>
                        <td data-label="Confidence" title="20%">20%</td>
                        <td data-label="Amount" title="$25k">$25k</td>
                        <td data-label="Contact" title="jrogers@cloudhub.com">
                            <div className="slds-truncate"><a href="javascript:void(0);">jrogers@cloudhub.com</a></div>
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
        );
    }
}
