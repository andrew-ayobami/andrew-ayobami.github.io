document.addEventListener('DOMContentLoaded', function () {
    // Main form elements
    const contractAddressInput = document.getElementById('contractAddress');
    const tokenChainSelect = document.getElementById('tokenChain');
    const submitBtn = document.getElementById('submitBtn');
    
    // Token info section
    const tokenInfoSection = document.getElementById('tokenInfoSection');
    const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');

    // Duration/Placement popup elements
    const durationPlacementPopup = document.getElementById('durationPlacementPopup');
    const durationSelect = document.getElementById('duration');
    const placementSelect = document.getElementById('placement');
    const priceInput = document.getElementById('price');
    const proceedToPaymentFromPopupBtn = document.getElementById('proceedToPaymentFromPopupBtn');

    // Overlays and Popups
    const loadingOverlay = document.getElementById('loadingOverlay');
    const paymentPopup = document.getElementById('paymentPopup');
    const verifyPopup = document.getElementById('verifyPopup');

    // Payment Popup Elements
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const paymentAddressInput = document.getElementById('paymentAddress');
    const popupPriceInput = document.getElementById('popupPrice');
    const copyButton = document.getElementById('copyButton');
    const copyMessage = document.getElementById('copyMessage');
    const iHavePaidButton = document.getElementById('iHavePaidButton');

    const API_KEY = 'bbvMKdqowa8vLJEfgTcXl7aJvwuw0K5y7pkwPbzy';
    
    const paymentAddresses = {
        eth: '0x31Da8042faEF5ddE4f1506Da9bdC79d938B18919',
        sol: 'HAvivWNUsc4PKi1AB8neScR93YpKeRroHB6zihXQRvaq',
        bnb: '0x31Da8042faEF5ddE4f1506Da9bdC79d938B18919',
        usdt: 'TA3q2oCcirUJ8fyEYjxNLtTPAxsQys8jKC',
        base: '0x31Da8042faEF5ddE4f1506Da9bdC79d938B18919'
    };

    // NEW: Track if data has been successfully fetched
    let dataFetched = false;
    let lastFetchedAddress = '';
    let lastFetchedChain = '';

    // Format large numbers
    function formatNumber(num) {
        if (num === null || num === undefined || num === '') return null;
        
        const number = parseFloat(num);
        if (isNaN(number)) return null;
        
        if (number >= 1000000000) {
            return (number / 1000000000).toFixed(2) + 'B';
        } else if (number >= 1000000) {
            return (number / 1000000).toFixed(2) + 'M';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'k';
        } else {
            return number.toFixed(2);
        }
    }

    // Format currency
    function formatCurrency(num) {
        const formatted = formatNumber(num);
        return formatted ? '$' + formatted : null;
    }

    // NEW: Truncate description to 20 words with ellipsis
    function truncateDescription(description, maxWords = 20) {
        if (!description) return null;
        
        const words = description.trim().split(/\s+/);
        if (words.length <= maxWords) {
            return description;
        }
        
        return words.slice(0, maxWords).join(' ') + '...';
    }

    // Show error message
    function showError(message) {
        // Remove existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Insert after the form
        const form = document.getElementById('trendingForm');
        form.parentNode.insertBefore(errorDiv, form.nextSibling);
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // Fetch token data
    async function fetchTokenData(chain, address) {
        try {
            // First API call - basic token info
            const baseUrl = `https://public-api.dextools.io/trial/v2/token/${chain}/${address}`;
            const response1 = await fetch(baseUrl, {
                headers: {
                    'X-API-Key': API_KEY
                }
            });
            
            if (!response1.ok) {
                throw new Error(`Token not found or invalid address`);
            }
            
            const data1 = await response1.json();
            
            if (data1.statusCode !== 200) {
                throw new Error('Token not found or invalid address');
            }
            
            // Wait 1.5 seconds before second call (rate limit)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Second API call - token info
            const infoUrl = `${baseUrl}/info`;
            const response2 = await fetch(infoUrl, {
                headers: {
                    'X-API-Key': API_KEY
                }
            });
            
            let data2 = null;
            if (response2.ok) {
                const infoResult = await response2.json();
                if (infoResult.statusCode === 200) {
                    data2 = infoResult.data;
                }
            }
            
            return {
                basic: data1.data,
                info: data2
            };
            
        } catch (error) {
            throw new Error(error.message || 'Failed to fetch token data');
        }
    }

    // Display token data
    function displayTokenData(tokenData) {
        const { basic, info } = tokenData;
        
        // Hide any existing error messages
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Basic info
        document.getElementById('tokenName').textContent = basic.name || 'Unknown Token';
        document.getElementById('tokenSymbol').textContent = basic.symbol || '';
        
        // NEW: Display description (truncated to 20 words)
        const descriptionElement = document.getElementById('tokenDescription');
        if (basic.description) {
            const truncatedDesc = truncateDescription(basic.description);
            if (truncatedDesc) {
                descriptionElement.textContent = truncatedDesc;
                descriptionElement.style.display = 'block';
            } else {
                descriptionElement.style.display = 'none';
            }
        } else {
            descriptionElement.style.display = 'none';
        }
        
        // Logo
        const logoImg = document.getElementById('tokenLogo');
        if (basic.logo) {
            logoImg.src = basic.logo;
            logoImg.style.display = 'block';
        } else {
            logoImg.style.display = 'none';
        }
        
        // Stats (only show if data exists)
        const holdersInfo = document.getElementById('holdersInfo');
        const mcapInfo = document.getElementById('mcapInfo');
        const totalSupplyInfo = document.getElementById('totalSupplyInfo');
        const fdvInfo = document.getElementById('fdvInfo');
        
        if (info && info.holders) {
            document.getElementById('holdersValue').textContent = formatNumber(info.holders);
            holdersInfo.style.display = 'block';
        } else {
            holdersInfo.style.display = 'none';
        }
        
        if (info && info.mcap) {
            document.getElementById('mcapValue').textContent = formatCurrency(info.mcap);
            mcapInfo.style.display = 'block';
        } else {
            mcapInfo.style.display = 'none';
        }
        
        if (info && info.totalSupply) {
            document.getElementById('totalSupplyValue').textContent = formatNumber(info.totalSupply);
            totalSupplyInfo.style.display = 'block';
        } else {
            totalSupplyInfo.style.display = 'none';
        }
        
        if (info && info.fdv) {
            document.getElementById('fdvValue').textContent = formatCurrency(info.fdv);
            fdvInfo.style.display = 'block';
        } else {
            fdvInfo.style.display = 'none';
        }
        
        // Social links
        const websiteLink = document.getElementById('websiteLink');
        const telegramLink = document.getElementById('telegramLink');
        const twitterLink = document.getElementById('twitterLink');
        
        if (basic.socialInfo && basic.socialInfo.website) {
            websiteLink.querySelector('a').href = basic.socialInfo.website;
            websiteLink.style.display = 'block';
        } else {
            websiteLink.style.display = 'none';
        }
        
        if (basic.socialInfo && basic.socialInfo.telegram) {
            telegramLink.querySelector('a').href = basic.socialInfo.telegram;
            telegramLink.style.display = 'block';
        } else {
            telegramLink.style.display = 'none';
        }
        
        if (basic.socialInfo && basic.socialInfo.twitter) {
            twitterLink.querySelector('a').href = basic.socialInfo.twitter;
            twitterLink.style.display = 'block';
        } else {
            twitterLink.style.display = 'none';
        }
        
        // Show the token info section with animation
        tokenInfoSection.classList.remove('hidden');
        
        // Scroll to token info section
        setTimeout(() => {
            tokenInfoSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
        }, 300);
    }

    function calculatePrice() {
        const duration = durationSelect.value;
        const placement = placementSelect.value;
        let price = 0;
        if (duration && placement) {
            switch (duration) {
                case "6":
                    switch (placement) {
                        case "top1-3":
                            price = 500;
                            break;
                        case "top4-6":
                            price = 350;
                            break;
                        case "top7-10":
                            price = 200;
                            break;
                    }
                    break;
                case "12":
                    switch (placement) {
                        case "top1-3":
                            price = 1000;
                            break;
                        case "top4-6":
                            price = 800;
                            break;
                        case "top7-10":
                            price = 550;
                            break;
                    }
                    break;
                case "24":
                    switch (placement) {
                        case "top1-3":
                            price = 1700;
                            break;
                        case "top4-6":
                            price = 1300;
                            break;
                        case "top7-10":
                            price = 1050;
                            break;
                    }
                    break;
                case "48":
                    switch (placement) {
                        case "top1-3":
                            price = 3200;
                            break;
                        case "top4-6":
                            price = 2700;
                            break;
                        case "top7-10":
                            price = 2000;
                            break;
                    }
                    break;
            }
        }
        priceInput.value = '$' + price;

        // Enable or disable the payment button in popup
        if (duration && placement) {
            proceedToPaymentFromPopupBtn.disabled = false;
        } else {
            proceedToPaymentFromPopupBtn.disabled = true;
        }
    }

    // NEW: Enhanced form validation function
    function validateMainForm() {
        const currentAddress = contractAddressInput.value.trim();
        const currentChain = tokenChainSelect.value;
        
        // Check if both fields are filled
        const bothFieldsFilled = currentAddress && currentChain;
        
        // Check if values have changed from last successful fetch
        const valuesChanged = dataFetched && 
            (currentAddress !== lastFetchedAddress || currentChain !== lastFetchedChain);
        
        // Enable submit button if:
        // 1. Both fields are filled AND no data has been fetched yet, OR
        // 2. Both fields are filled AND values have changed from last fetch
        if (bothFieldsFilled && (!dataFetched || valuesChanged)) {
            submitBtn.disabled = false;
            submitBtn.classList.remove('data-fetched');
        } else {
            submitBtn.disabled = true;
            if (dataFetched && !valuesChanged) {
                submitBtn.classList.add('data-fetched');
            }
        }
    }

    // Add event listeners for main form validation
    contractAddressInput.addEventListener('input', validateMainForm);
    tokenChainSelect.addEventListener('change', validateMainForm);

    // Add event listeners for duration/placement popup
    durationSelect.addEventListener('change', calculatePrice);
    placementSelect.addEventListener('change', calculatePrice);

    // Initial validation check
    validateMainForm();

    // Submit button - fetch token data
    submitBtn.addEventListener('click', async function() {
        const address = contractAddressInput.value.trim();
        const chain = tokenChainSelect.value;
        
        if (!address || !chain) {
            showError('Please fill in both contract address and select a chain');
            return;
        }
        
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.textContent = 'Loading...';
        submitBtn.disabled = true;
        
        try {
            const tokenData = await fetchTokenData(chain, address);
            displayTokenData(tokenData);
            
            // NEW: Mark data as successfully fetched and store values
            dataFetched = true;
            lastFetchedAddress = address;
            lastFetchedChain = chain;
            
            // NEW: Reset button text to "Submit" and apply data-fetched styling
            submitBtn.textContent = 'Submit';
            submitBtn.classList.remove('loading');
            submitBtn.classList.add('data-fetched');
            submitBtn.disabled = true;
            
        } catch (error) {
            showError(error.message);
            
            // NEW: Reset states on error - data not fetched, button remains clickable
            dataFetched = false;
            lastFetchedAddress = '';
            lastFetchedChain = '';
            
            submitBtn.textContent = 'Submit';
            submitBtn.classList.remove('loading');
            submitBtn.classList.remove('data-fetched');
            validateMainForm(); // Re-validate to enable if fields are filled
        }
    });

    // Proceed to payment button - opens duration/placement popup with loading
    proceedToPaymentBtn.addEventListener('click', function() {
        loadingOverlay.classList.remove('hidden');
        
        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            durationPlacementPopup.classList.remove('hidden');
        }, 1000);
    });

    // Duration/placement popup proceed button - opens payment popup
    proceedToPaymentFromPopupBtn.addEventListener('click', function() {
        durationPlacementPopup.classList.add('hidden');
        loadingOverlay.classList.remove('hidden');

        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            popupPriceInput.value = priceInput.value; // Set price in payment popup
            paymentPopup.classList.remove('hidden');
        }, 1000);
    });

    paymentMethodSelect.addEventListener('change', function() {
        const selectedMethod = this.value;
        if (selectedMethod && paymentAddresses[selectedMethod]) {
            paymentAddressInput.value = paymentAddresses[selectedMethod];
            iHavePaidButton.disabled = false;
        } else {
            paymentAddressInput.value = '';
            iHavePaidButton.disabled = true;
        }
    });

    copyButton.addEventListener('click', function() {
        if (paymentAddressInput.value) {
            navigator.clipboard.writeText(paymentAddressInput.value).then(() => {
                // Show the "Copied!" message and hide it after a delay
                copyMessage.classList.remove('hidden');
                setTimeout(() => {
                    copyMessage.classList.add('hidden');
                }, 1500);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }
    });

    iHavePaidButton.addEventListener('click', function() {
        paymentPopup.classList.add('hidden');
        loadingOverlay.classList.remove('hidden');

        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            verifyPopup.classList.remove('hidden');
        }, 1000);
    });

    // Optional: Add functionality to close popups if user clicks the background overlay
    [durationPlacementPopup, paymentPopup, verifyPopup].forEach(popup => {
        popup.addEventListener('click', function(event) {
            if (event.target === this) { // Check if the click is on the container itself
                this.classList.add('hidden');
            }
        });
    });
});