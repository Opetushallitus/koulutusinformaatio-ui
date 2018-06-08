import React, { Component } from 'react';
import Media from 'react-media';
import MainFooter from './MainFooter';
import MobileFooter from './MobileFooter';



class Footer extends Component {

    render()  {
        return <Media query="(max-width: 768px)">
            {matches =>
                matches ? (
                    <MobileFooter/>
                ) : (
                    <MainFooter/>
                )
            }
        </Media>
    }
}

export default Footer