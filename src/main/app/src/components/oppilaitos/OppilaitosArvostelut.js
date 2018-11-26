import React, {Component} from 'react';
import Media from 'react-media';
import '../../assets/styles/components/_oppilaitos-arvostelut.scss';

class OppilaitosArvostelut extends Component{

    constructor(props) {
        super(props);
        this.state = {
            rating: undefined,
        };
        this.setRating=this.setRating.bind(this);
    }

    setRating(){
        const totalRating = this.props.ratingStars && this.props.ratingStars.reduce((rating,value) => rating +  value.star, 0);
        return totalRating;
    }

    render(){
        const ratingStars = this.props.ratingStars;
        const totalRating = this.setRating();
        return(
            <Media query="(min-width: 992px)">
                {matches => matches ? (
                        <div className="col-12 d-flex justify-content-center flex-column" id="oppilaitos-arvostelut">
                            <div className="rating d-flex justify-content-center">
                                {
                                    ratingStars.map((rating,i) =>  
                                        rating.star === 1 ? <span className="icon-ic_star" key={i} /> 
                                        : rating.star === 0 ? <span className="icon-ic_star_border" key={i} /> 
                                        : <span className="icon-ic_star_half" key={i} /> 
                                    )
                                }
                            </div>            
                        <p>88 arvostelua</p>
                    </div>
                    )
                    :
                    (
                        <div className="col-12">
                            <p><span>{totalRating}</span> {`${totalRating} \\ 88 ihmistä suositellut`}</p>
                        </div>
                    )
                }
            </Media> 

        )
    }
}

export default OppilaitosArvostelut;