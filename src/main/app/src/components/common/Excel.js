import React, {Component} from 'react';
import '../../assets/styles/components/_excel.scss';
import {translate} from 'react-i18next';
import {Localizer as l} from "../../tools/Utils";
import csv from 'csvtojson';


@translate()
class Excel extends Component {
    constructor(props) {
        super(props)
        this.state = {};
    }

    componentDidMount() {
        const lang = l.getLanguage();
        const t = ((this.props.data.fields || {}).taulukko || {})[lang];
        const self = this;
        csv({flatKeys: true, delimiter: ';'})
            .fromString(t)
            .then(resp => {
                self.setState({table: resp})
            });
    }

    render() {
        const firstRow = (this.state.table || [null])[0];
        if (firstRow) {
            const id = Object.entries(firstRow).map(([name]) => name).join();
            return (
                <table className="excel-table">
                    <thead>
                    <tr>
                        {Object.entries(firstRow).map((entry) => {
                            const [name] = entry;
                            return <th key={`${id}${name}`}>{name}</th>;
                        })}
                    </tr>
                    </thead>
                    <tbody>
                        {this.state.table.map((row,index) => {
                            return <tr key={`${id}${index}`}>
                                    {Object.entries(row).map((cell,ord) => {
                                        const [,name] = cell;
                                        return <td key={`${id}${index}-${ord}`}>{name}</td>;
                                    })}
                            </tr>;
                        })}
                    </tbody>
                </table>);
        } else {
            return null;
        }
    }
}

export default Excel;
