fetch("http://localhost:3000/product")
  .then((reponse) => reponse.json())
  .then((data) => {
    const dataProduct = data;

    showdata(dataProduct);
    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent form from submitting
      const searchTerm = document.getElementById("searchInput").value.toLowerCase();
      const filteredData = dataProduct.filter((item) =>
        item.name.toLowerCase().includes(searchTerm)
      ); showdata(filteredData);
    });
  });
var resultProduct = document.getElementById("resultProduct");
function showdata(data) {
  let htmlProduct = "";
  data.forEach((item) => {
    htmlProduct += ` <div class="col-xl-3 col-lg-4 col-sm-6">
                      <div class="card border-0" >
                        <img data-id="${item.id}" src="${item.image}" height="200" class="card-img-top product-image" alt="..." />
                        <div class="card-body p-0 d-flex justify-content-between align-items-center mt-2">
                            <div class="">
                             <input type="hidden" class="category" name="" value="${item.category}">
                                <h5 class="card-title fs-6">${item.name}</h5>
                                <div class="price">
                                    <span class="price-sale fs-6">${item.price.toLocaleString()} đ</span>
                                    <del class="price-old">${item.priceOld.toLocaleString()} đ</del>
                                </div>
                            </div>
                          <div  class=" addcart btn btn-success"><ion-icon name="add-outline" class="text-white"></ion-icon></div>
                        </div>
                      </div>
                    </div>`;
  });
  resultProduct.innerHTML = htmlProduct;
  //DETAIL
  const productImages = document.querySelectorAll(".product-image");
    productImages.forEach((image) => {
      image.addEventListener("click", () => {
        const productId = image.getAttribute("data-id");
        const product = data.find(item => item.id == productId);
        
        // Lưu thông tin sản phẩm vào localStorage
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        
        // Chuyển hướng đến trang detail.html
        window.location.href = "detail.html";
      });
    });
  ///LOGIC GIO HANG
  const addToCartButtons = document.querySelectorAll(".addcart");
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addToCart);
  });
}
///
function addToCart(event) {
  const button = event.target;
  const product = button.closest(".card");
  const productName = product.querySelector(".card-body h5").innerText;
  const productCategory = product.querySelector(
    ".card-body .category"
  ).innerText;
  const productPriceNew = product.querySelector(
    ".card-body .price-sale"
  ).innerText;
  const productPriceOld = product.querySelector(
    ".card-body .price-old"
  ).innerText;
  const productImg = product.querySelector(".card-img-top").src;
  // alert(`Added to cart: ${productImg}`);
  const quantityElement = document.getElementById("quantity");
  const currentQuantity = parseInt(quantityElement.innerText) || 0;
  quantityElement.innerText = currentQuantity + 1;
  // const quantity = 1; // Mặc định số lượng là 1 khi thêm vào giỏ hàng
  addCart(
    productName,
    productCategory,
    productPriceNew,
    productPriceOld,
    productImg,
    1
  );
}
let cart = [];
function addCart(
  productName,
  productCategory,
  productPriceNew,
  productPriceOld,
  productImg,
  quantity
) {
  // Tìm sản phẩm trong giỏ hàng
  const existingCartItem = cart.find(
    (item) => item.productName === productName
  );

  if (existingCartItem) {
    // Nếu sản phẩm đã tồn tại trong giỏ hàng, chỉ cập nhật số lượng
    existingCartItem.quantity += quantity;
  } else {
    // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới
    cart.push({
      productName,
      productCategory,
      productPriceNew,
      productPriceOld,
      productImg,
      quantity,
    });
  }
  // Cập nhật giao diện giỏ hàng
  renderCart();
  /// gọi hàm total
  cartTotal();
  // gọi hàm xóa
  detele();
  // change input

  attachQuantityListeners();
}
//  TOTAL
function cartTotal() {
  var cartItems = document.querySelectorAll("#viewCartProModal");
  var totalPriceModal = 0;
  cartItems.forEach((cartItem) => {
    var viewCartModalQuantity =
      cartItem.querySelector(".quatityViewCart").value;
      var viewCartModalPrice = cartItem.querySelector(
        ".modal-product-price-content"
      ).textContent; // Sử dụng textContent thay vì innerHTML
      viewCartModalPrice = viewCartModalPrice.replace(/[^\d]/g, '');
      var price = parseInt(viewCartModalPrice);
      var totalPrice =
      price * parseInt(viewCartModalQuantity);
      // toLoca1eString('de-DE')

      totalPriceModal += totalPrice;
  });
  var totalCartViewModalShow = document.querySelector(".totalCartViewShow");
    // console.log(totalCartViewModalShow);
    totalCartViewModalShow.innerText = totalPriceModal.toLocaleString('vi-VN');
}

// DELETE
function detele() {
  var cartItems = document.querySelectorAll("#viewCartProModal");

  cartItems.forEach((cartItem) => {
    var btnDelete = cartItem.querySelectorAll(".remove-pro");
    btnDelete[0].addEventListener("click", function (event) {
      const removeButton = event.target;
      const cartItem = removeButton.closest("#viewCartProModal");
      // console.log(cartItem);
      // Lấy tên sản phẩm của sản phẩm được xóa
      const productName = cartItem.querySelector(
        ".modal-product-name"
      ).textContent;
      // Xóa sản phẩm khỏi giỏ hàng
      const index = cart.findIndex((item) => item.productName === productName);
      if (index !== -1) {
        cart.splice(index, 1);
      }

      cartItem.remove();
      cartTotal();
      updateTotalQuantity();
    });
  });
}

// INPUT CHANGE
// function inputChange() {
//   var cartItems = document.querySelectorAll("#viewCartProModal");

//   cartItems.forEach((cartItem) => {
//     var inputValueViewCartModal = cartItem.querySelector(".quatityViewCart");

//     inputValueViewCartModal.addEventListener("change", () => {
//       cartTotal();
//     });
//   });
// }

//  ADD MINUS
// Function to handle increase in quantity
function increaseQuantity(inputElement) {
  let currentValue = parseInt(inputElement.value);
  inputElement.value = currentValue + 1;
  cartTotal();
}

// Function to handle decrease in quantity
function decreaseQuantity(inputElement, cartItem) {
  let currentValue = parseInt(inputElement.value);
  if (currentValue > 1) {
    inputElement.value = currentValue - 1;
    cartTotal();
  } else {
    // Nếu số lượng giảm xuống 0, xóa sản phẩm khỏi giỏ hàng
    const productName = cartItem.querySelector(
      ".modal-product-name"
    ).textContent;
    const index = cart.findIndex((item) => item.productName === productName);
    if (index !== -1) {
      cart.splice(index, 1);
    }
    cartItem.remove();
    cartTotal();
    updateTotalQuantity();
  }
}

// Function to attach event listeners for quantity buttons
function attachQuantityListeners() {
  var cartItems = document.querySelectorAll("#viewCartProModal");
  // var totalQuantity = 0;
  cartItems.forEach((cartItem) => {
    var addButton = cartItem.querySelector(".addValueQuatity");
    var minusButton = cartItem.querySelector(".minusValueQuatity");
    var inputElement = cartItem.querySelector(".quatityViewCart");

    addButton.addEventListener("click", () => {
      increaseQuantity(inputElement);
      updateTotalQuantity();
    });

    minusButton.addEventListener("click", () => {
      decreaseQuantity(inputElement, cartItem);
      updateTotalQuantity();
    });
    inputElement.addEventListener("change", () => {
      updateTotalQuantity(); // Update total quantity when quantity changes
    });
  });
}
/// tạo thành biến global
function updateTotalQuantity() {
  var cartItems = document.querySelectorAll("#viewCartProModal");
  totalQuantity = 0;
  cartItems.forEach((cartItem) => {
    var viewCartModalQuantity = parseInt(
      cartItem.querySelector(".quatityViewCart").value
    );
    totalQuantity += viewCartModalQuantity;
  });

  var quantityinText = document.getElementById("quantity");
  quantityinText.innerText = totalQuantity;
}

function renderCart() {
  // Cập nhật giao diện giỏ hàng dựa trên dữ liệu trong biến cart
  var addViewCartModal = document.getElementById("viewCartModal");
  addViewCartModal.innerHTML = ""; // Xóa bỏ nội dung cũ của giỏ hàng trước khi cập nhật lại

  cart.forEach((item) => {
    const cartItemHTML = `
      <li id="viewCartProModal"
      class="list-group-item mx-1 my-4 modal-cart-item border-bottom border-secondary border-2 mb-3 pb-3"
    >
      <div class="row">
        <div class="col-4 overflow-hidden rounded-2">
          <img src="${item.productImg}" class="img-cover" alt="" width="80" />
        </div>
        <div class="col-8">
          <div
            class="d-flex justify-content-between align-items-center"
          >
            <h3 class="modal-product-name fs-6">${item.productName}</h3>
            <span class="modal-product-name">${item.productCategory}</span>
            <code class="cursor remove-pro"
              ><ion-icon class="fs-5" name="close-outline"></ion-icon
            ></code>
          </div>
          <span class="modal-product-price">
            <span class="modal-product-price-content">${item.productPriceNew}</span>
          </span>
          <span class="modal-product-price-old">
            <del>${item.productPriceOld}</del>
          </span>
    
          <div class="modal-cart-qty text-center mt-1">
            <div
              class="modal-cart-qty-plus-minus border rounded-2 m-0 d-flex align-items-center justify-content-center border-1"
            >
              <button type="button" class="addValueQuatity">
                <ion-icon name="add-outline"></ion-icon>
              </button>
              <input
                type="text"
                name=""
                value="${item.quantity}"
                minlength="1"
                maxlength="20"
                class="quatityViewCart text-center border-0"
                id=""
              />
              <button type="button" class="minusValueQuatity">
                <ion-icon name="remove-outline"></ion-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
      `;
    addViewCartModal.insertAdjacentHTML("beforeend", cartItemHTML);
  });
}