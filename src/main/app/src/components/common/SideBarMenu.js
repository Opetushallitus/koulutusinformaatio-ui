import React, {Component} from 'react';
import '../../assets/styles/components/_sidebar-menu.scss';

class SideBarMenu extends Component {
    
    constructor(props) {
        super(props)   
        this.state = {
          activeIndex: this.props.selected || 0
        }
        this.toggleClass= this.toggleClass.bind(this); 
        this.selectedMenuItem = this.selectedMenuItem.bind(this);
    }
    
    toggleClass(index, e) {
        this.setState({ activeIndex: index});
        this.props.item(index);
    };
    
    selectedMenuItem(){
        this.setState({
            activeIndex: this.props.item
        });
    } 

    render() {
        const menuItems = this.props.items;

        return(
            <div className="col-12">
                <div className="row">
                    <ul className="sidebar-menu">
                        {
                            menuItems &&
                        menuItems.map((t,i) => <li key={`${i}${t}`} tabIndex="0" className={this.state.activeIndex === i ? 'active': null}  onClick={this.toggleClass.bind(this, i)} onKeyPress={(e) => this.toggleClass(i)}><span>    {t}</span></li>)
                        }                   
                    </ul>
                </div>            
            </div>
        );
    }
}

export default SideBarMenu;