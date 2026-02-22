# Monarque – Luxury Women’s Fashion E-Commerce Website

Monarque is a front-end e-commerce website designed to showcase elegant women’s fashion in a clean, luxurious, and accessible digital experience.

This project demonstrates technical web development skills combined with strong UX/UI principles, accessibility standards, and dynamic interactivity using structured XML data.

---

## Project Overview

Monarque provides:

- Product browsing by category and subcategory  
- Dynamic filtering using URL parameters  
- Interactive product modal previews  
- Wishlist functionality  
- LocalStorage-based shopping cart  
- Validated checkout form  
- Dynamic breadcrumb navigation  
- Accessibility-focused design  
- Luxury-inspired visual styling  

The platform focuses on usability, accessibility, and structured front-end architecture.

---

## Technologies Used

- HTML5 – Semantic page structure  
- CSS3 – Styling, layout, responsive design  
- JavaScript (ES6) – Interactivity and DOM manipulation  
- XML – Product data management  
- W3C Validator – Code validation  
- Accessibility testing tools – Contrast and semantic validation  

---

## Key Features and Functionality

### Dynamic Product Filtering

The `filterAndDisplayProducts()` function:

- Reads category and subcategory from URL parameters  
- Filters products dynamically  
- Renders product cards based on selected filters  
- Supports layered filtering logic  

---

### Similar Products Carousel

The `fetchSimilarProducts(category, xmlDoc, currentProductId)` function:

- Filters XML product data by category  
- Excludes the currently viewed product  
- Dynamically generates carousel items  
- Includes wishlist and cart buttons  
- Enables smooth navigation controls  

---

### Product Modal System

The `openModal(productElement)` function:

- Fetches product data using the Fetch API  
- Parses XML using DOMParser  
- Displays product details dynamically  
- Enables variant selection (size and color)  
- Validates selection before adding to cart  
- Stores cart data in localStorage  

---

### Navigation and Structure

Folder organization improves scalability and maintainability:
/HTML
/CSS
/JS
/XML
/images

Navigation features include:

- Persistent navigation bar across all pages  
- Dynamic breadcrumb trail  
- Hover effects for interactive feedback  
- Clear category hierarchy  

---

## UX and UI Design Principles

### Visual Identity

- White (#ffffff) background for clean aesthetics  
- Dark gray (#1A1C20) typography for strong readability  
- Balanced spacing and grid layout  
- High-quality imagery  

### Typography

- Headings: 36px  
- Subheadings: 28px  
- Body text: 16px  
- Serif and sans-serif font pairing  
- Reusable CSS classes for consistency  

### Navigation Design

- Discoverable category structure  
- Breadcrumb navigation for orientation  
- Minimal click depth for efficiency  

---

## Accessibility Implementation

The project applies accessibility best practices:

- Semantic HTML elements (`<h2>`, `<p>`, `<legend>`)  
- Proper `<label>` and `for` attribute linking  
- Alt attributes for images  
- Color contrast testing  
- Accessibility testing on wishlist and checkout pages  
- W3C HTML and CSS validation  

---

## Validation and Testing

- W3C HTML validation  
- W3C CSS validation  
- Accessibility contrast tests  
- Functional testing for wishlist and checkout  
- Form validation for required fields  

---

## Development Challenges and Solutions

### Challenges

- Integrating JavaScript with XML data  
- DOM manipulation for dynamic rendering  
- Implementing interactive modals  
- Managing cart functionality using localStorage  

### Solutions

- Studied JavaScript documentation and tutorials  
- Practiced event listeners and Fetch API usage  
- Broke down complex features into smaller components  
- Implemented incremental testing during development  

---

## Future Improvements

- Backend integration (Node.js or Firebase)  
- User authentication system  
- Payment gateway integration  
- Product search functionality  
- Enhanced ARIA roles for improved accessibility  
- Performance optimization  

---

## Author

Developed as part of a web development coursework project demonstrating technical implementation, accessibility standards, and UX/UI design principles.
