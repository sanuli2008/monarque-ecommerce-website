function loadWishlist() {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const wishlistContainer = document.querySelector(".cart-info-container");

    wishlistContainer.innerHTML = ""; // Clear existing cart content

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "<p>Your Wishlist is empty.</p>";
        return;
    }

    let wishlistMain = null; // Container for every 4 products

    wishlist.forEach((item, index) => {
        let productId = item.productId; // Store the product ID in a variable
        // Create a new .wishlist-main container every 4 products
        if (index % 4 === 0) {
            wishlistMain = document.createElement("div");
            wishlistMain.classList.add("wishlist-main");
            wishlistContainer.appendChild(wishlistMain);
        }

        // Create product card
        let cartItem = document.createElement("div");
        cartItem.classList.add("card");
        cartItem.innerHTML = `
            <img src="${item.image}" alt="Wishlist Dress" class="wishlist-img">
            <h3>${item.name}</h3>
            <p class="price">${item.price}</p>

            <a href="productdemo.html?productId=${productId}" target="_blank">
                <button class="more">GET THE DETAILS</button>
            </a>
            <button class="remove" data-id="${productId}">REMOVE</button>
        `;

        wishlistMain.appendChild(cartItem); // Append card to the current wishlist-main
    });

    wishlistContainer.appendChild(wishlistMain); // Append the wishlist container to the main cart container
    // Add event listeners to all remove buttons
    document.querySelectorAll(".remove").forEach(button => {
        button.addEventListener("click", function () {
            let productId = this.getAttribute("data-id");
            removeFromWishlist(productId);
        });
    });
}

function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    
    // Use productId instead of id
    wishlist = wishlist.filter(item => item.productId !== productId); 
    
    localStorage.setItem("wishlist", JSON.stringify(wishlist)); // Update localStorage
    loadWishlist(); // Reload wishlist
}

// Load wishlist on page load
document.addEventListener("DOMContentLoaded", loadWishlist);


