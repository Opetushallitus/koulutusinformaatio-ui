import React, {Component} from 'react';
import ActionButton from './ActionButton';
import SchoolImage from '../../assets/images/school.jpg';

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
                    result=item.postitoimipaikka.charAt(0).toUpperCase() + item.postitoimipaikka.slice(1).toLowerCase()
                }
                return result;
            }, "---"),
            website: data && data.reduce((result,item) => {
                if(item.www !== undefined){
                    result=item.www
                }
                return result;
            },"---")
            
        }
        return contactData;
    }
    
    render(){
        const contactData = this.createContactData();
        return(
            <div className="d-flex justify-content-between">
                <div className="d-flex contact-data">
                    <img alt="school" className="align-self-center" src={SchoolImage}></img>
                    <ul>
                        <li>{contactData.name}</li>
                        <li>{`${contactData.address}, ${contactData.postNo} ${contactData.city}`}</li>
                        <li>{`Puhelin: ${contactData.phoneNumber}`}</li>
                    </ul>
                </div>                
                <div className="d-none d-lg-flex flex-column justify-content-center">
                    <ActionButton type="link" address={contactData.email} text="Lähetä sähköpostia"/>
                </div>
            </div>
        )
    }
}

export default ContactInfoRow;