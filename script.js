const menu = document.getElementById("menu")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const closeModalButton = document.getElementById("close-modal-btn")
const checkoutButton = document.getElementById("checkout-btn")
const cartButton = document.getElementById("cart-btn")
const cartCount = document.getElementById("cart-count")

let cart = []

const isOpen = checkRestaurantOpen()


cartButton.addEventListener("click", function () {
    cartModal.style.display = "flex"
    updateCartModal()
})

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})
closeModalButton.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.dataset.name
        const price = parseFloat(parentButton.dataset.price)

        addToCart(name, price)
    }

})

function addToCart(name, price) {
    const hasItem = cart.find(item => item.name === name)

    if (hasItem) {
        hasItem.quantity += 1;
        updateCartModal()
        return;
    }

    cart.push({
        name,
        price,
        quantity: 1,
    })

    updateCartModal()
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;
    let quantityTotal = 0

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between mb-2" >
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2"> R$${item.price.toFixed(2)}</p>
                </div>
                    <button class="remove-button" data-name="${item.name}">
                        Remover
                    </button>
            </div>
        `

        total += item.price * item.quantity;
        quantityTotal += item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCount.innerHTML = quantityTotal;
}


cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-button")) {
        const name = event.target.dataset.name

        removeItemCart(name)
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal()
    }
}

addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

checkoutButton.addEventListener("click", function () {

    if (!isOpen) {
        Toastify({
            text: "Restaurante fechado.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if (cart.length === 0){
        Toastify({
            text: "Adicione um produto no carrinho.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    };

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    Toastify({
            text: "Pedido enviado!",
            duration: 9000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#22C55E",
            },
        }).showToast();

    addressInput.value = ""

    const cartItems = cart.map((item) => (
        `\n${item.name}\nQuantidade: ${item.quantity}\nPreço: R$${item.price}\n`
    )).join("");


    const message = encodeURIComponent(cartItems)
    const phone = ""

    const orderNumber = Math.floor(Math.random() * 1000)

    window.open(`https://wa.me/${phone}?text=Número do pedido: ${orderNumber}${message}Endereço: ${addressInput.value}`)

    cart = [];
    updateCartModal();
})

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 16 && hora < 22;
}

const spanItem = document.getElementById("date-span")

if (isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}
else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}

