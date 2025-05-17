console.clear();

const cartContainer = document.getElementById('cartContainer');
const totalItemElement = document.getElementById('totalItem');
const badgeElement = document.getElementById('badge'); // Assuming you have badge in header

// Update cart badge from cookie
let cookies = document.cookie.split(';').map(c => c.trim());
let orderIdCookie = cookies.find(c => c.startsWith('orderId='));
let counterCookie = cookies.find(c => c.startsWith('counter='));

if (counterCookie && badgeElement) {
    let counter = counterCookie.split('=')[1];
    badgeElement.innerText = counter;
}

// Create container divs
let boxContainerDiv = document.createElement('div');
boxContainerDiv.id = 'boxContainer';

let totalContainerDiv = document.createElement('div');
totalContainerDiv.id = 'totalContainer';

let totalDiv = document.createElement('div');
totalDiv.id = 'total';
totalContainerDiv.appendChild(totalDiv);

let totalh2 = document.createElement('h2');
totalh2.innerText = 'Total Amount';
totalDiv.appendChild(totalh2);

let totalAmount = 0;

// Place Order Button setup
let buttonDiv = document.createElement('div');
buttonDiv.id = 'button';

let placeOrderButton = document.createElement('button');
placeOrderButton.innerText = 'Place Order';
buttonDiv.appendChild(placeOrderButton);

totalDiv.appendChild(buttonDiv);

// Function to update total amount in UI
function amountUpdate(amount) {
    // Clear previous total if any
    let existingTotal = document.getElementById('totalAmountDisplay');
    if (existingTotal) existingTotal.remove();

    let totalh4 = document.createElement('h4');
    totalh4.id = 'totalAmountDisplay';
    totalh4.innerText = 'Amount: Rs ' + amount;
    totalDiv.insertBefore(totalh4, buttonDiv);
}

// Function to render each product in cart
function dynamicCartSection(product, quantity) {
    let boxDiv = document.createElement('div');
    boxDiv.id = 'box';

    let boxImg = document.createElement('img');
    boxImg.src = product.preview;
    boxDiv.appendChild(boxImg);

    let boxh3 = document.createElement('h3');
    boxh3.innerText = product.name + ' × ' + quantity;
    boxDiv.appendChild(boxh3);

    let boxh4 = document.createElement('h4');
    boxh4.innerText = 'Amount: Rs ' + (product.price * quantity);
    boxDiv.appendChild(boxh4);

    boxContainerDiv.appendChild(boxDiv);
}

// Function to render bill summary (after clicking place order)
function renderBillSummary(productsData, itemCounts) {
    // Clear any previous bill
    let existingBill = document.getElementById('billSummary');
    if (existingBill) existingBill.remove();

    // Create bill container
    let billDiv = document.createElement('div');
    billDiv.id = 'billSummary';
    billDiv.style.marginTop = '20px';
    billDiv.style.padding = '10px';
    billDiv.style.border = '1px solid #ccc';
    billDiv.style.width = '80%';
    billDiv.style.marginLeft = 'auto';
    billDiv.style.marginRight = 'auto';
    billDiv.style.backgroundColor = '#f9f9f9';

    let billTitle = document.createElement('h2');
    billTitle.innerText = 'Order Bill Summary';
    billDiv.appendChild(billTitle);

    // Create table
    let table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    // Table header
    let headerRow = document.createElement('tr');
    ['Product', 'Quantity', 'Price (Rs)', 'Subtotal (Rs)'].forEach(text => {
        let th = document.createElement('th');
        th.innerText = text;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        th.style.backgroundColor = '#eee';
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    let totalAmount = 0;
    for (let id in itemCounts) {
        let product = productsData.find(p => p.id === id || p.id === Number(id));
        if (!product) continue;

        let qty = itemCounts[id];
        let subtotal = product.price * qty;
        totalAmount += subtotal;

        let row = document.createElement('tr');
        [product.name, qty, product.price, subtotal].forEach(val => {
            let td = document.createElement('td');
            td.innerText = val;
            td.style.border = '1px solid #ddd';
            td.style.padding = '8px';
            td.style.textAlign = typeof val === 'number' ? 'right' : 'left';
            row.appendChild(td);
        });
        table.appendChild(row);
    }

    // Total row
    let totalRow = document.createElement('tr');
    let tdLabel = document.createElement('td');
    tdLabel.colSpan = 3;
    tdLabel.style.textAlign = 'right';
    tdLabel.style.fontWeight = 'bold';
    tdLabel.innerText = 'Total Amount:';
    totalRow.appendChild(tdLabel);

    let tdAmount = document.createElement('td');
    tdAmount.style.fontWeight = 'bold';
    tdAmount.style.textAlign = 'right';
    tdAmount.innerText = totalAmount.toFixed(2);
    totalRow.appendChild(tdAmount);

    table.appendChild(totalRow);

    billDiv.appendChild(table);

    // Buttons: Confirm and Cancel
    let buttonsDiv = document.createElement('div');
    buttonsDiv.style.marginTop = '15px';
    buttonsDiv.style.textAlign = 'center';

    let confirmBtn = document.createElement('button');
    confirmBtn.innerText = 'Confirm and Pay';
    confirmBtn.style.marginRight = '15px';
    confirmBtn.style.padding = '10px 20px';
    confirmBtn.style.backgroundColor = '#28a745';
    confirmBtn.style.color = 'white';
    confirmBtn.style.border = 'none';
    confirmBtn.style.cursor = 'pointer';

    let cancelBtn = document.createElement('button');
    cancelBtn.innerText = 'Cancel';
    cancelBtn.style.padding = '10px 20px';
    cancelBtn.style.backgroundColor = '#dc3545';
    cancelBtn.style.color = 'white';
    cancelBtn.style.border = 'none';
    cancelBtn.style.cursor = 'pointer';

    buttonsDiv.appendChild(confirmBtn);
    buttonsDiv.appendChild(cancelBtn);
    billDiv.appendChild(buttonsDiv);

    cartContainer.appendChild(billDiv);

    // Hide place order button while bill summary is shown
    placeOrderButton.style.display = 'none';

    // Confirm button click
    confirmBtn.onclick = () => {
        // Clear cart cookies
        document.cookie = 'orderId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'counter=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        if (badgeElement) badgeElement.innerText = '0';

        // Redirect to payment or order confirmation page
        window.location.href = 'orderPlaced.html';  // Change as needed
    };

    // Cancel button click
    cancelBtn.onclick = () => {
        billDiv.remove();
        placeOrderButton.style.display = 'inline-block';
    };
}

// Fetch products data and render cart
let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function () {
    if (this.readyState === 4) {
        if (this.status === 200) {
            let productsData = JSON.parse(this.responseText);

            if (!orderIdCookie || !counterCookie) {
                totalItemElement.innerText = 'Total Items: 0';
                cartContainer.innerText = 'Your cart is empty.';
                placeOrderButton.disabled = true;
                return;
            }

            let counter = Number(counterCookie.split('=')[1]);
            totalItemElement.innerText = 'Total Items: ' + counter;

            let itemIds = orderIdCookie.split('=')[1].split(',');

            // Count frequencies
            let itemCounts = {};
            for (let id of itemIds) {
                itemCounts[id] = (itemCounts[id] || 0) + 1;
            }

            // Clear containers before rendering
            boxContainerDiv.innerHTML = '';
            totalDiv.innerHTML = '';
            totalDiv.appendChild(totalh2);
            totalDiv.appendChild(buttonDiv);

            totalAmount = 0;

            // Render each product with quantity
            for (let id in itemCounts) {
                let product = productsData.find(p => p.id === id || p.id === Number(id));
                if (!product) continue;

                let quantity = itemCounts[id];
                totalAmount += product.price * quantity;

                dynamicCartSection(product, quantity);
            }

            amountUpdate(totalAmount);

            // Append containers to DOM
            cartContainer.appendChild(boxContainerDiv);
            cartContainer.appendChild(totalContainerDiv);

            // Place Order button click: show bill summary
            placeOrderButton.onclick = () => {
                renderBillSummary(productsData, itemCounts);
            };

        } else {
            console.log('Failed to fetch product data');
        }
    }
};

httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product', true);
httpRequest.send();