import React, {Component} from 'react';
import '../../assets/styles/components/_koulutus-side-bar.scss';
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
        const menuElements = [
            "Koulutuksen esittely",
            "Oppilaitokset"
        ];
        const koulutusType = this.getName();
        return (
            <div className="col-md-4 col-lg-4 col-xl-3" id="side-bar" >                        
                <div className={"col-12 type-" + this.props.type}>
                    <h2>{koulutusType}</h2>
                </div>
                <SideBarMenu items={menuElements}/>
            </div>
            
        );
    }
}

export default KoulutusSidebar;




