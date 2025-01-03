// Array do carrinho
const cart = [];

// Atualiza os detalhes do carrinho
function updateCartDetails() {
    const cartItemsContainer = document.getElementById("cart-items");
    const badge = document.getElementById("cart-count");
    const dropdownTotal = document.getElementById("dropdown-total");
    let totalPrice = 0;
    let totalQty = 0;

    cartItemsContainer.innerHTML = ""; // Limpa o carrinho antes de renderizar

    if (cart.length > 0) {
        cart.forEach((item, index) => {
            totalPrice += item.qty * item.price;
            totalQty += item.qty;

            const itemElement = document.createElement("div");
            itemElement.className = "d-flex justify-content-between align-items-center mb-2";
            itemElement.innerHTML = `
                <div class="d-flex align-items-center">
                    <strong>${item.name}</strong> (x${item.qty})<br>
                    <small>${item.price.toFixed(2)} €</small>
                </div>
                <button class="btn btn-sm btn-danger remove-btn" data-index="${index}">Remover</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        dropdownTotal.textContent = totalPrice.toFixed(2);
        badge.textContent = totalQty;
        badge.classList.remove("d-none");
    } else {
        cartItemsContainer.innerHTML = `<p class="text-center text-muted">Carrinho vazio</p>`;
        dropdownTotal.textContent = "0.00";
        badge.classList.add("d-none");
    }

    // Adiciona os eventos de clique aos botões de remoção
    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.stopPropagation(); // Impede o fechamento da dropdown
            const index = parseInt(button.dataset.index, 10);
            removeItem(index);
        });
    });
}

// Adiciona um produto ao carrinho
function addProduct(productId) {
    const productElement = document.querySelector(`input#price${productId}`);
    const productName = productElement.closest(".col-sm-4").querySelector("h5").textContent.trim();
    const productPrice = parseFloat(productElement.value);

    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.qty += 1;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, qty: 1 });
    }

    updateCartDetails();
}

// Remove um item do carrinho
function removeItem(index) {
    cart.splice(index, 1);
    updateCartDetails();
}

// Processa o checkout
document.addEventListener('DOMContentLoaded', function () {
    const checkoutForm = document.getElementById('checkoutForm');
    const confirmPurchaseBtn = document.getElementById('confirm-purchase-btn');
    const checkoutButton = document.querySelector('[data-bs-target="#checkoutModal"]');

    // Ao clicar no botão de checkout, atualiza os detalhes do checkout
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            const checkoutDetails = document.getElementById('checkout-details');
            const checkoutTotal = document.getElementById('checkout-total');

            checkoutDetails.innerHTML = cart.length > 0
                ? cart.map(item => `
                    <div class="d-flex justify-content-between">
                        <span>${item.name} (x${item.qty})</span>
                        <span>${(item.qty * item.price).toFixed(2)} €</span>
                    </div>
                `).join("")
                : "<p class='text-center text-muted'>Carrinho vazio</p>";

            checkoutTotal.textContent = cart.reduce((sum, item) => sum + item.qty * item.price, 0).toFixed(2) + " €";
        });
    }

    // Ao confirmar a compra
    if (confirmPurchaseBtn) {
        confirmPurchaseBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Carrinho vazio. Adicione itens antes de finalizar.");
                return;
            }

            alert("Compra realizada com sucesso!");
            cart.length = 0;
            updateCartDetails();

            const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
            if (checkoutModal) checkoutModal.hide();
        });
    }

    // Submete o formulário de checkout
    checkoutForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Evita o comportamento padrão do formulário

        if (cart.length === 0) {
            alert("Carrinho vazio. Adicione itens antes de finalizar.");
            return;
        }

        const formData = new FormData(checkoutForm);
        const customerData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            paymentMethod: formData.get('paymentMethod'),
            termsAccepted: formData.has('terms'),
        };

        console.log("Customer Data:", customerData);

        // Simula uma confirmação da compra
        alert(`Obrigado pela compra, ${customerData.firstName}!`);

        // Limpa o carrinho e a interface do carrinho
        cart.length = 0; // Esvazia o array do carrinho
        updateCartDetails(); // Atualiza a interface

        // Reseta o formulário
        checkoutForm.reset();

        // Fecha o modal
        const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        if (checkoutModal) checkoutModal.hide();
    });
});
function changeColor(color) {
    const tshirtImage = document.querySelector('.col-sm-4 img'); // Seleciona a imagem da camiseta

    if (color === 'blue') {
        tshirtImage.src = 'Images/tshirt1.avif'; // Substitua com o caminho correto da imagem azul
    } else if (color === 'gray') {
        tshirtImage.src = 'Images/white.avif'; // Substitua com o caminho correto da imagem cinza
    }
}

