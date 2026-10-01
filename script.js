const API_URL = "http://localhost:3000/produtos";

// Selecionando elementos da interface
const form = document.getElementById("produtoForm");
const btnListar = document.getElementById("btnListarBebidas");
const containerBebidas = document.getElementById("listaBebidas");

// Função para listar apenas as bebidas da API (GET com filtro)
async function listarBebidas() {
    try {
        const response = await fetch(`${API_URL}?categoria=Bebidas`);
        const bebidas = await response.json();

        containerBebidas.innerHTML = ""; // Limpa a listagem anterior

        if (bebidas.length === 0) {
            containerBebidas.innerHTML = "<p>Nenhuma bebida encontrada.</p>";
            return;
        }

        bebidas.forEach(produto => {
            const card = document.createElement("div");
            card.className = "produto-card";
            card.innerHTML = `
                <div class="produto-info">
                    <strong>${produto.nome}</strong>
                    <div>Preço: R$ ${Number(produto.preco).toFixed(2)} | Estoque: ${produto.estoque} un.</div>
                </div>
                <button class="btn-excluir" onclick="excluirProduto('${produto.id}')">Excluir</button>
            `;
            containerBebidas.appendChild(card);
        });

    } catch (error) {
        console.error("Erro ao buscar bebidas:", error);
        containerBebidas.innerHTML = "<p style='color: red;'>Erro ao carregar as bebidas. Verifique se o JSON Server está rodando.</p>";
    }
}

// 1. Cadastrar novo produto via POST
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita recarregar a página

    const novoProduto = {
        nome: document.getElementById("nome").value,
        preco: parseFloat(document.getElementById("preco").value),
        categoria: document.getElementById("categoria").value,
        estoque: parseInt(document.getElementById("estoque").value)
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoProduto)
        });

        if (response.ok) {
            alert("Produto cadastrado com sucesso!");
            form.reset();
            
            // Se o produto inserido for da categoria Bebidas, atualiza a tela automaticamente
            if (novoProduto.categoria === "Bebidas") {
                listarBebidas();
            }
        } else {
            alert("Erro ao cadastrar o produto.");
        }
    } catch (error) {
        console.error("Erro na requisição POST:", error);
        alert("Não foi possível conectar à API.");
    }
});

// 2. Excluir produto via DELETE
async function excluirProduto(id) {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            alert("Produto excluído com sucesso!");
            listarBebidas(); // Atualiza a tela após apagar
        } else {
            alert("Erro ao excluir o produto.");
        }
    } catch (error) {
        console.error("Erro na requisição DELETE:", error);
        alert("Não foi possível conectar à API para excluir.");
    }
}

// Vincula o evento de clique do botão Listar Bebidas
btnListar.addEventListener("click", listarBebidas);