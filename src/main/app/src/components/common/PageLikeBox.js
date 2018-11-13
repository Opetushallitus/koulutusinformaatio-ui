import React, {Component} from 'react';
import '../../assets/styles/components/_page-like-box.scss';
import ActionButton from './ActionButton';
import LikeButton from './LikeButton';

class PageLikeBox extends Component{
        
    render(){
        return(
                <div className="col-12" id="like-box">
                    <ActionButton 
                        type={this.props.type}
                        address={this.props.address}
                        text={this.props.text}
                    />
                    <LikeButton></LikeButton>
                </div>
        )
    }
}

export default PageLikeBox;