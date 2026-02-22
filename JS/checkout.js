document.addEventListener('DOMContentLoaded', function() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartDetailsContainer = document.getElementById('cart-details');
    const orderSummaryContainer = document.getElementById('right-content');
    const DISCOUNT_AMOUNT = 5000;
    
    function getPriceValue(priceString) {
        if (typeof priceString === 'number') return priceString;
        return parseFloat(priceString.replace('LKR', '').replace(/,/g, '').trim());
    }
    
    function formatPrice(amount) {
        return 'LKR ' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    
    function displayCartItems() {
        cartDetailsContainer.innerHTML = '';
        if (cartItems.length === 0) {
            cartDetailsContainer.innerHTML = '<p>Your cart is empty</p>';
            return;
        }
        
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'side-img';
            const priceDisplay = typeof item.price === 'number' ? formatPrice(item.price) : item.price;
            
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="side-info">
                    <p>${item.name}</p>
                    <p>${priceDisplay}</p>
                    <p>Color: ${item.color || 'Not specified'}</p>
                    <p>Size: ${item.size || 'Not specified'}</p>
                    <p>Quantity: ${item.quantity || 1}</p>
                </div>
            `;
            cartDetailsContainer.appendChild(itemElement);
        });
    }
    
    function updateOrderSummary() {
        if (cartItems.length === 0) {
            orderSummaryContainer.innerHTML = '<p>Your cart is empty</p>';
            return;
        }
        
        const subtotal = cartItems.reduce((sum, item) => {
            const price = getPriceValue(item.price);
            const quantity = item.quantity || 1;
            return sum + (price * quantity);
        }, 0);
        
        const shipping = 0;
        const taxes = subtotal * 0.08;
        const total = subtotal + shipping + taxes;
        
        orderSummaryContainer.innerHTML = `
            <div id="total">
                <div class="row">
                    <span class="topic">Apply for promo code</span>
                    <input type="text" id="promo-code" placeholder="Enter promo code">
                    <button class="val-button" id="apply-promo">APPLY</button>
                </div>
                <div class="row">
                    <span class="topic">Items total</span>
                    <span class="value" id="subtotal">${formatPrice(subtotal)}</span>
                </div>
                <div class="row">
                    <span class="topic">Shipping</span>
                    <span class="value" id="shipping">${formatPrice(shipping)}</span>
                </div>
                <div class="row">
                    <span class="topic">Taxes & Duties</span>
                    <span class="value" id="taxes">${formatPrice(taxes)}</span>
                </div>
                <hr>
                <div class="row" style="margin-top: 20px;">
                    <span class="topic">Total for your order</span>
                    <span class="value" id="total-amount">${formatPrice(total)}</span>
                </div>
            </div>
        `;
        
        document.getElementById('apply-promo')?.addEventListener('click', applyPromoCode);
    }
    
    function applyPromoCode() {
        const promoCode = document.getElementById('promo-code')?.value.trim();
        const totalElement = document.getElementById('total-amount');
        
        if (!totalElement) return;
        
        const currentTotal = getPriceValue(totalElement.textContent);
        
        if (promoCode === 'DISCOUNT10') {
            alert(`Congratulations! You've received a discount of LKR ${DISCOUNT_AMOUNT.toLocaleString()}`);
            const discountedTotal = currentTotal - DISCOUNT_AMOUNT;
            
            if (!document.getElementById('discount-row')) {
                const subtotalRow = document.querySelector('.row:nth-child(2)');
                const discountRow = document.createElement('div');
                discountRow.className = 'row';
                discountRow.id = 'discount-row';
                discountRow.innerHTML = `
                    <span class="topic">Discount</span>
                    <span class="value" id="discount-value">${formatPrice(DISCOUNT_AMOUNT)}</span>
                `;
                subtotalRow.after(discountRow);
            }
            
            totalElement.textContent = formatPrice(discountedTotal);
        } else if (promoCode) {
            alert('Invalid promo code');
        } else {
            alert('Please enter a promo code');
        }
    }

    // Validation functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^\d{9,11}$/;
        return phoneRegex.test(phone);
    }

    function validateCardNumber(cardNumber) {
        const cardRegex = /^\d{16}$/;
        return cardRegex.test(cardNumber.replace(/\s/g, ''));
    }

    function validateCVV(cvv) {
        const cvvRegex = /^\d{3,4}$/;
        return cvvRegex.test(cvv);
    }

    // Form validation and payment handling
    const paymentForm = document.querySelector('.payment-container form');
    const payButton = paymentForm?.querySelector('button[type="submit"]');
    
    payButton?.addEventListener('click', function(event) {
        event.preventDefault();

        // Get all field values
        const firstName = document.getElementById('first-name')?.value.trim();
        const lastName = document.getElementById('last-name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const line1 = document.getElementById('line1')?.value.trim();
        const city = document.getElementById('city')?.value.trim();
        const country = document.getElementById('country')?.value;
        const postCode = document.getElementById('post')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const cardNumber = document.getElementById('card-number')?.value.trim();
        const expiryMonth = document.getElementById('expiry-month')?.value;
        const expiryYear = document.getElementById('expiry-year')?.value;
        const cvv = document.getElementById('cvv')?.value.trim();

        // Validation checks with alerts
        if (!firstName) {
            alert("Please enter your first name");
            return;
        }
        if (!lastName) {
            alert("Please enter your last name");
            return;
        }
        if (!email) {
            alert("Please enter your email");
            return;
        }
        if (!validateEmail(email)) {
            alert("Please enter a valid email address");
            return;
        }
        if (!line1) {
            alert("Please enter Address Line 1");
            return;
        }
        if (!city) {
            alert("Please enter your city");
            return;
        }
        if (!country) {
            alert("Please select your country");
            return;
        }
        if (!postCode) {
            alert("Please enter your post code");
            return;
        }
        if (!phone) {
            alert("Please enter your phone number");
            return;
        }
        if (!validatePhone(phone)) {
            alert("Please enter a valid phone number (9-11 digits)");
            return;
        }
        if (!cardNumber) {
            alert("Please enter your card number");
            return;
        }
        if (!validateCardNumber(cardNumber)) {
            alert("Please enter a valid 16-digit card number");
            return;
        }
        if (!expiryMonth) {
            alert("Please select expiry month");
            return;
        }
        if (!expiryYear) {
            alert("Please select expiry year");
            return;
        }
        if (!cvv) {
            alert("Please enter CVV");
            return;
        }
        if (!validateCVV(cvv)) {
            alert("Please enter a valid CVV (3-4 digits)");
            return;
        }
        if (cartItems.length === 0) {
            alert("Your cart is empty");
            return;
        }

        // Check expiry date
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        if (parseInt(expiryYear) < currentYear || 
            (parseInt(expiryYear) === currentYear && parseInt(expiryMonth) < currentMonth)) {
            alert("Your card has expired");
            return;
        }

        // If all validations pass
        alert("Payment completed successfully!");
        localStorage.removeItem('cart');
        paymentForm.reset();
        window.location.reload();
    });

    // Initialize the page
    displayCartItems();
    updateOrderSummary();
});