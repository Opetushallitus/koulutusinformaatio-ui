import React, {Component} from 'react';
//import Media from 'react-media';
import '../../assets/styles/components/_page-like-box.scss';
//import ActionButton from './ActionButton';
import LikeButton from './LikeButton';

class PageLikeBox extends Component{

    render(){   
        const iconClass = "ic_keyboard_return";
        const buttonClass = "";
        const buttonText = "Lisää vertailuun";
        return(
        <div className="col-12 d-flex justify-content-between" id="like-box">
            <div role="button" aria-label={buttonText} aria-live="assertive" className = {`like-button ${buttonClass}`} onClick={this.toggleClass} onKeyPress={this.handleKeyPress} tabIndex="0">
            <i aria-label={buttonText} className={"icon-" + iconClass}></i>
            <span>{buttonText}</span>
            </div>
            <LikeButton />
        </div>
        )
    }
        
  /*render(){
        return(
            <Media query="(min-width: 992px)">
                {
                    matches => matches ? (
                        <div className="col-12 d-flex justify-content-between" id="like-box">
                            <ActionButton 
                                type={this.props.type}
                                address={this.props.address}
                                text={this.props.text}
                            />
                            <LikeButton />
                        </div>
                    )
                    :
                    (
                        <div id="like-box">
                            <div className="row" id="header">
                                <h1 className="col-12 d-flex justify-content-between"> 
                                    <span></span>
                                        <span className="title">{this.props.name}</span>
                                    <LikeButton />
                                </h1>
                            </div>
                            <div className="row">    
                                <div className="col-12">
                                    <ActionButton 
                                        type={this.props.type}
                                        address={this.props.address}
                                        text={this.props.text}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                }
            </Media>
               
        )
    }*/
}

export default PageLikeBox;