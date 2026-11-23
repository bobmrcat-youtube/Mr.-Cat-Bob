document.addEventListener("DOMContentLoaded", () => {
  // Função para remover acentos e facilitar a busca (ex: "fácil" == "facil")
  const normalizarTexto = (texto) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  };

  // 1. PÁGINA PRINCIPAL (VITRINE + BUSCA)
  const containerVitrine = document.getElementById("vitrine-produtos");
  const campoBusca = document.getElementById("campo-busca");
  const btnLimpar = document.getElementById("btn-limpar-busca");
  const contadorResultados = document.getElementById("contador-resultados");

  function renderizarVitrine(listaProdutos, termoBuscado = "") {
    containerVitrine.innerHTML = "";

    // Atualiza o texto contador abaixo da barra
    if (termoBuscado.trim() !== "") {
      contadorResultados.textContent =
        listaProdutos.length === 1
          ? "1 livro encontrado"
          : `${listaProdutos.length} livros encontrados`;
    } else {
      contadorResultados.textContent = "";
    }

    // Caso nenhum livro combine com a pesquisa
    if (listaProdutos.length === 0) {
      containerVitrine.innerHTML = `
        <div class="sem-resultados">
          <img src="img/MrCatBob4.png" alt="Mr. Cat Bob">
          <h3>Miau! Não achei nenhum livro com "${termoBuscado}"</h3>
          <p style="margin-bottom: 1.2rem;">Tente buscar por outra palavra ou veja toda a coleção abaixo:</p>
          <button id="btn-mostrar-todos" class="btn-ver" style="max-width: 240px; cursor: pointer;">
            Ver Todos os Livros
          </button>
        </div>
      `;

      document.getElementById("btn-mostrar-todos").addEventListener("click", () => {
        campoBusca.value = "";
        btnLimpar.classList.remove("visivel");
        renderizarVitrine(produtos);
        campoBusca.focus();
      });
      return;
    }

    // Desenha os cards filtrados com animação em cascata
    listaProdutos.forEach((produto, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.style.animationDelay = `${index * 0.08}s`;

      card.innerHTML = `
        <div class="card-img-wrapper">
          <span class="selo-card">PDF Digital</span>
          <img src="${produto.capa}" alt="${produto.titulo}">
        </div>
        <div class="card-info">
          <h2>${produto.titulo}</h2>
          <p class="preco">${produto.preco}</p>
          <a href="produto.html?id=${produto.id}" class="btn-ver">Espiar por Dentro 👀</a>
        </div>
      `;
      containerVitrine.appendChild(card);
    });
  }

  if (containerVitrine) {
    // Carrega todos os produtos inicialmente
    renderizarVitrine(produtos);

    // Escuta cada letra digitada na barra de pesquisa
    campoBusca.addEventListener("input", (e) => {
      const termoOriginal = e.target.value;
      const termoLimpo = normalizarTexto(termoOriginal.trim());

      // Mostra ou esconde o botão vermelho de limpar (X)
      if (termoOriginal.length > 0) {
        btnLimpar.classList.add("visivel");
      } else {
        btnLimpar.classList.remove("visivel");
      }

      // Filtra buscando no título e na descrição do dados.js
      const filtrados = produtos.filter((produto) => {
        const tituloNormalizado = normalizarTexto(produto.titulo);
        const descNormalizada = normalizarTexto(produto.descricao);
        return (
          tituloNormalizado.includes(termoLimpo) ||
          descNormalizada.includes(termoLimpo)
        );
      });

      renderizarVitrine(filtrados, termoOriginal);
    });

    // Ação do botão X para limpar a busca
    btnLimpar.addEventListener("click", () => {
      campoBusca.value = "";
      btnLimpar.classList.remove("visivel");
      renderizarVitrine(produtos);
      campoBusca.focus();
    });
  }

  // 2. PÁGINA DE DETALHES DO PRODUTO
  const containerDetalhes = document.getElementById("detalhes-produto");
  if (containerDetalhes) {
    const params = new URLSearchParams(window.location.search);
    const produtoId = params.get("id");
    const produto = produtos.find((p) => p.id === produtoId);

    if (produto) {
      document.title = `${produto.titulo} • Mr. Cat Bob`;
      containerDetalhes.innerHTML = `
        <div class="produto-topo">
          <img src="${produto.capa}" alt="${produto.titulo}" class="produto-capa">
          <div class="produto-texto">
            <span class="selo-destaque">✨ Ebook completo em formato PDF</span>
            <h1>${produto.titulo}</h1>
            <p class="preco">${produto.preco}</p>
            <p>${produto.descricao}</p>
            
            <ul class="beneficios-lista">
              <li>✅ Arquivo em alta resolução pronto para imprimir (A4)</li>
              <li>✅ Imprima quantas vezes quiser para colorir</li>
            </ul>

            <a href="${produto.linkHotmart}" target="_blank" rel="noopener noreferrer" class="btn-comprar">
              Quero Colorir Agora! 🖍️
            </a>
            <p class="garantia-texto">🔒 Compra 100% segura processada pela Hotmart</p>
          </div>
        </div>

        <hr class="divisor">
        
       <h3 class="video-titulo">🎬 Veja as páginas por dentro:</h3>
        <div class="video-container">
          <iframe 
            src="https://www.youtube.com/embed/${produto.youtubeId.split('?')[0].split('/').pop().replace('watch?v=', '')}" 
            title="Vídeo do produto" 
            referrerpolicy="strict-origin-when-cross-origin"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
          </iframe>
        </div>
      `;
    } else {
      containerDetalhes.innerHTML = `
        <div style="text-align:center; padding: 2rem;">
          <h2>Ops! Livro não encontrado 😿</h2>
          <p style="margin: 1rem 0;">Esse link parece estar incorreto ou o livro mudou de lugar.</p>
          <a href="index.html" class="btn-ver" style="max-width: 250px;">Voltar para a Vitrine</a>
        </div>
      `;
    }
  }
  // 3. SOM DE MIADO AO CLICAR NO MASCOTE (COLOQUE AQUI!)
  const avatarMascote = document.querySelector(".mascote-avatar");
  if (avatarMascote) {
    avatarMascote.addEventListener("click", () => {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const ganho = ctx.createGain();

      osc.type = "triangle";
      const agora = ctx.currentTime;

      osc.frequency.setValueAtTime(420, agora);
      osc.frequency.exponentialRampToValueAtTime(780, agora + 0.16);
      osc.frequency.exponentialRampToValueAtTime(360, agora + 0.45);

      ganho.gain.setValueAtTime(0.01, agora);
      ganho.gain.linearRampToValueAtTime(0.25, agora + 0.08);
      ganho.gain.exponentialRampToValueAtTime(0.001, agora + 0.46);

      osc.connect(ganho);
      ganho.connect(ctx.destination);

      osc.start(agora);
      osc.stop(agora + 0.48);

      // Efeito visual de "pulo" rápido no clique
      avatarMascote.style.transform = "scale(1.18) rotate(-8deg)";
      setTimeout(() => {
        avatarMascote.style.transform = "";
      }, 250);
    });
  }
});