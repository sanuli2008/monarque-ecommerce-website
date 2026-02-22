document.addEventListener("DOMContentLoaded", function() {
					
	// Modal Functionality
	var modal = document.getElementById("sizeModal");
	var btn = document.getElementById("myBtn");
	var span = document.querySelector(".modal .close"); // Use querySelector for better targeting

	if (btn && modal && span) {
		btn.onclick = function() {
			modal.style.display = "block";
		};

		span.onclick = function() {
			modal.style.display = "none";
		};

		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		};
	}

	// Collapsible Functionality
	document.querySelectorAll('.collapsible').forEach(button => {
		button.addEventListener('click', function() {
			this.classList.toggle('active');
			const content = this.nextElementSibling;

			if (content.style.display === "block") {
				content.style.display = "none";
			} else {
				content.style.display = "block";
			}
		});
	});

});



    // Star Rating System
    const stars = document.querySelectorAll(".star-rating span");
    stars.forEach(star => {
        star.addEventListener("click", function () {
            const rating = this.getAttribute("data-rating");
            stars.forEach(s => s.classList.remove("active"));
            for (let i = 0; i < rating; i++) {
                stars[i].classList.add("active");
            }
        });
    });

    // Expand Review
    document.querySelectorAll(".see-more").forEach((button, index) => {
        button.addEventListener("click", function () {
            const fullReview = reviewBoxes[index].querySelector(".full-review");
            fullReview.style.display = fullReview.style.display === "block" ? "none" : "block";
        });
    });


// Function to get query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Global variables for Add to Cart/Wishlist
let currentProductId = "";
let currentProductName = "";
let currentProductPrice = "";

// Function to open modal for similar products
function openModal(productId) {
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modal-content');

    fetch('../XML/products.xml')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
        .then(data => {
            const xmlProduct = data.querySelector(`product[id="${productId}"]`);
            if (!xmlProduct) return;

            const name = xmlProduct.querySelector('name').textContent;
            const price = xmlProduct.querySelector('price').textContent;
            const defaultImage = xmlProduct.querySelector('defaultImages image').textContent;
            const variants = xmlProduct.querySelectorAll('variant');
            let colorOptions = '';
            const variantImages = {};

            variants.forEach(variant => {
                const colorName = variant.getAttribute('color');
                const colorCode = variant.getAttribute('colorCode');
                const variantImage = variant.querySelector('image[type="default"]').textContent;
                variantImages[colorName] = variantImage;
                colorOptions += `<span class="color-circle" style="background: ${colorCode};" data-color="${colorName}"></span>`;
            });

            modalContent.innerHTML = `
                <span class="close">×</span>
                <div class="modal-product">
                    <img src="${defaultImage}" alt="${name}" class="modal-product-img" id="modalProductImage">
                    <div class="modal-details">
                        <h2 class="product-name">${name}</h2>
                        <p class="pro-price"><b>LKR ${price}</b></p>
                        <div class="color-options">${colorOptions}</div>
                        <div class="size-section">
                            <button data-size="S">S</button>
                            <button data-size="M">M</button>
                            <button data-size="L">L</button>
                            <button data-size="XL">XL</button>
                        </div>
                        <div class="color-section">
                            <span class="qty-label">QTY</span>
                            <select class="qty-dropdown">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                            </select>
                        </div>
                        <div class="add-cart">
                            <button id="similar-add-cart">Add to cart</button>
                        </div>
                    </div>
                </div>
            `;

            modal.style.display = 'block';

            document.querySelectorAll('.color-circle').forEach(circle => {
                circle.addEventListener('click', function () {
                    document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    document.getElementById('modalProductImage').src = variantImages[this.getAttribute('data-color')];
                });
            });

            document.querySelectorAll('.size-section button').forEach(button => {
                button.addEventListener('click', function () {
                    document.querySelectorAll('.size-section button').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            document.getElementById('similar-add-cart').addEventListener('click', function () {
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

            document.querySelector('.close').onclick = () => modal.style.display = 'none';
        })
        .catch(error => console.error('Error fetching product data:', error));
}

// Handle Add to Cart
function handleAddToCart() {
    const selectedColor = document.querySelector('.selected-color')?.textContent.trim();
    const selectedSize = document.querySelector('.size-section button.active')?.textContent?.trim();

    if (!selectedColor) {
        alert("Please select a color before adding to cart.");
        return;
    }

    if (!selectedSize) {
        alert("Please select a size before adding to cart.");
        return;
    }

    const cartItem = {
        id: currentProductId,
        name: currentProductName,
        price: `LKR ${currentProductPrice}`,
        color: selectedColor,
        size: selectedSize,
        quantity: document.querySelector('.qty-dropdown')?.value || "1",
        image: document.querySelector('.main-image img:not([style*="display: none"])')?.src
    };

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Item added to cart!");
}

// Check if item is in wishlist
function isInWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.some(item => item.productId === productId);
}

// Handle Add/Remove from Wishlist with toggle
function handleAddToWishlist(event) {
    const button = event.target.closest('#add-to-wishlist');
    const icon = button.querySelector('i');
    const productId = currentProductId;

    const selectedColor = document.querySelector('.selected-color')?.textContent.trim();
    const selectedSize = document.querySelector('.size-section button.active')?.textContent?.trim();

    const wishlistItem = {
        productId: productId,
        name: currentProductName,
        price: `LKR ${currentProductPrice}`,
        color: selectedColor || "N/A",
        size: selectedSize || "N/A",
        quantity: document.querySelector('.qty-dropdown')?.value || "1",
        image: document.querySelector('.main-image img:not([style*="display: none"])')?.src
    };

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (isInWishlist(productId)) {
        wishlist = wishlist.filter(item => item.productId !== productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        button.style.backgroundColor = '';
        icon.style.color = '';
        alert("Item removed from Wishlist!");
    } else {
        wishlist.push(wishlistItem);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        button.style.backgroundColor = 'black';
        icon.style.color = 'white';
        alert("Item added to Wishlist!");
    }
}

// Function to fetch and display similar products by category as a carousel
function fetchSimilarProducts(category, xmlDoc, currentProductId) {
    const carouselContainer = document.querySelector('.carousel');
    if (!carouselContainer) {
        console.error('Carousel container not found in HTML.');
        return;
    }
    carouselContainer.innerHTML = '';

    const allProducts = Array.from(xmlDoc.querySelectorAll('product'));
    const similarProducts = allProducts.filter(p => 
        p.querySelector('category')?.textContent === category && p.getAttribute('id') !== currentProductId
    );

    if (similarProducts.length === 0) {
        carouselContainer.innerHTML = '<p>No similar products found.</p>';
        return;
    }

    similarProducts.forEach((product) => {
        const productId = product.getAttribute('id');
        const productName = product.querySelector('name').textContent;
        const productPrice = product.querySelector('price').textContent;
        const productRating = product.querySelector('rating')?.textContent || '0';
        const productReview = product.querySelector('reviews')?.textContent || '0';
        const productSold = product.querySelector('sold')?.textContent || '';
        
        const productImage = product.querySelector('defaultImages image')?.textContent || 'default-product.jpg';

        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');

        carouselItem.innerHTML = `
            <div class="full-product">
                <div class="product-img">
                <a href="productdemo.html?productId=${productId}" target="_blank">
                    <img src="${productImage}" alt="${productName}" class="image">
                </a>
                <div class="add_btns">
                    <button class="icon-link add-to-wishlist" data-product-id="${productId}">
                    <i class="fa-regular fa-heart"></i>
                    </button>
                    <button class="product-add-cart" data-product-id="${productId}">
                    <i class="fa-solid fa-cart-plus" title="Add to Cart"></i>
                    </button>
                </div>
                </div>
                <p class="caption">${productName}</p>
                <p class="price"><b>LKR ${productPrice}</b> <span class="sold-amount">${productSold}</span></p>
                <div class="rating">
                ${generateRatingStars(productRating)}
                <span class="review-count">(${productReview} reviews)</span>
                </div>
            </div>
        `;

        carouselContainer.appendChild(carouselItem);
    });

    initializeCarousel();

    document.querySelectorAll('.carousel .add-to-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            handleCarouselWishlistToggle(productId, this);
        });
    });

    document.querySelectorAll('.carousel .product-add-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product-id');
            openModal(productId);
        });
    });
}

// Handle wishlist toggle for carousel items
function handleCarouselWishlistToggle(productId, button) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const product = Array.from(document.querySelectorAll('.carousel .carousel-item'))
        .find(item => item.querySelector(`[data-product-id="${productId}"]`));
    
    const wishlistItem = {
        productId: productId,
        name: product.querySelector('.caption')?.textContent,
        price: `LKR ${product.querySelector('.price b')?.textContent.replace('LKR ', '')}`,
        image: product.querySelector('.image')?.src,
        color: "N/A",
        size: "N/A",
        quantity: "1"
    };

    if (isInWishlist(productId)) {
        const updatedWishlist = wishlist.filter(item => item.productId !== productId);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        button.style.backgroundColor = '';
        alert("Item removed from Wishlist!");
    } else {
        wishlist.push(wishlistItem);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        button.style.backgroundColor = 'black';
        alert("Item added to Wishlist!");
    }
}

// Initialize carousel navigation
function initializeCarousel() {
    const carousel = document.querySelector(".carousel");
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");

    if (!carousel || !prevBtn || !nextBtn) {
        console.error('Carousel elements missing (carousel, prev-btn, or next-btn).');
        return;
    }

    let scrollAmount = 0;
    const scrollStep = 250;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;

    nextBtn.addEventListener("click", () => {
        scrollAmount += scrollStep;
        if (scrollAmount > maxScroll) scrollAmount = maxScroll;
        carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
    });

    prevBtn.addEventListener("click", () => {
        scrollAmount -= scrollStep;
        if (scrollAmount < 0) scrollAmount = 0;
        carousel.scrollTo({ left: scrollAmount, behavior: "smooth" });
    });
}

// Function to update images based on selected variant
function updateImages(images) {
    const mainImages = document.querySelectorAll('.main-image img');
    const thumbnails = document.querySelectorAll('.thumbnails img');
    const radioButtons = document.querySelectorAll('input[name="gallery"]');

    // Update images and thumbnails with the provided variant images
    images.forEach((image, index) => {
        const imgSrc = image.textContent;
        if (index < mainImages.length) {
            mainImages[index].src = imgSrc;
            mainImages[index].style.display = index === 0 ? 'block' : 'none'; // Show only first image initially
        }
        if (index < thumbnails.length) {
            thumbnails[index].src = imgSrc;
        }
    });

    // Hide any unused main images or thumbnails
    for (let i = images.length; i < mainImages.length; i++) {
        mainImages[i].src = '';
        mainImages[i].style.display = 'none';
    }
    for (let i = images.length; i < thumbnails.length; i++) {
        thumbnails[i].src = '';
        thumbnails[i].parentElement.style.display = 'none'; // Hide unused thumbnail labels
    }

    // Update radio buttons
    radioButtons.forEach((radio, index) => {
        if (index < images.length) {
            radio.disabled = false;
            radio.checked = index === 0; // Check first radio button
        } else {
            radio.disabled = true;
            radio.checked = false;
        }
        radio.addEventListener('change', () => {
            mainImages.forEach((img, i) => {
                img.style.display = i === index ? 'block' : 'none';
            });
        });
    });
}

// Function to fetch and display product details
function fetchProductDetails(productId) {
    currentProductId = productId;

    fetch('../XML/products.xml')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "text/xml");

            const product = xmlDoc.querySelector(`product[id="${productId}"]`);
            if (!product) {
                console.error(`Product with ID ${productId} not found in XML.`);
                return;
            }

            const category = product.querySelector('category').textContent;
            const subCategory = product.querySelector('subCategory')?.textContent || '';
            const productName = product.querySelector('name').textContent;

            const categoryPages = {
                "Dresses": "../HTML/dresses.html",
                "Clothing": "../HTML/clothing.html",
                "Event": "../HTML/eventWear.html",
                "Summer": "../HTML/summer.html",
                "Vintage": "../HTML/vintage.html",
                "Winter": "../HTML/winter.html",
                "Excluive": "../HTML/exclusive.html",
                "Iconic": "../HTML/iconic.html",
                "New": "../HTML/newArrival.html",
                "Offer": "../HTML/offer.html"
            };

            const baseCategoryPage = categoryPages[category] || `../HTML/category.html`;
            const categoryLink = `${baseCategoryPage}?category=${encodeURIComponent(category.toLowerCase())}`;
            const subCategoryLink = subCategory 
                ? `${baseCategoryPage}?category=${encodeURIComponent(category.toLowerCase())}&subcategory=${encodeURIComponent(subCategory.toLowerCase())}`
                : categoryLink;

            const breadcrumbNav = document.getElementById('breadcrumb-nav');
            if (breadcrumbNav) {
                breadcrumbNav.innerHTML = `
                        <a href="../HTML/html.html">Home</a>
                        <a href="${categoryLink}">${category}</a> 
                        ${subCategory ? `<a href="${subCategoryLink}">${subCategory}</a> / ` : ''}
                        <span>${productName}</span>
                    `;
                }

            const productPrice = product.querySelector('price').textContent;
            const discountPrice = product.querySelector('discountPrice').textContent;
            const discount = product.querySelector('discount').textContent;
            const variants = product.querySelectorAll('variants variant');

            currentProductName = productName;
            currentProductPrice = productPrice;

            document.querySelector('.product-name').textContent = productName;
            document.querySelector('.pro-price b').textContent = `LKR ${productPrice}`;
            document.querySelector('.pro-price .discount').innerHTML = `<s>LKR ${discountPrice}</s>   ${discount}`;

            // Load default variant (first variant, e.g., "Black")
            const defaultVariant = variants[0];
            const defaultImages = defaultVariant.querySelectorAll('images image');
            updateImages(defaultImages);

            // Populate color picker
            const colorPicker = document.querySelector('.color-picker');
            colorPicker.innerHTML = '';

            const colorNameDisplay = document.createElement('p');
            colorNameDisplay.className = 'selected-color';
            colorNameDisplay.textContent = defaultVariant.getAttribute('color');
            colorNameDisplay.style.fontSize = '16px';
            colorNameDisplay.style.marginBottom = '10px';
            colorPicker.appendChild(colorNameDisplay);

            variants.forEach((variant) => {
                const colorCode = variant.getAttribute('colorCode');
                const color = variant.getAttribute('color');

                const button = document.createElement('button');
                button.className = 'color-btn';
                button.style.backgroundColor = colorCode;
                button.setAttribute('data-color', color);

                button.addEventListener('click', () => {
                    const variantImages = variant.querySelectorAll('images image');
                    updateImages(variantImages);
                    colorNameDisplay.textContent = color;
                });

                colorPicker.appendChild(button);
            });

            document.querySelectorAll('.size-section button').forEach(button => {
                button.addEventListener('click', function () {
                    document.querySelectorAll('.size-section button').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    const selectedSizeElement = document.querySelector('.selected-size');
                    if (selectedSizeElement) {
                        selectedSizeElement.textContent = this.textContent;
                    }
                });
            });

            const addToCartButton = document.getElementById("add-to-cart");
            if (addToCartButton && !addToCartButton.dataset.listenerAdded) {
                addToCartButton.addEventListener('click', handleAddToCart);
                addToCartButton.dataset.listenerAdded = "true";
            }

            const addToWishlistButton = document.getElementById("add-to-wishlist");
            if (addToWishlistButton) {
                addToWishlistButton.removeEventListener('click', handleAddToWishlist);
                addToWishlistButton.addEventListener('click', handleAddToWishlist);
                addToWishlistButton.style.backgroundColor = isInWishlist(productId) ? 'black' : '';
            }

            fetchSimilarProducts(category, xmlDoc, productId);
            loadReviews(productId); 
        })
        .catch(error => console.error('Error fetching product data:', error));
}

// Single DOMContentLoaded listener with fallback
document.addEventListener("DOMContentLoaded", function () {
    const productId = getQueryParam('productId');
    if (productId) {
        fetchProductDetails(productId);
    } else {
        console.warn('No product ID found in the URL.');
        const container = document.querySelector('.info-container');
        if (container) {
            container.innerHTML = '<p>Please select a product to view its details.</p>';
        }
    }
});

/*Get the product ID from the URL
const productId = getQueryParam('productId');

 Fetch and display product details
if (productId) {
    fetchProductDetails(productId);
} else {
    console.error('No product ID found in the URL.');
}*/


// Rest of the code (generateRatingStars, addToWishlist, event listeners) remains unchanged
function generateRatingStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        stars += i < rating 
            ? '<i class="fa-solid fa-star" style="color: black;"></i>'
            : '<i class="fa-regular fa-star" style="color: grey;"></i>';
    }
    return stars;
  }


//review part
async function loadReviews(productId) {
    const response = await fetch('../XML/products.xml'); // Path to your XML file
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Get product by ID (now passed dynamically)
    const product = xmlDoc.querySelector(`product[id="${productId}"]`);

    const reviewContainer = document.getElementById('reviews');
    reviewContainer.innerHTML = ''; // Clear existing reviews

    // Fetch reviews from the XML file
    const reviews = product.querySelectorAll('customerReviews > review');
    reviews.forEach(review => {
        const rating = review.querySelector('rating').textContent;
        const text = review.querySelector('text').textContent;

        // Generate star rating HTML
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? '&#9733;' : '&#9734;';
        }

        // Create HTML block for XML reviews
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <strong class="stars">${stars}</strong>
            <p>${text}</p>
        `;
        reviewContainer.appendChild(reviewItem);
    });

    // Add two hardcoded static reviews using JavaScript
    const staticReviews = [
        { rating: 4, text: 'Ordered during a sale and wasn’t sure what to expect. But WOW. Everything exceeded my expectations. This brand is the real deal.' },
        { rating: 3, text: 'The lace details are stunning. Looks delicate but feels sturdy. Wore it for an anniversary dinner and felt gorgeous. Total showstopper.' }
    ];

    staticReviews.forEach(review => {
        const rating = review.rating;
        const text = review.text;

        // Generate star rating HTML for static reviews
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= rating ? '&#9733;' : '&#9734;';
        }

        // Create HTML block for static reviews
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <strong class="stars">${stars}</strong>
            <p>${text}</p>
        `;
        reviewContainer.appendChild(reviewItem);
    });
}


//search functions
// Product data cache
let products = [];

// Initialize search functionality
document.addEventListener('DOMContentLoaded', async function() {
  const searchInput = document.querySelector('.search-container input');
  const searchButton = document.querySelector('.search-container button');
  const searchResults = document.createElement('div');
  searchResults.className = 'search-results';
  document.querySelector('.search-container').appendChild(searchResults);

  // Load products from XML
  await loadProducts();

  // Search function with debouncing
  const performSearch = debounce(function(searchTerm) {
    if (!searchTerm.trim()) {
      searchResults.classList.remove('show');
      return;
    }

    const results = searchProducts(searchTerm);
    displayResults(results, searchTerm);
  }, 300);

  // Event listeners
  searchInput.addEventListener('input', function() {
    performSearch(this.value);
  });

  searchButton.addEventListener('click', function(e) {
    e.preventDefault();
    performSearch(searchInput.value);
  });

  // Close results when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search-container')) {
      searchResults.classList.remove('show');
    }
  });
});

// Load products from XML into array
async function loadProducts() {
  try {
    const response = await fetch('../XML/products.xml');
    const data = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    const productNodes = xmlDoc.querySelectorAll('product');

    products = Array.from(productNodes).map(product => ({
      id: product.getAttribute('id'), // Keep this for internal use
      productId: product.getAttribute('id'), // Add this for URL consistency
      name: product.querySelector('name').textContent,
      price: product.querySelector('price').textContent,
      discountPrice: product.querySelector('discountPrice')?.textContent || '',
      productPage: product.querySelector('productPage')?.textContent || '#',
      image: product.querySelector('defaultImages image')?.textContent || 'default-product.jpg',
      category: product.querySelector('category')?.textContent || ''
    }));

    console.log(`${products.length} products loaded`);
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Search through product array
function searchProducts(searchTerm) {
  const searchLower = searchTerm.toLowerCase();
  
  return products.filter(product => {
    return product.name.toLowerCase().includes(searchLower) || 
           product.category.toLowerCase().includes(searchLower);
  }).slice(0, 10); // Limit to 10 results
}

// Display search results linking to productdemo.html with productId parameter
function displayResults(results, searchTerm) {
  const searchResults = document.querySelector('.search-results');
  searchResults.innerHTML = '';

  if (results.length === 0) {
    searchResults.innerHTML = '<div class="result-item">No products found</div>';
    searchResults.classList.add('show');
    return;
  }

  const highlightText = (text) => {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  results.forEach(product => {
    const item = document.createElement('a');
    item.className = 'result-item';
    item.href = `productdemo.html?productId=${product.productId}`; // Changed from id to productId
    
    item.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="info">
        <div class="name">${highlightText(product.name)}</div>
        <div class="price-container">
          <span class="current-price">LKR ${product.price}</span>
          ${product.discountPrice ? `<span class="original-price">LKR ${product.discountPrice}</span>` : ''}
        </div>
      </div>
    `;

    searchResults.appendChild(item);
  });

  searchResults.classList.add('show');
}

// Debounce function to limit search frequency
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
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
