// Array do carrinho
const cart = [];

function updateCartDetails() {
    const cartItemsContainer = document.getElementById("cart-items");
    const badge = document.getElementById("cart-count");
    const dropdownTotal = document.getElementById("dropdown-total");
    let totalPrice = 0;
    let totalQty = 0;

    // Limpa o conteúdo atual do carrinho
    cartItemsContainer.innerHTML = "";

    // Atualiza os itens do carrinho
    if (cart.length > 0) {
        cart.forEach((item, index) => {
            totalPrice += item.qty * item.price;
            totalQty += item.qty;

            // Adiciona item ao dropdown
            const itemElement = document.createElement("div");
            itemElement.className = "d-flex justify-content-between align-items-center mb-2";
            itemElement.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small>${item.qty} x ${item.price.toFixed(2)} €</small>
                    </div>
                </div>
                <button class="btn btn-sm btn-danger remove-btn" data-index="${index}">&times;</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    } else {
        cartItemsContainer.innerHTML = `<p class="text-center text-muted">Carrinho vazio</p>`;
    }

    // Atualiza o total e os contadores
    document.getElementById("total").textContent = totalPrice.toFixed(2);
    document.getElementById("quantidades").textContent = totalQty;
    dropdownTotal.textContent = totalPrice.toFixed(2);

    if (totalQty > 0) {
        badge.textContent = totalQty;
        badge.classList.remove("d-none");
    } else {
        badge.textContent = "0";
        badge.classList.add("d-none");
    }

    // Adiciona evento aos botões de remoção
    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.stopPropagation(); // Evita que o dropdown feche
            const index = parseInt(button.dataset.index, 10);
            removeItem(index);
        });
    });
}


// Função para adicionar produtos ao carrinho
function addProduct(productId) {
    const product = {
        id: productId,
        name: `Produto ${productId}`, // Nome do produto (você pode melhorar)
        price: parseFloat(document.getElementById(`price${productId}`).value),
        qty: 1,
        image: `Images/tshirt${productId}.avif` // Exemplo de imagem
    };
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.qty += 1;
    } else {
        cart.push(product);
    }

    updateCartDetails();
}

// Função para remover itens do carrinho
function removeItem(index) {
    cart.splice(index, 1);
    updateCartDetails();
}

// Função de inicialização
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar contadores
    updateCartDetails();

    // Adicionar eventos aos botões
    const buttons = document.querySelectorAll("[onclick^='addProduct']");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            button.blur(); // Remove o foco do botão após o clique
        });
    });
});
function clean() {
    // Limpa o carrinho
    //limpar
    cart.length = 0;

    // Reinicia os contadores na interface
    document.getElementById("quantidades").textContent = "0";
    document.getElementById("total").textContent = "0.00";

    // Oculta o badge do carrinho
    const badge = document.getElementById("cart-count");
    badge.textContent = "0";
    badge.classList.add("d-none");
}
function valid() {
    if (cart.length === 0) {
        alert("O carrinho está vazio. Adicione produtos antes de enviar o pedido!");
        return false; // Impede o envio do formulário
    }

    // Opcional: Exibe os detalhes do pedido no console
    console.log("Pedido enviado:", cart);

    alert("Pedido enviado com sucesso!");
    return true; // Permite o envio do formulário
}