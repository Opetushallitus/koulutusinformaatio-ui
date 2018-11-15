import React, {Component} from 'react';
import '../../assets/styles/components/_like-button.scss';

class LikeButton extends Component{
    
    constructor(props) {
        super(props)
        this.toggleClass= this.toggleClass.bind(this);
        this.state = {
          likedState: false
        }
    }
    
    toggleClass() {
        this.setState({ 
            likedState: !this.state.likedState 
        });
    };

    render(){
        const iconClass = this.state.likedState ? "ic_favorite" : "ic_favorite_border";
        const buttonClass = !this.state.likedState ? "" : "liked";
        const buttonText = !this.state.likedState ? "Tykää" : "Tykätty";
        return(
        <div className = {`like-button ${buttonClass}`} onClick={this.toggleClass}>
            <i className={"icon-" + iconClass}></i>
            <span>{buttonText}</span>
        </div>
        )
    }
}

export default LikeButton;