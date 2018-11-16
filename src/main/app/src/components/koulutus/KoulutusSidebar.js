import React, {Component} from 'react';
import SideBarMenu from '../common/SideBarMenu';

class KoulutusSidebar extends Component {

    getName(){
        switch(this.props.type){
            case 'lk': return "Lukio";
            case 'kk': return "Korkeakoulu";
            case 'ako': return "Avoin";
            case 'amm' : return "Ammatillinen";
            default: return "Ammatillinen";  
        }
    }

    render() {
        const menuElements = this.props.items;
        const selectedItem =  this.props.selected || 0; 
        const koulutusType = this.getName();
        return (
            <div className="col-md-4 col-lg-4 col-xl-3" id="side-bar" >                        
                <div className={`col-12 type-${this.props.type}`}>
                    <h2 className="d-flex justify-content-between">
                        <span className="icon-ic_school"></span>
                        <span>{koulutusType}</span>
                    </h2>
                </div>
                <SideBarMenu items={menuElements} item={this.props.item} selected={selectedItem}/>
            </div>
        );
    }
}

export default KoulutusSidebar;




