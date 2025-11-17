let amigos = []; // Array para armazenar os nomes dos amigos

// Esta função atualiza o <p id="lista-amigos"> lendo o array 'amigos'.
function atualizarListaAmigosPrincipal() {
    let lista = document.getElementById('lista-amigos');
    if (amigos.length === 0) {
        lista.innerHTML = ''; // Limpa se estiver vazio
    } else {
        lista.textContent = amigos.join(', '); // Une o array com vírgulas
    }
}

// --- FUNÇÃO DE MENSAGEM  ---
/**
 * Exibe uma mensagem de notificação (toast) na tela.
 * @param {string} message - A mensagem para exibir.
 * @param {string} type - 'error' (vermelho) ou 'success' (verde).
 */
function showMessage(message, type = 'error') {
    const messageBox = document.getElementById('message-box');
    if (!messageBox) return; // Não faz nada se a caixa não existir

    const toast = document.createElement('div');
    toast.textContent = message;
    toast.className = `message-toast ${type}`; // 'message-toast error' ou 'message-toast success'

    messageBox.appendChild(toast);

    // Remove a notificação após a animação de saída (3.3s)
    setTimeout(() => {
        toast.remove();
    }, 3300);
}

function adicionar() {
    let amigo = document.getElementById('nome-amigo');
    let nomeAmigo = amigo.value.trim(); // .trim() remove espaços em branco

    if (nomeAmigo === '') { // Verifica se está vazio
        showMessage('Por favor, insira um nome válido.', 'error');
        return;
    }

    // Checagem de duplicata simplificada
    if (amigos.includes(nomeAmigo)) {
        showMessage('Nome duplicado: ' + nomeAmigo, 'error');
        return;
    }

    amigos.push(nomeAmigo);
    atualizarListaAmigosPrincipal();
    amigo.value = '';
    showMessage('Amigo adicionado!', 'success'); // Mensagem de sucesso
}

function sortear() {
    // Verificamos se há nomes suficientes ANTES de embaralhar
    if (amigos.length < 4) {
        // Usa a nova função de mensagem
        showMessage('Adicione pelo menos 4 amigos para realizar o sorteio.', 'error');
        return;
    }

    // Criamos uma CÓPIA embaralhada para o sorteio
    let amigosEmbaralhados = embaralhar([...amigos]);

    let sorteio = document.getElementById('lista-sorteio'); // Elemento HTML
    sorteio.innerHTML = ''; // Limpa o sorteio anterior

    for (let i = 0; i < amigosEmbaralhados.length; i++) {
        let amigoA = amigosEmbaralhados[i];
        // O último amigo pega o primeiro (forma mais segura com módulo)
        let amigoB = amigosEmbaralhados[(i + 1) % amigosEmbaralhados.length];

        sorteio.innerHTML += `${amigoA} --> ${amigoB} <br>`;
    }
}

function embaralhar(arr) { // Função para embaralhar (Fisher-Yates)
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function reiniciar() {
    amigos = []; // Limpa o array de amigos
    atualizarListaAmigosPrincipal();
    document.getElementById('lista-sorteio').innerHTML = ''; // Limpa a lista de sorteio
}


// ===============================================
//            === CÓDIGO DO MODAL ===
// ===============================================

// 1. Array temporário para o modal
let amigosTemporarios = [];

// 2. Referências aos elementos do Modal
const modalOverlay = document.getElementById('modalOverlay');
const listaNomesModal = document.getElementById('listaNomesModal');
const btnCancelar = document.getElementById('btnCancelar');
const btnSalvar = document.getElementById('btnSalvar');

/**
 * Abre o modal e o prepara.
 */
function editarLista() {
    // Copia a lista principal 'amigos' para a 'amigosTemporarios'
    amigosTemporarios = [...amigos];

    // Acrescenta ao modal os nomes
    renderizarNomesNoModal();

    // Mostra o modal
    modalOverlay.classList.remove('modal-escondido');
    modalOverlay.classList.add('modal-visivel');
}

/**
 * Função interna para fechar o modal (usada pelo Cancelar e Salvar)
 */
function fecharModal() {
    modalOverlay.classList.remove('modal-visivel');
    modalOverlay.classList.add('modal-escondido');
}

/**
 * inclui na <div>listaNomesModal os nomes do array 'amigosTemporarios'
 */
function renderizarNomesNoModal() {
    // Limpa a lista anterior
    listaNomesModal.innerHTML = '';

    if (amigosTemporarios.length === 0) {
        listaNomesModal.innerHTML = '<p>Nenhum nome para editar.</p>';
        return;
    }

    // Cria os spans clicáveis para cada nome
    amigosTemporarios.forEach(nome => {
        const span = document.createElement('span');
        span.textContent = nome;
        span.className = 'nome-item'; // Classe para o CSS
        span.dataset.nome = nome; // Guarda o nome aqui
        listaNomesModal.appendChild(span);
    });
}

// 3. Event Listeners para os botões e cliques. (Verifica se os elementos existem antes de adicionar listeners)

if (btnCancelar) {
    btnCancelar.addEventListener('click', fecharModal);
}

if (btnSalvar) {
    btnSalvar.addEventListener('click', function () {
        // 1. O array principal (amigos) recebe as mudanças do array temporário
        amigos = [...amigosTemporarios];

        // 2. ATUALIZA A PÁGINA PRINCIPAL
        atualizarListaAmigosPrincipal();

        // 3. Fecha o modal
        fecharModal();
    });
}

if (listaNomesModal) {
    listaNomesModal.addEventListener('click', function (e) {
        // Verifica se o que clicamos foi um 'nome-item'
        if (e.target.classList.contains('nome-item')) {
            const nomeParaRemover = e.target.dataset.nome;

            // Remove o nome APENAS do array TEMPORÁRIO
            amigosTemporarios = amigosTemporarios.filter(nome => nome !== nomeParaRemover);

            // Re-desenha a lista DENTRO do modal
            renderizarNomesNoModal();
        }
    });
}