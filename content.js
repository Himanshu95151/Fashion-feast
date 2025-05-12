let contentTitle;

function dynamicClothingSection(ob) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";
  boxDiv.className = "product-card";           // <-- added class for sorting
  boxDiv.setAttribute("data-price", ob.price); // <-- added price attribute

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
  h2.appendChild(document.createTextNode("rs  " + ob.price));

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(h4);
  detailsDiv.appendChild(h2);

  return boxDiv;
}

let mainContainer = document.getElementById("mainContainer");
let containerClothing = document.getElementById("containerClothing");
let containerAccessories = document.getElementById("containerAccessories");

let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function() {
  if (this.readyState === 4) {
    if (this.status == 200) {
      contentTitle = JSON.parse(this.responseText);

      for (let i = 0; i < contentTitle.length; i++) {
        if (contentTitle[i].isAccessory) {
          containerAccessories.appendChild(dynamicClothingSection(contentTitle[i]));
        } else if(contentTitle[i].isAccessory == false) {
          containerClothing.appendChild(dynamicClothingSection(contentTitle[i]));
        }
      }

      // Add event listener for the sort dropdown
      setupSorting("sortBy", [containerClothing, containerAccessories]);

      // Add event listener for the search box
      const searchInput = document.getElementById("input");

      searchInput.addEventListener("input", function () {
        const query = this.value.trim().toLowerCase();

        containerClothing.innerHTML = "";  // clear clothing
        containerAccessories.innerHTML = "";  // clear accessories

        let filteredProducts = contentTitle.filter(product => 
          product.name.toLowerCase().includes(query) || 
          product.brand.toLowerCase().includes(query)
        );

        filteredProducts.forEach(product => {
          if (product.isAccessory) {
            containerAccessories.appendChild(dynamicClothingSection(product));
          } else {
            containerClothing.appendChild(dynamicClothingSection(product));
          }
        });
      });

    } else {
      console.log("call failed!");
    }
  }
};

httpRequest.open(
  "GET",
  "https://5d76bf96515d1a0014085cf9.mockapi.io/product",
  true
);
httpRequest.send();

// Sorting Function
function setupSorting(selectId, containers) {
  const selectElement = document.getElementById(selectId);
  if (!selectElement) return;

  selectElement.addEventListener("change", function() {
    containers.forEach(container => {
      let products = Array.from(container.getElementsByClassName("product-card"));
      let sortedProducts = [];

      if (this.value === "lowToHigh") {
        sortedProducts = products.sort((a, b) => {
          return parseInt(a.dataset.price) - parseInt(b.dataset.price);
        });
      } else if (this.value === "highToLow") {
        sortedProducts = products.sort((a, b) => {
          return parseInt(b.dataset.price) - parseInt(a.dataset.price);
        });
      } else {
        sortedProducts = products;
      }

      container.innerHTML = ""; // Clear container
      sortedProducts.forEach(product => container.appendChild(product)); // Append sorted items
    });
  });
}
