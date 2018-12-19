import React, {Component} from 'react';
import ActionButton from './ActionButton';
import {translate} from "react-i18next";
import SchoolImage from '../../assets/images/school.jpg';
import '../../assets/styles/components/_contact-info-row.scss';

@translate()
class ContactInfoRow extends Component{
    
    createContactData() {
        const data = this.props.data && this.props.data.yhteystiedot ? this.props.data.yhteystiedot : false;
        const contactData = {
            name: this.props.name || "---",
            address: data && data.reduce((result,item) => {
                if(item.osoite !== undefined){
                    result=item.osoite
                }
                return result;
            }, "---"),
            phoneNumber: data && data.reduce((result,item) => {
                if(item.numero !== undefined){
                    result=item.numero
                }
                return result;
            }, "---"),
            email: data && data.reduce((result,item) => {
                if(item.email !== undefined){
                    result=item.email
                }
                return result;
            }, "---"),
            postNo: data && data.reduce((result,item) => {
                if(item.postinumeroUri !== undefined){
                    result=item.postinumeroUri.split("_")[1]
                }
                return result;
            }, "---"),
            city: data && data.reduce((result,item) => {
                if(item.postitoimipaikka !== undefined){
                    result=`${item.postitoimipaikka.charAt(0).toUpperCase()}${item.postitoimipaikka.slice(1).toLowerCase()}`
                }
                return result;
            }, "---"),
            website: data && data.reduce((result,item) => {
                if(item.www !== undefined){
                    result=item.www
                }
                return result;
            }, false)
            
        }
        return contactData;
    }
    
    render(){
        const contactData = this.createContactData();
        const sectionType = this.props.type;
        const {t} = this.props;
        return(
            <div id="contact-info-row">
                <div className="d-flex justify-content-between">
                <div className="d-flex contact-data">
                {sectionType === "oppilaitos" &&
                    <img alt="school" className="align-self-center" src={SchoolImage}></img>
                }
                    <ul>
                        <li>{contactData.name}</li>
                        <li>{`${contactData.address}, ${contactData.postNo} ${contactData.city}`}</li>
                        {sectionType === "toteutus" && contactData.email !== "---" &&
                            <li><a href={`mailto:${contactData.email}`}>{contactData.email}</a></li>
                        }
                        <li>{`Puhelin: ${contactData.phoneNumber}`}</li>
                    </ul>
                </div>
                {sectionType === "oppilaitos" &&                
                    <div className="d-none d-lg-flex flex-column justify-content-center">
                        <ActionButton type="link" address={contactData.email} text="Lähetä sähköpostia"/>
                    </div>
                }
            </div>
                {(sectionType === "toteutus" && contactData.website) &&
                    <React.Fragment>
                            <hr className="row"></hr>
                            <div className="col-12 website">
                                <div className="row">
                                    <h3>
                                        <a className="d-flex justify-content-between" href={contactData.website}>
                                            <span className={`link-icon ${this.props.educationType}`}></span>
                                            <span className="text">{t('toteutus.kotisivu')}</span>
                                        </a>
                                    </h3>
                                </div>
                            </div>
                    </React.Fragment>    
                }
            </div>

        )
    }
}

export default ContactInfoRow;