document.addEventListener('DOMContentLoaded', function () {
    // Main form elements
    const durationSelect = document.getElementById('duration');
    const placementSelect = document.getElementById('placement');
    const priceInput = document.getElementById('price');
    const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');

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

    const paymentAddresses = {
        eth: '0x1234567890123456789012345678901234567890',
        sol: 'SoL1anA123456789012345678901234567890123456',
        bnb: 'bnb1abcdefghijklmnopqrstuvwxyz1234567890abc',
        usdt: 'TRC20abcdefghijklmnopqrstuvwxyz1234567890123',
        base: '0xBASE123456789012345678901234567890123456'
    };

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

        // Enable or disable the payment button
        if (duration && placement) {
            proceedToPaymentBtn.disabled = false;
        } else {
            proceedToPaymentBtn.disabled = true;
        }
    }

    durationSelect.addEventListener('change', calculatePrice);
    placementSelect.addEventListener('change', calculatePrice);

    proceedToPaymentBtn.addEventListener('click', function() {
        loadingOverlay.classList.remove('hidden');

        setTimeout(() => {
            loadingOverlay.classList.add('hidden');
            popupPriceInput.value = priceInput.value; // Set price in popup
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
    [paymentPopup, verifyPopup].forEach(popup => {
        popup.addEventListener('click', function(event) {
            if (event.target === this) { // Check if the click is on the container itself
                this.classList.add('hidden');
            }
        });
    });
});