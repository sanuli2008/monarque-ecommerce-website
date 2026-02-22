// Function to fetch and replace placeholders with data from XML
function fetchAndReplacePlaceholders() {
    // Fetch the XML file
    fetch('../XML/products.xml') // Update the path to your XML file
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");

            // Get all product nodes from the XML
            const products = xmlDoc.querySelectorAll('product');

            // Loop through each product in the XML
            products.forEach(product => {
                // Extract product details from XML
                const productId = product.getAttribute('id');
                if (productId >= 'icon1' && productId <= 'icon8') {
                    const name = product.querySelector('name').textContent;
                    const price = product.querySelector('price').textContent;
                    const discountPrice = product.querySelector('discountPrice').textContent;
                    const discount = product.querySelector('discount').textContent;
                    const sold = product.querySelector('sold').textContent;
                    const reviews = product.querySelector('reviews').textContent;
                    const rating = parseInt(product.querySelector('rating').textContent, 10);

                    // Find the corresponding product container in the HTML
                    const productContainer = document.querySelector(`.full-product[data-product-id="${productId}"]`);
                    if (!productContainer) return;

                    // Replace placeholders with fetched data
                    const htmlContent = productContainer.innerHTML;

                    const updatedContent = htmlContent
                        .replace(/{name}/g, name)
                        .replace(/{price}/g, price)
                        .replace(/{discountPrice}/g, discountPrice)
                        .replace(/{discount}/g, discount)
                        .replace(/{sold}/g, sold)
                        .replace(/{rating}/g, generateRatingStars(rating))
                        .replace(/{reviews}/g, reviews);

                    // Update the product container with the new content
                    productContainer.innerHTML = updatedContent;
                }    
            });
        })
        .catch(error => console.error('Error fetching or parsing XML:', error));
}

// Function to generate rating stars based on the rating value
function generateRatingStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += '<i class="fa-solid fa-star" style="color: black;"></i>'; // Filled star
        } else {
            stars += '<i class="fa-regular fa-star" style="color: grey;"></i>'; // Empty star
        }
    }
    return stars;
}

// Call the function to fetch and replace placeholders
fetchAndReplacePlaceholders();

document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("myModal");
    var modalContent = document.getElementById("modal-content");

    function openModal(productElement) {
        const productId = productElement.getAttribute("data-product-id");

        fetch("../XML/products.xml")
            .then(response => response.text())
            .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
            .then(data => {
                let product = data.querySelector(`product[id="${productId}"]`);
                if (!product) return;

                let name = product.querySelector("name").textContent;
                let price = product.querySelector("price").textContent;
                let rating = parseInt(product.querySelector("rating").textContent, 10);
                let reviews = product.querySelector("reviews").textContent;
                let defaultImage = product.querySelector("defaultImages image").textContent;

                let variants = product.querySelectorAll("variant");
                let colorOptions = "";
                let variantImages = {};

                variants.forEach(variant => {
                    let colorName = variant.getAttribute("color");
                    let colorCode = variant.getAttribute("colorCode");
                    let variantImage = variant.querySelector("image[type='default']").textContent;
                    variantImages[colorName] = variantImage;
                    colorOptions += `<span class="color-circle" style="background: ${colorCode};" data-color="${colorName}"></span>`;
                });

                modalContent.innerHTML = `
                    <span class="close">×</span>
                    <div class="modal-product">
                        <img src="${defaultImage}" alt="${name}" class="modal-product-img" id="modalProductImage">
                        <div class="modal-details">
                            <h2 class="product-name">${name}</h2>
                            <p class="pro-price">LKR <b>${price}</b></p>
    
                            <div class="color-section">
                                <p>Selected Color: <span class="selected-color">None</span></p>
                                <div class="color-options">${colorOptions}</div>
                            </div>
                            <div class="size-section">
                                <button data-size="S">S</button>
                                <button data-size="M">M</button>
                                <button data-size="L">L</button>
                                <button data-size="XL">XL</button>
                            </div>
                            <div class="quantity-section">
                                <span class="qty-label">QTY</span>
                                <select class="qty-dropdown">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>
                            <div class="add-cart">
                                <button id="add-to-cart">Add to cart</button>
                            </div>
                        </div>
                    </div>
                `;

                modal.style.display = "block";

                // Color selection
                document.querySelectorAll(".color-circle").forEach(circle => {
                    circle.addEventListener("click", function () {
                        document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('active'));
                        this.classList.add('active');
                        let selectedColor = this.getAttribute("data-color");
                        document.getElementById("modalProductImage").src = variantImages[selectedColor];
                        document.querySelector('.selected-color').textContent = selectedColor;
                    });
                });

                // Size selection
                document.querySelectorAll('.size-section button').forEach(button => {
                    button.addEventListener('click', function () {
                        document.querySelectorAll('.size-section button').forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                    });
                });

                // Add to Cart
                document.getElementById('add-to-cart').addEventListener('click', function () {
                    const selectedColor = document.querySelector('.color-circle.active')?.getAttribute('data-color');
                    const selectedSize = document.querySelector('.size-section button.active')?.getAttribute('data-size');
                    const quantity = document.querySelector('.qty-dropdown').value;

                    if (!selectedColor) {
                        alert("Please select a color before adding to cart.");
                        return;
                    }
                    if (!selectedSize) {
                        alert("Please select a size before adding to cart.");
                        return;
                    }
                    if (!quantity || parseInt(quantity, 10) <= 0) {
                        alert("Please select a valid quantity before adding to cart.");
                        return;
                    }

                    const cartItem = {
                        id: productId,
                        name: name,
                        price: `LKR ${price}`,
                        color: selectedColor,
                        size: selectedSize,
                        quantity: parseInt(quantity, 10),
                        image: document.getElementById('modalProductImage').src
                    };

                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    cart.push(cartItem);
                    localStorage.setItem('cart', JSON.stringify(cart));

                    alert("Item added to cart!");
                    modal.style.display = 'none';
                });

                // Close modal
                document.querySelector(".close").onclick = function () {
                    modal.style.display = "none";
                };
            })
            .catch(error => console.error("Error fetching product data:", error));
    }

    document.addEventListener("click", function (event) {
        if (event.target.closest(".product-add-cart")) {
            let productElement = event.target.closest(".full-product");
            if (productElement) {
                openModal(productElement);
            }
        }
    });

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Assuming generateRatingStars is defined
    function generateRatingStars(rating) {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += i < rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        }
        return stars;
    }
});

//wishlist functions
// Function to check if a product is in the wishlist
function isInWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some(item => item.productId === productId);
}

// Function to update all wishlist buttons on the page
function updateAllWishlistButtons() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        const productId = button.getAttribute('data-product-id') || button.closest('.full-product')?.getAttribute('data-product-id');
        if (productId) {
            const isWishlisted = wishlist.some(item => item.productId === productId);
            if (isWishlisted) {
                button.classList.add('wishlisted');
            } else {
                button.classList.remove('wishlisted');
            }
        }
    });
}

// Function to add/remove item to/from wishlist with toggle
function addToWishlistMain(event) {
    const button = event.currentTarget;
    const productId = button.getAttribute("data-product-id") || button.closest('.full-product').getAttribute('data-product-id');

    if (!productId) {
        console.error("Product ID not found.");
        alert("Error: Product ID not found!");
        return;
    }

    const productElement = document.querySelector(`.full-product[data-product-id="${productId}"]`);
    if (!productElement) {
        console.error(`Product with ID ${productId} not found in DOM.`);
        alert("Error: Product not found!");
        return;
    }

    const captionElement = productElement.querySelector(".caption");
    const priceElement = productElement.querySelector(".price b");
    const imageElement = productElement.querySelector(".product-img img");

    if (!captionElement || !priceElement || !imageElement) {
        console.error("Product details incomplete in the DOM!");
        alert("Error: Product details incomplete!");
        return;
    }

    const wishlistItem = {
        productId: productId,
        name: captionElement.textContent,
        price: priceElement.textContent, // Already includes "LKR" from HTML
        color: "N/A", // No color selection in main page
        size: "N/A",  // No size selection in main page
        quantity: "1", // Default quantity
        image: imageElement.src
    };

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (isInWishlist(productId)) {
        // Remove from wishlist
        wishlist = wishlist.filter(item => item.productId !== productId);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Item removed from wishlist!");
    } else {
        // Add to wishlist
        wishlist.push(wishlistItem);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Item added to wishlist!");
    }

    updateAllWishlistButtons(); // Update all buttons after change

}


// Attach event listeners and initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Attach listeners to existing buttons
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        button.removeEventListener('click', addToWishlistMain); // Prevent duplicates
        button.addEventListener('click', addToWishlistMain);
    });

    // Handle dynamic carousel content (if applicable)
    const observer = new MutationObserver(() => {
        document.querySelectorAll('.add-to-wishlist').forEach(button => {
            if (!button.dataset.listenerAdded) { // Prevent duplicate listeners
                button.removeEventListener('click', addToWishlistMain);
                button.addEventListener('click', addToWishlistMain);
                button.dataset.listenerAdded = 'true';
            }
        });
        updateAllWishlistButtons(); // Update styles after carousel changes
    });

    // Observe changes in the carousel container (adjust selector as needed)
    const carouselContainer = document.querySelector('.carousel') || document.body;
    observer.observe(carouselContainer, { childList: true, subtree: true });

    // Initial setup
    updateAllWishlistButtons(); // Set initial states

});

// No need for DOMContentLoaded or loadWishlist here unless adding preview functionality





//breadcrumbs
// Function to get query parameter
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Get the current category from the page filename
function getCategoryFromPage() {
    const page = window.location.pathname.split('/').pop(); // e.g., "clothing.html"
    return page.replace('.html', '').charAt(0).toUpperCase() + page.replace('.html', '').slice(1); // e.g., "Clothing"
}


//cart count
// Retrieve cart data from localStorage
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalQuantity = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);

    // Update the cart count in the DOM
    document.getElementById("cart-count").textContent = totalQuantity;
}

// Run the function when the page loads
updateCartCount();