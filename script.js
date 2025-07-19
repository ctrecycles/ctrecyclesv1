/**
 * Main JavaScript file for CT Plastic Recycling Industry Pvt. Ltd. website
 * Contains all interactive functionality including:
 * - Mobile menu toggle
 * - Smooth scrolling
 * - Form validation and submission
 * - Dynamic product form functionality
 * - Scroll animations
 */

// ==============================================
// MOBILE MENU TOGGLE FUNCTIONALITY
// ==============================================

// Get references to mobile menu button and navigation links
const mobileMenu = document.getElementById('mobileMenu');
const navLinks = document.getElementById('navLinks');

// Add click event listener to mobile menu button
mobileMenu.addEventListener('click', () => {
    // Toggle 'active' class on navLinks to show/hide mobile menu
    navLinks.classList.toggle('active');
    
    // Change icon based on menu state (hamburger ↔ times)
    mobileMenu.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Close mobile menu when a navigation link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenu.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// ==============================================
// HEADER SCROLL EFFECT
// ==============================================

window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');
    
    // Add 'scrolled' class when page is scrolled down more than 50px
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        backToTop.style.display = 'flex';
    } else {
        header.classList.remove('scrolled');
        backToTop.style.display = 'none';
    }
});

// ==============================================
// SMOOTH SCROLLING FOR NAVIGATION LINKS
// ==============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default anchor behavior
        
        // Smoothly scroll to the target section
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// ==============================================
// PRODUCT FORM FUNCTIONALITY
// ==============================================

let productCount = 1; // Track number of product forms
const addProductBtn = document.getElementById('addProductBtn');
const productSelection = document.getElementById('productSelection');

/**
 * Adds a new product form section when "Add Another Product" is clicked
 */
addProductBtn.addEventListener('click', () => {
    productCount++; // Increment product counter
    
    // Create new product form section
    const newProductItem = document.createElement('div');
    newProductItem.className = 'product-item';
    newProductItem.id = `productItem${productCount}`;
    
    // HTML template for new product form
    newProductItem.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label for="product${productCount}">Product Type *</label>
                <select id="product${productCount}" name="products[${productCount-1}][type]" required>
                    <option value="">Select a product</option>
                    <option value="PET Flakes">Recycled PET Plastic Flakes</option>
                    <option value="PET Pellets">Recycled PET Plastic Pellets</option>
                    <option value="Bottle Preforms">PET Bottle Preforms</option>
                    <option value="Custom Product">Custom Product (Specify in notes)</option>
                </select>
                <div class="error-message" id="product${productCount}Error">Please select a product</div>
            </div>

            <div class="form-group">
                <label for="unitType${productCount}">Unit Type *</label>
                <select id="unitType${productCount}" name="products[${productCount-1}][unitType]" required>
                    <option value="">Select unit type</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="pieces">Pieces</option>
                    <option value="tons">Metric Tons</option>
                </select>
                <div class="error-message" id="unitType${productCount}Error">Please select a unit type</div>
            </div>
        </div>

        <!-- Additional form fields for the product -->
        <!-- ... (similar structure for other fields) ... -->
        
        <button type="button" class="remove-product" onclick="removeProduct(${productCount})" aria-label="Remove Product">
            <i class="fas fa-trash"></i> Remove Product
        </button>
    `;
    
    // Add the new product form to the DOM
    productSelection.appendChild(newProductItem);
    
    // Set minimum date for delivery date field (today's date)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById(`deliveryDate${productCount}`).min = today;
    
    // Update quantity label based on selected unit type
    document.getElementById(`unitType${productCount}`).addEventListener('change', function() {
        const label = document.getElementById(`quantityLabel${productCount}`);
        label.textContent = this.value === 'kg' ? 'Quantity (kg) *' : 
                          this.value === 'pieces' ? 'Quantity (pieces) *' : 
                          'Quantity (tons) *';
    });
    
    // Show remove button on first product when adding second product
    if (productCount === 2) {
        document.querySelector('#productItem1 .remove-product').style.display = 'block';
    }
});

/**
 * Removes a product form section
 * @param {number} id - The ID of the product section to remove
 */
window.removeProduct = (id) => {
    const productItem = document.getElementById(`productItem${id}`);
    if (productItem) {
        productItem.remove(); // Remove the product form from DOM
        
        // Hide remove button on first product if only one remains
        if (productCount === 2) {
            document.querySelector('#productItem1 .remove-product').style.display = 'none';
        }
        productCount--; // Decrement product counter
    }
};

// Initialize form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum delivery date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('deliveryDate1').min = today;
    
    // Add unit type change listener to first product
    document.getElementById('unitType1').addEventListener('change', function() {
        const label = document.getElementById('quantityLabel1');
        label.textContent = this.value === 'kg' ? 'Quantity (kg) *' : 
                          this.value === 'pieces' ? 'Quantity (pieces) *' : 
                          'Quantity (tons) *';
    });
});

// ==============================================
// FORM VALIDATION AND SUBMISSION
// ==============================================

/**
 * Validates the order form before submission
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateOrderForm() {
    let isValid = true; // Track overall form validity
    
    // Validate customer info fields
    const fields = [
        { element: document.getElementById('customerName'), errorId: 'nameError', message: 'Please enter your name' },
        { element: document.getElementById('customerEmail'), errorId: 'emailError', message: 'Please enter a valid email', validator: isValidEmail },
        { element: document.getElementById('customerPhone'), errorId: 'phoneError', message: 'Please enter your phone number' },
        { element: document.getElementById('customerAddress'), errorId: 'addressError', message: 'Please enter your address' },
        { element: document.getElementById('paymentTerms'), errorId: 'paymentError', message: 'Please select payment terms' }
    ];
    
    // Validate each field
    fields.forEach(field => {
        if (!field.element.value.trim() || (field.validator && !field.validator(field.element.value))) {
            showError(field.element, field.errorId, field.message);
            isValid = false;
        } else {
            clearError(field.element, field.errorId);
        }
    });
    
    // Validate each product form
    for (let i = 1; i <= productCount; i++) {
        const productItem = document.getElementById(`productItem${i}`);
        if (productItem) {
            const productFields = [
                { element: document.getElementById(`product${i}`), errorId: `product${i}Error`, message: 'Please select a product' },
                { element: document.getElementById(`unitType${i}`), errorId: `unitType${i}Error`, message: 'Please select a unit type' },
                { element: document.getElementById(`quantity${i}`), errorId: `quantity${i}Error`, message: 'Please enter a valid quantity', validator: val => val > 0 },
                { element: document.getElementById(`budget${i}`), errorId: `budget${i}Error`, message: 'Please select a budget range' },
                { element: document.getElementById(`deliveryDate${i}`), errorId: `delivery${i}Error`, message: 'Please select a delivery date' },
                { element: document.getElementById(`urgency${i}`), errorId: `urgency${i}Error`, message: 'Please select an urgency level' }
            ];
            
            productFields.forEach(field => {
                if (!field.element.value || (field.validator && !field.validator(field.element.value))) {
                    showError(field.element, field.errorId, field.message);
                    isValid = false;
                } else {
                    clearError(field.element, field.errorId);
                }
            });
        }
    }
    
    if (!isValid) {
        alert('You have not filled all required fields.');
    }
    
    return isValid;
}

// Quick contact form submission
const quickContactForm = document.getElementById('quickContactForm');
quickContactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate form fields
    const fields = [
        { element: document.getElementById('quickName'), errorId: 'quickNameError', message: 'Please enter your name' },
        { element: document.getElementById('quickEmail'), errorId: 'quickEmailError', message: 'Please enter a valid email', validator: isValidEmail },
        { element: document.getElementById('quickMessage'), errorId: 'quickMessageError', message: 'Please enter your message' }
    ];
    
    let isValid = true;
    fields.forEach(field => {
        if (!field.element.value.trim() || (field.validator && !field.validator(field.element.value))) {
            showError(field.element, field.errorId, field.message);
            isValid = false;
        } else {
            clearError(field.element, field.errorId);
        }
    });
    
    if (!isValid) return;
    
    // Submit form data
    try {
        const response = await fetch(this.action, {
            method: 'POST',
            body: new FormData(this),
            headers: { 'Accept': 'application/json' }
        });
        
        if (response.ok) {
            showSuccessMessage('Message sent successfully! We will get back to you within 24 hours.');
            this.reset();
            fields.forEach(field => clearError(field.element, field.errorId));
        } else {
            alert('Error sending message. Please try again later.');
        }
    } catch (error) {
        alert('Error sending message. Please try again later.');
    }
});

// Order form submission
const orderForm = document.getElementById('orderForm');
orderForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (validateOrderForm()) {
        const formData = new FormData(this);
        const orderData = {};
        
        // Process form data into structured object
        for (let [key, value] of formData.entries()) {
            if (key.includes('products')) {
                const matches = key.match(/products\[(\d+)\]\[(\w+)\]/);
                if (matches) {
                    const index = matches[1];
                    const field = matches[2];
                    if (!orderData.products) orderData.products = [];
                    if (!orderData.products[index]) orderData.products[index] = {};
                    orderData.products[index][field] = value;
                }
            } else {
                orderData[key] = value;
            }
        }
        
        // Generate order summary text
        let orderSummary = `New Order Request from ${orderData.customerName}\n\n`;
        orderSummary += `Contact Details:\n`;
        orderSummary += `Email: ${orderData.customerEmail}\n`;
        orderSummary += `Phone: ${orderData.customerPhone}\n`;
        orderSummary += `Address: ${orderData.customerAddress}\n\n`;
        orderSummary += `Products Ordered:\n`;
        
        orderData.products.forEach((product, index) => {
            if (product.type) {
                orderSummary += `${index + 1}. ${product.type}\n`;
                orderSummary += `   Quantity: ${product.quantity} ${product.unitType}\n`;
                orderSummary += `   Budget: ${product.budget}\n`;
                orderSummary += `   Delivery Date: ${product.deliveryDate}\n`;
                orderSummary += `   Urgency: ${product.urgency}\n`;
                if (product.specs) orderSummary += `   Specifications: ${product.specs}\n`;
                orderSummary += `\n`;
            }
        });
        
        orderSummary += `Payment Terms: ${orderData.paymentTerms}\n`;
        if (orderData.orderNotes) orderSummary += `Additional Notes: ${orderData.orderNotes}\n`;
        
        formData.append('orderSummary', orderSummary);
        
        // Submit form data
        try {
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                showSuccessMessage(`Order submitted successfully!\n\nOrder Summary:\n${orderSummary}`);
                this.reset();
                while (productCount > 1) {
                    removeProduct(productCount);
                }
                document.getElementById('quantityLabel1').textContent = 'Quantity *';
                clearFormErrors();
            } else {
                alert('Error submitting order. Please try again later.');
            }
        } catch (error) {
            alert('Error submitting order. Please try again later.');
        }
    }
});

// Request Quote button functionality
const requestQuoteBtn = document.getElementById('requestQuoteBtn');
requestQuoteBtn.addEventListener('click', async () => {
    if (validateOrderForm()) {
        const formData = new FormData(orderForm);
        formData.set('_subject', 'Quote Request from CT Plastic Recycling Industry Pvt. Ltd.');
        
        // Process form data (similar to order submission)
        // ...
        
        // Submit form data
        try {
            const response = await fetch(orderForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            if (response.ok) {
                showSuccessMessage(`Quote request submitted successfully!`);
                orderForm.reset();
                while (productCount > 1) {
                    removeProduct(productCount);
                }
                document.getElementById('quantityLabel1').textContent = 'Quantity *';
                clearFormErrors();
            } else {
                alert('Error submitting quote request. Please try again later.');
            }
        } catch (error) {
            alert('Error submitting quote request. Please try again later.');
        }
    }
});

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Shows an error message for a form field
 * @param {HTMLElement} input - The input element
 * @param {string} errorId - The ID of the error message element
 * @param {string} message - The error message to display
 */
function showError(input, errorId, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    const errorElement = document.getElementById(errorId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

/**
 * Clears an error message for a form field
 * @param {HTMLElement} input - The input element
 * @param {string} errorId - The ID of the error message element
 */
function clearError(input, errorId) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
    const errorElement = document.getElementById(errorId);
    errorElement.style.display = 'none';
}

/**
 * Clears all error messages in the form
 */
function clearFormErrors() {
    document.querySelectorAll('.form-group.error').forEach(group => {
        group.classList.remove('error');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) errorElement.style.display = 'none';
    });
}

/**
 * Displays a success message
 * @param {string} message - The success message to display
 */
function showSuccessMessage(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    successMessage.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 8000);
}

// ==============================================
// SCROLL ANIMATIONS
// ==============================================

document.addEventListener('DOMContentLoaded', () => {
    // Get all elements with animation classes
    const animateElements = document.querySelectorAll('.animate, .animate-up, .animate-left');
    
    // Create Intersection Observer to trigger animations when elements come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start animation when element is in viewport
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target); // Stop observing after animation starts
            }
        });
    }, { threshold: 0.1 }); // Trigger when 10% of element is visible
    
    // Observe all animated elements
    animateElements.forEach(element => {
        observer.observe(element);
    });
});