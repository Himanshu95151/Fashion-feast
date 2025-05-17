console.clear();

// Get Product ID from URL
let id = location.search.split('?')[1];
console.log("Product ID:", id);

// Update cart badge from cookie on page load
if (document.cookie.includes("counter=")) {
    let cookieParts = document.cookie.split('; ').map(c => c.trim());
    let counterPart = cookieParts.find(part => part.startsWith('counter='));
    if (counterPart) {
        let counter = counterPart.split('=')[1];
        document.getElementById("badge").innerText = counter;
    }
}

// Function to create dynamic product detail view
function dynamicContentDetails(ob) {
    let mainContainer = document.createElement('div');
    mainContainer.id = 'containerD';
    document.getElementById('containerProduct').appendChild(mainContainer);

    // Left: Product Image
    let imageSectionDiv = document.createElement('div');
    imageSectionDiv.id = 'imageSection';
    let imgTag = document.createElement('img');
    imgTag.id = 'imgDetails';
    imgTag.src = ob.preview;
    imageSectionDiv.appendChild(imgTag);

    // Right: Product Details
    let productDetailsDiv = document.createElement('div');
    productDetailsDiv.id = 'productDetails';

    let h1 = document.createElement('h1');
    h1.innerText = ob.name;

    let h4 = document.createElement('h4');
    h4.innerText = ob.brand;

    let detailsDiv = document.createElement('div');
    detailsDiv.id = 'details';

    let h3Price = document.createElement('h3');
    h3Price.innerText = 'Rs ' + ob.price;

    let h3Desc = document.createElement('h3');
    h3Desc.innerText = 'Description';

    let para = document.createElement('p');
    para.innerText = ob.description;

    let productPreviewDiv = document.createElement('div');
    productPreviewDiv.id = 'productPreview';
    let h3Preview = document.createElement('h3');
    h3Preview.innerText = 'Product Preview';
    productPreviewDiv.appendChild(h3Preview);

    // Product preview images
    ob.photos.forEach((photoUrl) => {
        let previewImg = document.createElement('img');
        previewImg.className = 'previewImg';
        previewImg.src = photoUrl;
        previewImg.onclick = function () {
            imgTag.src = photoUrl;
        };
        productPreviewDiv.appendChild(previewImg);
    });

    // Add to Cart Button
    let buttonDiv = document.createElement('div');
    buttonDiv.id = 'button';

    let buttonTag = document.createElement('button');
    buttonTag.innerText = 'Add to Cart';
    buttonDiv.appendChild(buttonTag);

    // Add to Cart Functionality
    buttonTag.onclick = function () {
        alert("Item added to Cart");

        let cookie = document.cookie || "";
        let order = [];
        let counter = 0;

        // Parse cookies correctly
        let cookieParts = cookie.split('; ').map(c => c.trim());

        let orderPart = cookieParts.find(part => part.startsWith('orderId='));
        let counterPart = cookieParts.find(part => part.startsWith('counter='));

        if (orderPart) {
            order = orderPart.split('=')[1].split(',');
        }

        if (counterPart) {
            counter = Number(counterPart.split('=')[1]);
        }

        // Add current product id
        order.push(id);
        counter += 1;

        // Set cookies separately with proper syntax and path
        document.cookie = `orderId=${order.join(',')}; path=/; max-age=86400`;  // Expires in 1 day
        document.cookie = `counter=${counter}; path=/; max-age=86400`;

        document.getElementById("badge").innerText = counter;

        console.log("Updated Cookie:", document.cookie);
    };

    // Build DOM structure
    mainContainer.appendChild(imageSectionDiv);
    mainContainer.appendChild(productDetailsDiv);
    productDetailsDiv.appendChild(h1);
    productDetailsDiv.appendChild(h4);
    productDetailsDiv.appendChild(detailsDiv);
    detailsDiv.appendChild(h3Price);
    detailsDiv.appendChild(h3Desc);
    detailsDiv.appendChild(para);
    productDetailsDiv.appendChild(productPreviewDiv);
    productDetailsDiv.appendChild(buttonDiv);
}

// Fetch product details from API
let httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status == 200) {
        let contentDetails = JSON.parse(this.responseText);
        dynamicContentDetails(contentDetails);
    } else if (this.readyState === 4) {
        console.log('Failed to fetch product details.');
    }
};
httpRequest.open('GET', 'https://5d76bf96515d1a0014085cf9.mockapi.io/product/' + id, true);
httpRequest.send();
