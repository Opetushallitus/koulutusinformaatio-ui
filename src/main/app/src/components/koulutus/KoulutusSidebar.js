import React, {Component} from 'react';
import sidebarPic from '../../assets/images/student-success.jpg';
import {Localizer as l} from '../Utils';

class KoulutusSidebar extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div class="col-xs-12 col-md-3 right-column row-eq-height">
                <div class="row">
                    
                    <img class="hidden-xs" src={sidebarPic} alt=""/>
                    <div class="col-md-12 hidden-xs">
                        <p class="student-comment">
                            "Tuskin olen koskaan oppinut näin paljon näin lyhyessä ajassa. Parasta on myös loistavat luokkakaverit, jotka tekevät opiskelusta
                            vielä niin paljon antoisampaa."
                        </p>
                    </div>
                    <div class="col-md-12">
                        <h4>Tähän koulutikseen liittyviä muita koulutuksia</h4>
                    </div>
                    <div class="col-md-12">
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




