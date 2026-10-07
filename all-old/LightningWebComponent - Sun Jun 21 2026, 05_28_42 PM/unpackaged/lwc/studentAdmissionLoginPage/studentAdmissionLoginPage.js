import { LightningElement, track , api} from 'lwc';
import login from '@salesforce/apex/ExperienceLoginController.login';
import banner from '@salesforce/resourceUrl/applicant_portal_banner';
import mob from '@salesforce/resourceUrl/application_mob_bg';

export default class StudentAdmissionLoginPage extends LightningElement {
    @track username = '';
    @track password = '';
    @track error;
    @track showSpinner = false;
    isLoading = false;

     _privateTitle;

        @api
        get title() {
            return this._privateTitle;
        }

        set title(value) {
            this._privateTitle = value;
            this.setAttribute("title", this._privateTitle);
        }

        connectedCallback() {
            this.title = "REVA University - Applicant Portal";
            document.title = "REVA University - Applicant Portal";
        }

    // Full page background
    // Mobile / tablet (<= 1024px) uses application_mob_bg
    // Desktop (> 1024px) uses applicant_portal_banner
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

    // ─────────────────────────────────────────
    //  All functionality unchanged
    // ─────────────────────────────────────────

    handleUsername(event) {
        this.username = event.target.value;
    }

    handlePassword(event) {
        this.password = event.target.value;
    }

    async handleLogin() {
        this.error = null;

        if (!this.username || !this.password) {
            this.error = 'Please enter username and password.';
            return;
        }

        this.isLoading = true;
        this.showSpinner = true;

        try {
            const redirectUrl = await login({
                username: this.username,
                password: this.password
            });

            window.location.assign(redirectUrl);

        } catch (error) {
            console.log('Error:: ' + JSON.stringify(error));
            this.error = 'Login failed. Please check your credentials and try again.';
        } finally {
            this.isLoading = false;
            this.showSpinner = false;
        }
    }
}