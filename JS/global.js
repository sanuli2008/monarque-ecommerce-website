//modal for all pages
// Function to open modal with product details
function openModal(product) {
    const modal = document.getElementById('myModal');
    const modalContent = document.getElementById('modal-content');

    fetch('../XML/products.xml')
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
        .then(data => {
            const xmlProduct = data.querySelector(`product[id="${product.productId}"]`);
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
                            <button id="add-to-cart">Add to cart</button>
                        </div>
                    </div>
                </div>
            `;

            modal.style.display = 'block';

            // Handle color selection
            document.querySelectorAll('.color-circle').forEach(circle => {
                circle.addEventListener('click', function () {
                    document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    document.getElementById('modalProductImage').src = variantImages[this.getAttribute('data-color')];
                });
            });

            // Handle size selection
            document.querySelectorAll('.size-section button').forEach(button => {
                button.addEventListener('click', function () {
                    document.querySelectorAll('.size-section button').forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            // Add to Cart button
            document.getElementById('add-to-cart').addEventListener('click', function () {
                const selectedColor = document.querySelector('.color-circle.active')?.getAttribute('data-color');
                const selectedSize = document.querySelector('.size-section button.active')?.getAttribute('data-size');
                const quantity = document.querySelector('.qty-dropdown').value;

                // Validation
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

                // Create product object
                const cartItem = {
                    id: product.productId, // Matches your other page's 'id'
                    name: document.querySelector('.product-name').textContent,
                    price: document.querySelector('.pro-price b').textContent,
                    color: selectedColor,
                    size: selectedSize,
                    quantity: parseInt(quantity, 10),
                    image: document.getElementById('modalProductImage').src
                };

                // Update cart in localStorage
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

// Assuming this is still in dress.js
document.addEventListener('click', function (event) {
    if (event.target.closest('.product-add-cart')) {
        const button = event.target.closest('.product-add-cart');
        const productId = button.dataset.productId;
        const product = window.productData.find(p => p.productId === productId);
        if (product) openModal(product);
    }
});

window.onclick = function (event) {
    const modal = document.getElementById('myModal');
    if (event.target === modal) modal.style.display = 'none';
};



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


//wishislist in all pages
// Function to update all wishlist buttons on the page
function updateAllWishlistButtons() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    document.querySelectorAll('.add-to-wishlist').forEach(button => {
        const productId = button.getAttribute('data-product-id');
        const isWishlisted = wishlist.some(item => item.productId === productId);
        if (isWishlisted) {
            button.classList.add('wishlisted');
        } else {
            button.classList.remove('wishlisted');
        }
    });
}
// Function to check if a product is in the wishlist
function isInWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some(item => item.productId === productId);
}

// Helper function to update all wishlist buttons for a product
function updateWishlistButtonStyles(productId, isWishlisted) {
    document.querySelectorAll(`.add-to-wishlist[data-product-id="${productId}"]`).forEach(button => {
        if (isWishlisted) {
            button.classList.add('wishlisted');
        } else {
            button.classList.remove('wishlisted');
        }
    });
}

// Function to check if a product is in the wishlist
function isInWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    return wishlist.some(item => item.productId === productId);
}

// Function to add/remove product from wishlist with toggle
function addToWishlist(event) {
    const button = event.currentTarget;
    const productId = button.getAttribute("data-product-id");

    if (!window.productData) {
        console.error("Product data not loaded yet.");
        alert("Error: Product data is not available. Please try again later.");
        return;
    }

    const product = window.productData.find(p => p.productId === productId);
    if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        alert("Error: Product not found.");
        return;
    }

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const modal = document.getElementById('myModal');
    let selectedColor = "N/A";
    let selectedSize = "N/A";
    let quantity = "1";
    let image = product.image;

    if (modal && modal.style.display === "block") {
        selectedColor = document.querySelector('.color-circle.active')?.getAttribute('data-color') || "N/A";
        selectedSize = document.querySelector('.size-section button.active')?.getAttribute('data-size') || "N/A";
        quantity = document.querySelector('.qty-dropdown')?.value || "1";
        image = document.getElementById('modalProductImage')?.src || product.image;
    }

    const wishlistItem = {
        productId: product.productId,
        name: product.name,
        price: `LKR ${product.price}`,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
        image: image
    };

    if (isInWishlist(productId)) {
        wishlist = wishlist.filter(item => item.productId !== productId);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Item removed from Wishlist!");
    } else {
        wishlist.push(wishlistItem);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Item added to Wishlist!");
    }

    updateAllWishlistButtons(); // Update all buttons after change

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


//all product
// Function to get category and subcategory from the URL
function getFilterFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
      category: urlParams.get('category') ? urlParams.get('category').toLowerCase() : null,
      subcategory: urlParams.get('subcategory') ? urlParams.get('subcategory').toLowerCase() : null
  };
}

// Function to fetch product data from the XML file (unchanged, included for context)
function fetchProductsData() {
  fetch('../XML/products.xml')
      .then(response => response.text())
      .then(data => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'text/xml');
          const products = xmlDoc.querySelectorAll('product');
          const productData = [];

          products.forEach(product => {
              const productId = product.getAttribute('id');
              const categoryNode = product.querySelector('category');
              const subCategoryNode = product.querySelector('subCategory');
              const nameNode = product.querySelector('name');
              const priceNode = product.querySelector('price');
              const ratingNode=product.querySelector('rating');
              const reviewsNode=product.querySelector('reviews');
              const soldNode=product.querySelector('sold');
              const imageNode = product.querySelector('defaultImages image');

              const category = categoryNode ? categoryNode.textContent.toLowerCase() : 'unknown';
              const subCategory = subCategoryNode ? subCategoryNode.textContent.toLowerCase() : 'unknown';
              const name = nameNode ? nameNode.textContent : 'Unnamed Product';
              const price = priceNode ? priceNode.textContent : '0.00';
              const image = imageNode ? imageNode.textContent : '../images/placeholder.webp';
              const rating = ratingNode ? parseInt(ratingNode.textContent) : 0;         
              const reviews = reviewsNode ? reviewsNode.textContent : '0';              
              const sold = soldNode ? soldNode.textContent : '';   
              productData.push({ productId, category, subCategory, name, price,rating,reviews,sold, image });
          });

          window.productData = productData;
          filterAndDisplayProducts();
          updateAllWishlistButtons();
      })
      .catch(error => console.error('Error fetching product data:', error));
}

// Updated function to filter and display products
function filterAndDisplayProducts() {
  const { category, subcategory } = getFilterFromURL();
  let filteredProducts = window.productData;

  // If a category is specified, filter by it first
  if (category) {
      filteredProducts = filteredProducts.filter(product => 
          product.category === category || product.subCategory === category
      );
  }

  // If a subcategory is specified, filter within the context of the category (if provided)
  if (subcategory) {
      if (category) {
          // Filter subcategories only within the specified category
          filteredProducts = filteredProducts.filter(product => 
              product.category === category && product.subCategory === subcategory
          );
      } else {
          // If no category is specified, filter by subcategory across all categories
          filteredProducts = filteredProducts.filter(product => 
              product.subCategory === subcategory
          );
      }
  }

  // If no filters are applied, show all products
  if (!category && !subcategory) {
      filteredProducts = window.productData;
  }

  displayProducts(filteredProducts);
  updateAllWishlistButtons();
}

// Function to display products (unchanged, included for completeness)
function displayProducts(products) {
  const container = document.querySelector('#products-container');
  if (!container) return;
  container.innerHTML = '';

  let row = document.createElement('div');
  row.classList.add('flex-container');

  products.forEach((product, index) => {
      const productCard = `
          <div class="full-product">
              <div class="product-img">
                  <a href="productdemo.html?productId=${product.productId}" target="_blank">
                      <img src="${product.image}" alt="${product.name}" class="image">
                  </a>
                  <div class="add_btns">
                      <button class="icon-link add-to-wishlist" data-product-id="${product.productId}">
                          <i class="fa-regular fa-heart"></i>
                      </button>
                      <button class="product-add-cart" data-product-id="${product.productId}">
                          <i class="fa-solid fa-cart-plus" title="Add to Cart"></i>
                      </button>
                  </div>
              </div>
              <p class="caption">${product.name}</p>
              <p class="price"><b>LKR ${product.price}</b> <span class="sold-amount">${product.sold}</span></p>
              <div class="rating">
                  ${generateRatingStars(product.rating)}
                  <span class="review-count">(${product.reviews} reviews)</span>
              </div>
          </div>
      `;

      row.innerHTML += productCard;

      if ((index + 1) % 4 === 0) {
          container.appendChild(row);
          row = document.createElement('div');
          row.classList.add('flex-container');
      }
  });

  if (row.innerHTML) {
      container.appendChild(row);
  }
  // Attach event listeners to wishlist buttons
  document.querySelectorAll(".add-to-wishlist").forEach(button => {
      button.addEventListener("click", addToWishlist);
  });
  updateAllWishlistButtons();
}

// Updated filter function for navbar clicks
function filterProductsByCategory(category, subcategory) {
  let filteredProducts = window.productData;

  if (category) {
      filteredProducts = filteredProducts.filter(product => 
          product.category === category || product.subCategory === category
      );
  }

  if (subcategory && category) {
      filteredProducts = filteredProducts.filter(product => 
          product.category === category && product.subCategory === subcategory
      );
  } else if (subcategory) {
      filteredProducts = filteredProducts.filter(product => 
          product.subCategory === subcategory
      );
  }

  displayProducts(filteredProducts);
  updateAllWishlistButtons();
}

// Function to handle navbar category/subcategory clicks
function setupNavbarListeners() {
  const categoryLinks = document.querySelectorAll('.categories a, .sub-list a');
  categoryLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();
          const href = link.getAttribute('href');
          const urlParams = new URLSearchParams(href.split('?')[1]);
          const category = urlParams.get('category') ? urlParams.get('category').toLowerCase() : null;
          const subcategory = urlParams.get('subcategory') ? urlParams.get('subcategory').toLowerCase() : null;

          if (document.querySelector('#products-container')) {
              filterProductsByCategory(category, subcategory);
          } else {
              window.location.href = href;
          }
      });
  });
}

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



document.addEventListener('DOMContentLoaded', () => {
  fetchProductsData();
  setupNavbarListeners();
});

window.addEventListener('popstate', filterAndDisplayProducts);

//breadcrumbs for category pages
// Function to set breadcrumbs based on URL context
function setupBreadcrumbs() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('productId');
  const categoryParam = urlParams.get('category')?.toLowerCase() || null;
  const subCategoryParam = urlParams.get('subcategory')?.toLowerCase() || null;

  // Define category page mappings
  const categoryPages = {
      "dresses": "../HTML/dresses.html",
      "clothing": "../HTML/clothing.html",
      "event": "../HTML/eventWear.html",
      "summer": "../HTML/summer.html",
      "vintage": "../HTML/vintage.html",
      "winter": "../HTML/winter.html",
      "excluive": "../HTML/exclusive.html",
      "iconic": "../HTML/iconic.html",
      "new": "../HTML/newArrival.html",
      "offer": "../HTML/offer.html"
  };

  // Function to capitalize first letter for display
  const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

  // If on a product page with productId, fetch from XML
  if (productId) {
      fetch('../XML/products.xml')
          .then(response => response.text())
          .then(data => {
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(data, 'text/xml');
              const product = xmlDoc.querySelector(`product[id="${productId}"]`);

              if (!product) {
                  console.error('Product not found');
                  return;
              }

              const category = product.querySelector('category')?.textContent || 'Unknown';
              const subCategory = product.querySelector('subCategory')?.textContent || '';
              const productName = product.querySelector('name')?.textContent || 'Unnamed Product';

              const baseCategoryPage = categoryPages[category.toLowerCase()] || `../HTML/category.html`;
              const categoryLink = `${baseCategoryPage}?category=${encodeURIComponent(category.toLowerCase())}`;
              const subCategoryLink = subCategory 
                  ? `${baseCategoryPage}?category=${encodeURIComponent(category.toLowerCase())}&subcategory=${encodeURIComponent(subCategory.toLowerCase())}`
                  : categoryLink;

              const breadcrumbNav = document.getElementById('breadcrumb-nav');
              if (breadcrumbNav) {
                  breadcrumbNav.innerHTML = `
                      <a href="../HTML/html.html">Home</a> / 
                      <a href="${categoryLink}">${category}</a> / 
                      ${subCategory ? `<a href="${subCategoryLink}">${subCategory}</a> / ` : ''}
                      <span>${productName}</span>
                  `;
              }
          })
          .catch(error => console.error('Error fetching product data for breadcrumbs:', error));
  } else {
      // On a category page, use URL parameters directly
      if (categoryParam) {
          const baseCategoryPage = categoryPages[categoryParam] || `../HTML/category.html`;
          const categoryLink = `${baseCategoryPage}?category=${encodeURIComponent(categoryParam)}`;
          const subCategoryLink = subCategoryParam 
              ? `${baseCategoryPage}?category=${encodeURIComponent(categoryParam)}&subcategory=${encodeURIComponent(subCategoryParam)}`
              : '';

          const breadcrumbNav = document.getElementById('breadcrumb-nav');
          if (breadcrumbNav) {
              breadcrumbNav.innerHTML = `
                  <a href="../HTML/html.html">Home</a>  
                  <a href="${categoryLink}">${capitalize(categoryParam)}</a> / 
                  ${subCategoryParam ? `<span>${capitalize(subCategoryParam)}</span>` : ''}
              `;
          }
      }
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  setupBreadcrumbs();
  // Assuming fetchProductsData and setupNavbarListeners are still in your global.js
  fetchProductsData();
  setupNavbarListeners();
});