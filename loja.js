// Array do carrinho
const cart = [];

// Função para atualizar os detalhes do carrinho
function updateCartDetails() {
    const cartItemsContainer = document.getElementById("cart-items");
    const badge = document.getElementById("cart-count");
    let totalPrice = 0;
    let totalQty = 0;


   
    cart.forEach((item, index) => {
        totalPrice += item.qty * item.price;
        totalQty += item.qty;

       
    });

    // Atualizar contadores de total e badge
    document.getElementById("total").textContent = totalPrice.toFixed(2);
    document.getElementById("quantidades").textContent = totalQty
    badge.textContent = totalQty;
    badge.classList.remove("d-none");
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