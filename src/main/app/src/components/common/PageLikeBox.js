import React, {Component} from 'react';
import Media from 'react-media';
import '../../assets/styles/components/_page-like-box.scss';
import ActionButton from './ActionButton';
import LikeButton from './LikeButton';

class PageLikeBox extends Component{
        
    render(){
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
                            <div className="row">
                                <div className="col-12 d-flex justify-content-between header"> 
                                    <span className="title">
                                        <i className="icon-ic_account_balance" />
                                        {this.props.name}
                                    </span>
                                    <LikeButton />
                                </div>
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
    }
}

export default PageLikeBox;