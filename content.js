let contentTitle;

function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";
  boxDiv.className = "product-card";
  boxDiv.setAttribute("data-price", ob.price);

  let boxLink = document.createElement("a");
  boxLink.href = "/contentDetails.html?" + ob.id;

  let imgTag = document.createElement("img");
  imgTag.src = ob.preview;

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3 = document.createElement("h3");
  h3.appendChild(document.createTextNode(ob.name));

  let h4 = document.createElement("h4");
  h4.appendChild(document.createTextNode(ob.brand));

  let h2 = document.createElement("h2");
  h2.appendChild(document.createTextNode("Rs " + ob.price));

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  return boxDiv;
}

let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");

let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function () {
  if (this.readyState === 4) {
    if (this.status == 200) {
      contentTitle = JSON.parse(this.responseText);

      for (let i = 0; i < contentTitle.length; i++) {
        if (contentTitle[i].isAccessory && containerAccessories) {
          containerAccessories.appendChild(dynamicClothingSection(contentTitle[i]));
        } else if (!contentTitle[i].isAccessory && containerClothing) {
          containerClothing.appendChild(dynamicClothingSection(contentTitle[i]));
        }
      }

      // Add sorting functionality if sortBy element exists
      setupSorting("sortBy", [containerClothing, containerAccessories]);

      // Add search functionality if input element exists
      const searchInput = document.getElementById("input");
      if (searchInput) {
        searchInput.addEventListener("input", function () {
          const query = this.value.trim().toLowerCase();

          if (containerClothing) containerClothing.innerHTML = "";
          if (containerAccessories) containerAccessories.innerHTML = "";

          let filteredProducts = contentTitle.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query)
          );

          filteredProducts.forEach(product => {
            if (product.isAccessory && containerAccessories) {
              containerAccessories.appendChild(dynamicClothingSection(product));
            } else if (!product.isAccessory && containerClothing) {
              containerClothing.appendChild(dynamicClothingSection(product));
            }
          });
        });
      }

    } else {
      console.log("Call failed!");
    }
  }
};

httpRequest.open(
  "GET",
  "https://5d76bf96515d1a0014085cf9.mockapi.io/product",
  true
);
httpRequest.send();

function setupSorting(selectId, containers) {
  const selectElement = document.getElementById(selectId);
  if (!selectElement) return;

  selectElement.addEventListener("change", function () {
    containers.forEach(container => {
      if (!container) return;

      let products = Array.from(container.getElementsByClassName("product-card"));
      let sortedProducts = [];

      if (this.value === "lowToHigh") {
        sortedProducts = products.sort((a, b) =>
          parseInt(a.dataset.price) - parseInt(b.dataset.price)
        );
      } else if (this.value === "highToLow") {
        sortedProducts = products.sort((a, b) =>
          parseInt(b.dataset.price) - parseInt(a.dataset.price)
        );
      } else {
        sortedProducts = products;
      }

      container.innerHTML = "";
      sortedProducts.forEach(product => container.appendChild(product));
    });
  });
}
