import { LightningElement, track } from 'lwc';
// import login from '@salesforce/apex/ExperienceLoginController.login';
import banner from '@salesforce/resourceUrl/applicant_portal_banner';

export default class StudentAdmissionParent extends LightningElement {
    // @track username = '';
    // @track password = '';
    // @track error;
    // isLoading = false;

    backgroundStyle = `background-image: url(${banner});`;

    // handleUsername(event){
    //     this.username = event.target.value;
    // }

    // handlePassword(event){
    //     this.password = event.target.value;
    // }

    // async handleLogin(){

    //     this.error = null;

    //     if(!this.username || !this.password){
    //         this.error = 'Please enter username and password.';
    //         return;
    //     }

    //     this.isLoading = true;

    //     try{
    //         const redirectUrl = await login({
    //             username: this.username,
    //             password: this.password
    //         });

    //         window.location.assign(redirectUrl);

    //     } catch(error){
    //         console.log('Error:: '+JSON.stringify(error));
    //         this.error = 'Login failed. Please try again.';
    //     } finally{
    //         this.isLoading = false;
    //     }
    // }
}