import { LightningElement, track, api } from 'lwc';
import maskBg from '@salesforce/resourceUrl/Mask_Group_6';
import lifeAtRevaWebp from '@salesforce/resourceUrl/life_at_reva_webp';
import footerLogo from '@salesforce/resourceUrl/image';
import REVA_IMAGES from '@salesforce/resourceUrl/revaAdmissionImages';
import { loadStyle } from 'lightning/platformResourceLoader';
import NUNITO from '@salesforce/resourceUrl/NunitoSans';

export default class StudentAdmissionParent extends LightningElement {
    @api formType;

    revaLogoUrl = REVA_IMAGES + '/reva-logo.png';
    naacLogoUrl = REVA_IMAGES + '/naac-logo.png';
    revaVideoUrl = 'https://www.reva.edu.in/new-admissions/images/reva-video.mp4';
    lifeAtRevaWebpUrl = lifeAtRevaWebp;
    footerLogoUrl = footerLogo;
    maskBgUrl = maskBg;

    get isRegistrationForm() {
        return this.currentFormType === 'registration';
    }

    get isLoginForm() {
        return this.currentFormType === 'login';
    }

    get isOtpForm() {
        return this.currentFormType === 'otp';
    }

    get isForgotForm() {
        return this.currentFormType === 'forgot';
    }

    get currentFormType() {
        if (this.formType) {
            return this.formType.toLowerCase();
        }
        const path = window.location.pathname.toLowerCase();
        if (path.includes('/login-new')) {
            return 'login';
        } else if (path.includes('/forgot-password-new')) {
            return 'forgot';
        } else if (path.includes('/otp-login')) {
            return 'otp';
        }
        return 'registration';
    }

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

    // --- Auto-play logic ---
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

    @track showFloatingBtn = false;

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

    get headerClass() {
        return 'reva-header' + (this.isScrolled ? ' scrolled' : '');
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
}