import { LightningElement, track } from 'lwc';
import handleForgotPassword from '@salesforce/apex/ForgotPasswordController.handleForgotPassword';
import REVA_IMAGES from '@salesforce/resourceUrl/revaAdmissionImages';
import maskBg from '@salesforce/resourceUrl/Mask_Group_6';
import lifeAtRevaWebp from '@salesforce/resourceUrl/life_at_reva_webp';
import footerLogo from '@salesforce/resourceUrl/image';
import NUNITO from '@salesforce/resourceUrl/NunitoSans';
import { loadStyle } from 'lightning/platformResourceLoader';

export default class CustomForgotPasswordNew extends LightningElement {
    revaLogoUrl = REVA_IMAGES + '/reva-logo.png';
    naacLogoUrl = REVA_IMAGES + '/naac-logo.png';
    revaVideoUrl = 'https://www.reva.edu.in/new-admissions/images/reva-video.mp4';
    lifeAtRevaWebpUrl = lifeAtRevaWebp;
    footerLogoUrl = footerLogo;
    maskBgUrl = maskBg;

    @track isScrolled = false;
    styleAdded = false;

    // Slider state
    _slidersInitialized = false;
    _shapingIndex = 0;
    _statsIndex = 0;
    _accreditedIndex = 0;
    _shapingTimer = null;
    _statsTimer = null;
    _accreditedTimer = null;
    _shapingTotal = 2;
    _statsTotal = 4;
    _accreditedTotal = 5;

    @track showFloatingBtn = false;

    get isRegistrationForm() {
        return false;
    }

    get isLoginForm() {
        return false;
    }

    get isOtpForm() {
        return false;
    }

    get isForgotForm() {
        return true;
    }

    get wrapperStyle() {
        const isMobile = window.matchMedia('(max-width: 767px)').matches;
        const bannerUrl = isMobile
            ? REVA_IMAGES + '/reva-banner-Mobile.webp'
            : REVA_IMAGES + '/reva-banner-desktop.png';
        return `background-image: url('${bannerUrl}');`;
    }

    get placementStyle() {
        return `background-image: url('${REVA_IMAGES}/placement-reva-bg-2026.webp');`;
    }

    get headerClass() {
        return 'reva-header' + (this.isScrolled ? ' scrolled' : '');
    }

    handleApplyNowClick() {
        window.location.href = 'https://admission.reva.edu.in';
    }

    connectedCallback() {
        loadStyle(this, NUNITO + '/fonts.css')
            .then(() => {
                console.log('Nunito Sans loaded');
            })
            .catch(error => {
                console.error('Font load failed', error);
            });
        window.addEventListener('scroll', this.handleWindowScroll);
    }

    disconnectedCallback() {
        window.removeEventListener('scroll', this.handleWindowScroll);
        // Clear all slider timers
        clearInterval(this._shapingTimer);
        clearInterval(this._statsTimer);
        clearInterval(this._accreditedTimer);
    }

    renderedCallback() {
        if (!this.styleAdded) {
            this.styleAdded = true;
            const style = document.createElement('style');
            style.innerText = `
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Roboto+Slab:wght@100..900&display=swap');
                html, body {
                    font-family: "Roboto Slab", serif !important;
                    overflow-x: hidden !important;
                }
                .siteforceContentArea, 
                .comm-layout-column, 
                .ui-widget,
                .cb-section_column {
                    padding: 0 !important;
                    margin: 0 !important;
                    max-width: 100% !important;
                    background: transparent !important;
                    box-shadow: none !important;
                    border: none !important;
                }
                /* Hide Salesforce community theme footer layout */
                footer:not(.reva-footer),
                .forceCommunityThemeFooter,
                .themeFooter,
                c-rev-adm-home-footer {
                    display: none !important;
                }
                /* Hide the default lightning-input border and outline */
                .input-icon-container lightning-input input,
                .input-icon-container lightning-input .slds-input {
                    border: none !important;
                    border-color: transparent !important;
                    background: transparent !important;
                    box-shadow: none !important;
                    height: 36px !important;
                    padding-left: 46px !important;
                }
                /* Make the absolute red icon container span the height perfectly inside the clipped container */
                .input-icon-container .input-field-icon {
                    height: 38px !important;
                    width: 36px !important;
                    left: 0 !important;
                    top: 0 !important;
                    border-radius: 0 !important;
                    background-color: #ffffff !important;
                }
                /* Force the custom icon SVGs to be red */
                .input-icon-container .input-field-icon svg,
                .input-icon-container .input-field-icon .slds-icon {
                    fill: #be2e26 !important;
                    color: #be2e26 !important;
                }
                /* Hide Salesforce default error/warning icons and help texts */
                lightning-input .slds-input__icon,
                lightning-input lightning-icon[icon-name="utility:error"],
                lightning-input .slds-has-error .slds-input__icon_left,
                lightning-input .slds-has-error .slds-input__icon,
                .slds-has-error .slds-input__icon,
                .slds-form-element__control .slds-input__icon,
                lightning-input .slds-form-element__help,
                .slds-form-element__help {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Initialize sliders after first render
        if (!this._slidersInitialized) {
            this._slidersInitialized = true;
            this._updateTotals();
            this._setupClones();
            this._startAutoPlay();
            window.addEventListener('resize', () => {
                this._updateTotals();
                this._setupClones();
            });
        }
    }

    _updateTotals() {
        const isMobile = window.innerWidth < 768;
        this._statsTotal = isMobile ? 8 : 4;
        this._accreditedTotal = isMobile ? 9 : 5;
    }

    _setupClones() {
        const isMobile = window.innerWidth < 768;
        const sliders = this.template.querySelectorAll('.reva-slider');
        sliders.forEach(slider => {
            const track = slider.querySelector('.reva-slider__track');
            if (!track) return;
            
            // Clean up existing clones if any
            const existingClones = track.querySelectorAll('.reva-clone');
            existingClones.forEach(clone => clone.remove());

            const slides = Array.from(track.querySelectorAll('.reva-slider__slide'));
            if (slides.length === 0) return;

            const sliderName = slider.dataset.slider;
            let numToClone = 1;
            if (!isMobile && (sliderName === 'stats' || sliderName === 'accredited')) {
                numToClone = 2;
            }

            for (let i = 0; i < numToClone; i++) {
                if (slides[i]) {
                    const clone = slides[i].cloneNode(true);
                    clone.classList.add('reva-clone');
                    track.appendChild(clone);
                }
            }
        });
    }

    _startAutoPlay() {
        this._shapingTimer = setInterval(() => {
            this._shapingIndex = (this._shapingIndex + 1) % this._shapingTotal;
            this._goToSlide('shaping', this._shapingIndex);
        }, 3000);

        this._statsTimer = setInterval(() => {
            this._statsIndex = (this._statsIndex + 1) % this._statsTotal;
            this._goToSlide('stats', this._statsIndex);
        }, 3000);

        this._accreditedTimer = setInterval(() => {
            this._accreditedIndex = (this._accreditedIndex + 1) % this._accreditedTotal;
            this._goToSlide('accredited', this._accreditedIndex);
        }, 3000);
    }

    _goToSlide(sliderName, index) {
        const slider = this.template.querySelector(`[data-slider="${sliderName}"]`);
        if (!slider) return;

        const track = slider.querySelector('.reva-slider__track');
        const dots = slider.querySelectorAll('.reva-slider__dot');

        if (track) {
            const total = sliderName === 'shaping' ? this._shapingTotal : (sliderName === 'stats' ? this._statsTotal : this._accreditedTotal);
            
            if (index === 0 && track.style.transform && track.style.transform !== 'translateX(0px)' && track.style.transform !== 'translateX(0%)') {
                // Transition to the cloned first slide at index = total
                track.style.transition = 'transform 0.5s ease-in-out';
                track.style.transform = `translateX(-${total * 100}%)`;

                // Snap back to 0 without transition after animation finishes
                setTimeout(() => {
                    track.style.transition = 'none';
                    track.style.transform = 'translateX(0%)';
                    // Force layout reflow
                    track.offsetHeight;
                    // Restore transition
                    track.style.transition = 'transform 0.5s ease-in-out';
                }, 500);
            } else {
                track.style.transition = 'transform 0.5s ease-in-out';
                track.style.transform = `translateX(-${index * 100}%)`;
            }
        }

        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    toggleVideo() {
        const videoElement = this.template.querySelector('.video-iframe');
        const playButton = this.template.querySelector('.play-button');
        const thumb = this.template.querySelector('.video-thumb');

        if (videoElement) {
            if (videoElement.paused) {
                videoElement.play();
                if (playButton) playButton.style.display = 'none';
                if (thumb) thumb.style.display = 'none';
            } else {
                videoElement.pause();
                if (playButton) playButton.style.display = 'flex';
                if (thumb) thumb.style.display = 'block';
            }
        }
    }

    handleWindowScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 20) {
            this.isScrolled = true;
        } else {
            this.isScrolled = false;
        }

        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0) {
            this.showFloatingBtn = (scrollTop / scrollHeight) >= 0.3;
        } else {
            this.showFloatingBtn = false;
        }
    }

    scrollToForm(event) {
        if (event) {
            event.preventDefault();
        }
        const formElement = this.template.querySelector('.auth-card');
        if (formElement) {
            formElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Card shell — identical dimensions and shadow as login card
    cardStyle = `
        background: #ffffff;
        border-radius: 20px;
        width: 440px;
        max-width: 92vw;
        box-shadow: 0 20px 60px rgba(0,0,0,0.40), 0 4px 16px rgba(0,0,0,0.20);
        overflow: hidden;
        position: relative;
        z-index: 10000;
        font-family: 'Nunito Sans', NunitoSans, sans-serif;
    `;

    // Inner padding — same as login card
    cardPaddingStyle = `
        padding: 38px 36px 32px 36px;
    `;

    // Title row — centered, uppercase bold
    titleRowStyle = `
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
    `;

    titleTextStyle = `
        font-size: clamp(18px, 1.8vw, 24px); 
        font-weight: 700;
        color: #000;        
        text-align: center;        
        font-family: 'Nunito Sans', NunitoSans, sans-serif;
    `;

    // Red underline — same as login card
    dividerStyle = `
        width: 56px;
        height: 3.5px;
        background: #c0392b;
        border-radius: 2px;
        margin: 0 auto 24px auto;
    `;

    // Info paragraph 1 — centered
    infoPara1Style = `
        font-size: 0.88rem;
        color: #444444;
        text-align: center;
        line-height: 1.65;
        margin: 0 0 16px 0;
        font-family: 'Nunito Sans', NunitoSans, sans-serif;
    `;

    // Info paragraph 2 — centered, slightly lighter
    infoPara2Style = `
        font-size: 0.88rem;
        color: #444444;
        text-align: center;
        line-height: 1.65;
        margin: 0 0 22px 0;
        font-family: 'Nunito Sans', NunitoSans, sans-serif;
    `;

    // Thin grey separator — same as login card
    lineDividerStyle = `
        width: 100%;
        height: 1px;
        background: #e4e9ee;
        margin-bottom: 22px;
    `;

    // Field wrapper
    fieldWrapperStyle = `
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-bottom: 20px;
    `;

    // Label — same style as login card
    labelStyle = `
        font-size: 0.9rem;
        font-weight: 700;
        color: #2c2c2c;
        font-family: 'Nunito Sans', NunitoSans, sans-serif;
        margin-bottom: 2px;
    `;

    // Red asterisk
    reqStyle = `
        color: #c0392b;
        font-weight: 700;
    `;

    // Input field — same style as login card
    inputStyle = `
        width: 100%;
        padding: 14px 16px;
        border: 1.5px solid #c8d8ea;
        border-radius: 10px;
        font-size: 0.95rem;
        color: #1a1a1a;
        outline: none;
        background: #ffffff;
        box-sizing: border-box;
        font-family: 'Nunito Sans', NunitoSans, sans-serif;
    `;

    // Hint text — same italic grey as login card
    hintTextStyle = `
        font-size: 0.78rem;
        color: #999999;
        font-style: italic;
        font-family: 'Nunito Sans', NunitoSans, sans-serif;
        padding-left: 2px;
        margin-top: 1px;
    `;

    // Button row
    btnRowStyle = `
        margin-top: 6px;
        margin-bottom: 20px;
    `;

    // Full-width blue Reset Password button
    resetBtnStyle = `
        background: #c0392b;
        color: #ffffff;
        border: none;
        border-radius: 10px;
        padding: 15px 0;
        width: 100%;
        font-size: 1.1rem;
        font-weight: 700;
        cursor: pointer;
        letter-spacing: 0.5px;        
        box-sizing: border-box;
        text-align: center;
        font-family: 'Nunito Sans', NunitoSans, sans-serif;
    `;

    // Cancel link row — centered at bottom
    cancelRowStyle = `
        display: flex;
        justify-content: center;
        padding-top: 2px;
    `;

    // Cancel hyperlink — blue, centered
    cancelLinkStyle = `
        font-size: 0.88rem;
        color: #1a6fc4;
        font-weight: 500;
        text-decoration: none;
        font-family: 'Nunito Sans', NunitoSans, sans-serif;
        cursor: pointer;
    `;

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
                } else if (result.startsWith('SUGGEST:')) {
                    const username = result.replace('SUGGEST:', '');
                    this.errorMessage = 'This is your username: ' + username + '. Please use this to reset your password.';
                } else if (result.startsWith('ERROR:')) {
                    this.errorMessage = result.replace('ERROR:', '');
                }
            })
            .catch(() => {
                this.errorMessage = 'Unexpected error occurred.';
            });
    }
}