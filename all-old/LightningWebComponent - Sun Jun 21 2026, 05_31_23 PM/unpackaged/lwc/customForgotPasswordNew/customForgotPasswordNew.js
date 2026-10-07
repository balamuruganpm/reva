import { LightningElement, track } from 'lwc';
import banner from '@salesforce/resourceUrl/applicant_portal_banner';
import handleForgotPassword from '@salesforce/apex/ForgotPasswordController.handleForgotPassword';
import mob from '@salesforce/resourceUrl/application_mob_bg';

export default class CustomForgotPasswordNew extends LightningElement {

    get backgroundStyle() {
        const isMobileOrTablet = window.matchMedia('(max-width: 1024px)').matches;
        const bgImage = isMobileOrTablet ? mob : banner;

        return `
            background-image: url(${bgImage});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 9999;
        `;
    }


     @track username = '';
        @track errorMessage = '';
    
        handleUsernameChange(event) {
            this.username = event.target.value;
            this.errorMessage = ''; 
        }
    
        handleReset() {        
            if (!this.username) {
                this.errorMessage = 'Please enter your username.';
                return;
            }
    
          handleForgotPassword({ username: this.username })
        .then(result => {
            console.log('Result :: '+result);
            if (result === 'Success') {
                window.location.assign('./CheckPasswordResetEmail');
            }
    
            else if (result.startsWith('SUGGEST:')) {
    
                const username = result.replace('SUGGEST:', '');
    
                this.errorMessage =
                    'This is your username: ' + username +
                    '. Please use this to reset your password.';
            }
    
            else if (result.startsWith('ERROR:')) {
    
                this.errorMessage =
                    result.replace('ERROR:', '');
            }
    
        })
        .catch(() => {
            this.errorMessage = 'Unexpected error occurred.';
        });
        }
}