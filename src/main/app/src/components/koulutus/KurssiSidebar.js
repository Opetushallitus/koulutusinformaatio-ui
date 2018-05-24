import React, {Component} from 'react';
import sidebarPic from '../../assets/images/Caucasian-College-Student-Female.jpg';

class KurssiSidebar extends Component {

    render() {
        return (
            <div className="col-xs-12 col-md-3 koulutusSidebar right-column">
                <div className="row">
                    
                    <img className="hidden-xs" src={sidebarPic} alt=""/>

                </div>
            </div>
        );
    }
}

export default KurssiSidebar;




