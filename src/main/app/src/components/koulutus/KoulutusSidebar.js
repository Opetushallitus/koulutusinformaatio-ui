import React, {Component} from 'react';
import sidebarPic from '../../assets/images/student-success.jpg';
import {Localizer as l} from '../../tools/Utils';

class KoulutusSidebar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="col-xs-12 col-md-3 koulutusSidebar right-column">
                <div className="row">
                    
                    <img className="hidden-xs" src={sidebarPic} alt=""/>
                    <div className="col-md-12 hidden-xs">
                        <p className="student-comment">
                            "Tuskin olen koskaan oppinut näin paljon näin lyhyessä ajassa. Parasta on myös loistavat luokkakaverit, jotka tekevät opiskelusta
                            vielä niin paljon antoisampaa."
                        </p>
                    </div>
                    <div className="col-md-12">
                        <h4>Tähän koulutukseen liittyviä muita koulutuksia</h4>
                    </div>
                    <div className="col-md-12">
                        <ul>
                            <li>
                                <a href="#">Medialan perustutkinto</a>
                            </li>
                            <li>
                                <a href="#">Medianomi AMK</a>
                            </li>
                            <li>
                                <a href="#">Kulttuurialan ylempi AMK</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default KoulutusSidebar;




