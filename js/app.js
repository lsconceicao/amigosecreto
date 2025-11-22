const EMAILJS_SERVICE_ID = 'Amigo_Secreto_Sorteio';
const EMAILJS_TEMPLATE_ID = 'template_ylal45a';
const EMAILJS_PUBLIC_KEY = 'NlSOzXJa6qd4bp5cL';

// EMAILJS INICIALIZAÇÃO
(function(){
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }
})();

// ===============================================
//            === CÓDIGO PRINCIPAL ===
// ===============================================
let amigos = []; // MUDANÇA: Array para armazenar os nomes dos amigos emails (objetos {nome, email})

// Esta função atualiza o <p id="lista-amigos"> lendo o array 'amigos'.
function atualizarListaAmigosPrincipal() {
    let lista = document.getElementById('lista-amigos');
    if (amigos.length === 0) {
        lista.innerHTML = ''; // Limpa se estiver vazio
    } else {
        // MUDANÇA: Mapeia o array de objetos para pegar apenas os nomes
        lista.textContent = amigos.map(a => a.nome).join(', '); // Une o array com vírgulas
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
    let nomeEntrada = document.getElementById('nome-amigo');
    let emailEntrada = document.getElementById('email-amigo');
    // .trim() remove espaços em branco
    let nome = nomeEntrada.value.trim();
    let email = emailEntrada.value.trim(); 

    if (nome === '') { // Verifica se está vazio
        showMessage('Por favor, insira um nome válido.', 'error');
        return;
    }

    if (email === '' || !email.includes('@')) { // Verifica se e-mail é valido conferindo o arroba
        showMessage('Por favor, insira um e-mail válido.', 'error');
        return;
    }

    // MUNDAÇA: Checagem de duplicata (agora checa nome E email)
    if (amigos.find(a => a.nome === nome)) {
        showMessage('Nome duplicado: ' + nome, 'error');
        return;
    }
    if (amigos.find(a => a.email === email)) {
        showMessage('E-mail duplicado: ' + email, 'error');
        return;
    }

    amigos.push({nome: nome, email: email});

    atualizarListaAmigosPrincipal();
    nomeEntrada.value = '';
    emailEntrada.value = '';
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

    let sorteioEmail = document.getElementById('lista-sorteio'); // Elemento HTML
    sorteioEmail.innerHTML = ''; // Limpa o sorteio anterior

    let emailsEnviados = 0;

    showMessage('Sorteando e enviando e-mails...', 'success');
    sorteioEmail.innerHTML = 'Enviando e-mails. Por favor, aguarde...';

    // MUDANÇA: Itera sobre o array para enviar um e-mail por pessoa
    for (let i = 0; i < amigosEmbaralhados.length; i++) {
        let de = amigosEmbaralhados[i];
        // O último amigo pega o primeiro (forma mais segura com módulo)
        let para = amigosEmbaralhados[(i + 1) % amigosEmbaralhados.length];

        // Prepara os dados para o template do EmailJS
        const templateParams = {
            de_nome: de.nome,
            para_nome: para.nome,
            to_email: de.email // O e-mail para onde o EmailJS vai enviar
        };

        // Chama a API do EmailJS
        // O EmailJS usa o campo 'reply_to' para saber para quem enviar.
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('E-mail enviado para', de.nome, response.status, response.text);
            emailsEnviados++;

            if (emailsEnviados === amigos.length) {
                sorteioEmail.innerHTML = 'Sorteio concluído! Todos os e-mails foram enviados.';
                showMessage('Sorteio concluído com sucesso!', 'success');
            }
        }, function(error) {
            console.error('Falha ao enviar e-mail para', de.nome, error);
            showMessage(`Erro ao enviar e-mail para ${de.nome}. Verifique as chaves do EmailJS.`, 'error');
        });
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
    amigosTemporarios.forEach(amigo => {
        const span = document.createElement('span');
        span.textContent = amigo.nome; //MUDANÇA: Exibe o nome
        span.className = 'nome-item'; // Classe para o CSS
        span.dataset.nome = amigo.nome; // Guarda o nome aqui
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

            // MUDANÇA: Filtra o array de OBJETOS pelo nome
            amigosTemporarios = amigosTemporarios.filter(a => a.nome !== nomeParaRemover);

            // Re-desenha a lista DENTRO do modal
            renderizarNomesNoModal();
        }
    });
}