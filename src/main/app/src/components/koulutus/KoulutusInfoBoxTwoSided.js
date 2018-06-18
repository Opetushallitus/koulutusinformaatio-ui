import React, {Component} from 'react';

class KoulutusInfoBoxTwoSided extends Component {

    // Odottaa saavansa parametrina objektin, jonka kentät left ja right sisältävät taulukon varsinaisen sisällön.
    // otsikkoLeft ja otsikkoRight voivat olla myös tyhjiä, jos otsikkoa ei haluta rendata toiselle tai molemmille puolille.
    render () {
        if(!this.props.fields || !this.props.fields.left || !this.props.fields.right){
            console.log("Kaksipuolista infolaatikkoa ei voitu rendata, virheelliset parametrit.")
            return null;
        }
        return (
            <div className="koulutusinfo-2">
                <div className="koulutusinfo-2-left">
                    {this.props.fields.otsikkoLeft ? <h2>{this.props.fields.otsikkoLeft}</h2> : ""}
                    <ul className="koulutusinfolaatikko-2-list-left">
                        {this.props.fields.left.map(row => row[1] && <li key={row[0]}>{row[0] + ": " + row[1]}</li>)}
                    </ul>
                </div>
                <div className="koulutusinfo-2-right">
                    {this.props.fields.otsikkoRight ? <h2>{this.props.fields.otsikkoRight}</h2> : ""}
                    <ul className="koulutusinfolaatikko-2-list-right">
                        {this.props.fields.right.map(row => row[1] && <li key={row[0]}> {row[0] + ": " + row[1]}</li>)}
                    </ul>
                </div>
            </div>
        );
    }
}

export default KoulutusInfoBoxTwoSided;