import React, {Component} from 'react';
import sidebarPic from '../../assets/images/Caucasian-College-Student-Female.jpg';
import {Localizer as l} from '../../tools/Utils';

class KurssiSidebar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="col-xs-12 col-md-3 koulutusSidebar right-column">
                <div class="row">
                    
                    <img class="hidden-xs" src={sidebarPic} alt=""/>

                </div>
            </div>
        );
    }
}

export default KurssiSidebar;




