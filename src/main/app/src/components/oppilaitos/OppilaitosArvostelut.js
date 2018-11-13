import React, {Component} from 'react';
import '../../assets/styles/components/_oppilaitos-arvostelut.scss';

class OppilaitosArvostelut extends Component{
render(){
    const ratingStars = this.props.rating;
    return(
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
}
}

export default OppilaitosArvostelut;