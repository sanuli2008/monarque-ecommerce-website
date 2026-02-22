function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    const cartContainer = document.querySelector(".cart-info-container");

    cartContainer.innerHTML = ""; // Clear previous items to prevent duplicates

    if (!cart || cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cart.forEach((item, index) => {
        let cartItem = document.createElement("div");
        cartItem.classList.add("cart-info");
        cartItem.setAttribute("data-index", index); // Add index for updating

        cartItem.innerHTML = `
            <img src="${item.image}" alt="cart_details" class="cart-img" id="cart-img-${index}">
            <div class="details">
                <p class="name">Name: ${item.name}</p>
                <div class="info">
                    <span>Color: ${item.color}</span>
                    <span>Size: ${item.size}</span>  
                </div>
                <div class="quantity">
                    <span class="qty-label">QTY : ${item.quantity}</span>
                </div>
                <div class="buttons">
                    <button onclick="removeFromCart(${index})">Remove</button>
                    <button onclick="openEditModal(${index})">Edit</button>
                    <a href="#wishlist" class="icon-link"><i class="far fa-heart"></i></a>
                </div>
            </div> 
            <div class="price-box">
                <p>${item.price}</p>
            </div>  
        `;

        cartContainer.appendChild(cartItem);
    });

    updateTotalPrice();
    updateCartItemCount();



    // Handle quantity changes
    document.querySelectorAll(".qty-dropdown").forEach((dropdown) => {
        dropdown.addEventListener("change", (event) => {
            let index = event.target.getAttribute("data-index");
            updateCartQuantity(index, event.target.value);
        });
    });
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (!cart) return;

    cart.splice(index, 1); // Remove the item from the cart array

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart(); // Refresh cart display
}

function updateCartQuantity(index, newQuantity) {
    let cart = JSON.parse(localStorage.getItem("cart"));

    if (!cart) return;

    // Update the quantity of the selected item
    cart[index].quantity = newQuantity;

    // Save the updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart(); // Refresh cart display
}
function getTotalPrice() {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart || cart.length === 0) return 0;

    return cart.reduce((total, item) => {
        let price = parseFloat(item.price.toString().replace("LKR ", "")) || 0; // Remove "LKR " & convert to number
        let quantity = parseInt(item.quantity, 10) || 0;
        return total + (price * quantity);
    }, 0).toFixed(2);
}


function updateTotalPrice() {
    let totalPrice = parseFloat(getTotalPrice()); // Get cart total
    let discount = 3000; // Fixed discount (adjust as needed)
    let invoiceAmount = totalPrice - discount; // Final amount

    // Update placeholders
    document.getElementById("cart-total").textContent = `LKR ${totalPrice.toLocaleString()}`;
    document.getElementById("cart-discount").textContent = `LKR ${discount.toLocaleString()}`;
    document.getElementById("cart-invoice").textContent = `LKR ${invoiceAmount.toLocaleString()}`;
    console.log(totalPrice)
}

function getCartItemCount() {
    // Try to get the cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart"));
    
    // If no cart is found or it is empty, return 0
    if (!cart || cart.length === 0) {
        console.log("Cart is empty or doesn't exist.");
        return 0;
    }

    // Return the total quantity of items in the cart
    return cart.reduce((count, item) => count + parseInt(item.quantity, 10), 0);
}

function updateCartItemCount() {
    let itemCount = getCartItemCount(); // Get the current cart count

    // Update all elements with the class 'cart-item-count'
    document.querySelectorAll(".cart-item-count").forEach(el => {
        el.textContent = itemCount;
    });

    console.log("Cart item count updated to:", itemCount);  // Log the updated count
}


// Load cart on page load
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    updateTotalPrice();
    updateCartItemCount();
});

//edit part 
async function openEditModal(index) {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart) return;

    let item = cart[index];

    // Get modal elements
    let modal = document.getElementById("editModal");
    let closeBtn = document.querySelector(".edit-modal .close");
    let saveBtn = document.getElementById("saveChanges");
    let quantityInput = document.getElementById("editQuantity");
    let modalImage = document.getElementById("modalImage");
    let modalName = document.getElementById("modalName");
    let modalPrice = document.getElementById("modalPrice");
    let colorOptions = document.getElementById("colorOptions");
    let sizeOptions = document.getElementById("sizeOptions");

    // Set initial values
    // Populate dropdown with quantity options (e.g., 1 to 10)
    quantityInput.innerHTML = ""; // Clear previous options
    for (let i = 1; i <= 6; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.text = i;
        if (i === item.quantity) {
            option.selected = true;
        }
        quantityInput.appendChild(option);
    }


    // Fetch product data from XML
    let response = await fetch("../XML/products.xml"); // Adjust path
    let xmlText = await response.text();
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlText, "text/xml");

    // Find product by ID
    let product = [...xmlDoc.getElementsByTagName("product")].find(p => 
        p.getAttribute("id") === item.id
    );

    if (!product) {
        alert("Product not found in XML!");
        return;
    }

    // Get product details
    modalName.textContent = product.getElementsByTagName("name")[0].textContent;
    modalPrice.textContent = `Price: ${product.getElementsByTagName("price")[0].textContent}`;

    // Get variants
    let variants = product.getElementsByTagName("variant");

    colorOptions.innerHTML = ""; // Clear previous buttons

    let selectedVariantImage = item.image; // Track selected image

    [...variants].forEach(variant => {
        let color = variant.getAttribute("color");
        let colorCode = variant.getAttribute("colorCode");
        let defaultImage = variant.getElementsByTagName("image")[0].textContent;

        let btn = document.createElement("button");
        btn.textContent = ""; // Just a color circle (no name inside)
        btn.style.backgroundColor = colorCode;
        btn.onclick = function () {
            item.color = color;
            selectedVariantImage = defaultImage;
            modalImage.src = defaultImage;
        
            // Update selected color name display
            document.getElementById("selectedColorName").textContent = color;
        };
        

        colorOptions.appendChild(btn);
    });

    // Set the default image for the currently selected color
    let currentVariant = [...variants].find(v => v.getAttribute("color") === item.color);
    document.getElementById("selectedColorName").textContent = item.color || "";
    modalImage.src = currentVariant 
        ? currentVariant.getElementsByTagName("image")[0].textContent 
        : product.getElementsByTagName("image")[0].textContent; // Fallback

    // Load sizes (Assuming standard sizes for now)
    let availableSizes = ["S", "M", "L", "XL"]; // Modify if size exists in XML
    sizeOptions.innerHTML = "";
    availableSizes.forEach(size => {
        let btn = document.createElement("button");
        btn.textContent = size;
    
        // Add 'active' class if this is the current size
        if (size === item.size) {
            btn.classList.add("active");
        }
    
        btn.addEventListener("click", function () {
            item.size = size;
    
            // Remove active class from all size buttons
            document.querySelectorAll('#sizeOptions button').forEach(b => b.classList.remove("active"));
    
            // Add active class to this button
            this.classList.add("active");
        });
    
        sizeOptions.appendChild(btn);
    });
    

    // Show modal
    modal.style.display = "block";

    // Close modal when clicking 'X'
    closeBtn.onclick = function () {
        modal.style.display = "none";
    };

    // Close modal when clicking outside
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Save changes and update cart
    saveBtn.onclick = function () {
        let newQuantity = parseInt(quantityInput.value);
        if (newQuantity > 0) {
            item.quantity = newQuantity;
            item.image = selectedVariantImage; // Set new image
            cart[index] = item; // Update existing item, NOT add a new one
            localStorage.setItem("cart", JSON.stringify(cart));
            modal.style.display = "none"; // Close modal
            updateCartItem(index, item); // Update the cart visually
        } else {
            alert("Please enter a valid quantity.");
        }
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