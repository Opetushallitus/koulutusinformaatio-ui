import React, {Component} from 'react';

class KoulutusType extends Component {
    
  render(){
    const koulutusType = this.props.type;
    const koulutusName = this.props.name;
    return(
        <div className={`col-12 type-${koulutusType}`}>
            <h2 className="d-flex justify-content-between">
                <span className="icon-ic_school"></span>
                <span>{koulutusName}</span>
            </h2>
        </div>
    );
  }  
}

export default KoulutusType;