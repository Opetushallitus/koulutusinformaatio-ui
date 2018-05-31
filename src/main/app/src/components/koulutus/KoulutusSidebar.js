import React, {Component} from 'react';
import sidebarPic from '../../assets/images/Caucasian-College-Student-Female.jpg';

class KoulutusSidebar extends Component {

    render() {
        return (
            <div className="col-xs-12 col-md-3 right-column">
                <div className="row">
                    
                    <img className="hidden-xs" src={sidebarPic} alt=""/>

                </div>
            </div>
        );
    }
}

export default KoulutusSidebar;




