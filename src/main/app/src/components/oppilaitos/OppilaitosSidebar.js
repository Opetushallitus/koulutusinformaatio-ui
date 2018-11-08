import React, {Component} from 'react';
import SideBarMenu from '../common/SideBarMenu';
import Media from 'react-media';

class OppilaitosSidebar extends Component {

    render() {
        const menuElements = this.props.items;
        const selectedItem =  this.props.selected || 0; 
        return (

            <Media query="(min-width: 992px)">
                {
                    matches => matches ? (
                    <div className="col-md-4 col-lg-4 col-xl-3" id="side-bar">                        
                        <div className={"col-12 type-" + this.props.name}>
                            <h2>{this.props.name}</h2>
                        </div>
                        <SideBarMenu items={menuElements} item={this.props.item} selected={selectedItem}/>
                    </div>
                                            
                    ):(null)
                }
            </Media>   
        );
    }
}

export default OppilaitosSidebar;




