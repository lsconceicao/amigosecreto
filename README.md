## 🎁 Amigo Secreto Digital

---

## 🎯 Intenção do Projeto

O principal objetivo deste projeto foi criar uma ferramenta **moderna e funcional** para a organização de sorteios de Amigo Secreto, resolvendo o desafio tradicional de comunicar os resultados de forma discreta e segura.

O projeto foi desenvolvido para demonstrar proficiência em:

* **Desenvolvimento Front-end (Vanilla JS):** Lógica robusta e manipulação de estado sem a necessidade de frameworks.
* **Integração com API de Terceiros:** Utilização do **EmailJS** para disparar e-mails diretamente do navegador, eliminando a necessidade de um back-end próprio.
* **Usabilidade (UX):** Implementação de um fluxo de edição de lista intuitivo e notificações não obstrutivas (**Toasts**).

---

## 💻 Tecnologias Utilizadas

| Categoria | Tecnologia | Uso no Projeto |
| :--- | :--- | :--- |
| **Front-end** | HTML5, CSS3 | Estrutura e Estilização da interface |
| **Lógica** | JavaScript (Vanilla JS) | Lógica de sorteio (Algoritmo **Fisher-Yates**), CRUD de amigos e controle de estado. |
| **Integração** | EmailJS API | Serviço de template e envio de e-mails para comunicação **segura** dos resultados do sorteio. |
| **Design** | Flexbox, Grid, Media Queries | Layout **responsivo** e adaptativo para dispositivos móveis. |

---

## 💡 Arquitetura

O diferencial deste projeto está na **manipulação inteligente dos dados** e na separação de responsabilidades:

### 1. Manipulação de Estado (JavaScript)

* O **array principal (`amigos`)** armazena objetos complexos: `[{nome: 'Ana', email: 'ana@mail.com'}, ...]`. Essa estrutura é fundamental, pois liga o nome do participante ao seu endereço de destino.
* Para a edição da lista, é utilizado um **array temporário (`amigosTemporarios`)**. O botão **Cancelar** descarta as alterações do array temporário, e o botão **Salvar** só então atualiza o array principal, garantindo a integridade dos dados.

### 2. Lógica do Sorteio (`sortear()`)

* A função utiliza o **Algoritmo de Fisher-Yates** para embaralhar o array de forma eficiente e justa.
* Em vez de exibir o resultado na tela (`innerHTML`), a função itera sobre o array embaralhado e, para cada participante, monta um objeto `templateParams` com o nome de quem tirou (`de_nome`), quem foi tirado (`para_nome`) e o e-mail de destino (`to_email`).
* Em seguida, dispara o serviço `emailjs.send()`, mantendo o **sigilo total** do sorteio.

### 3. Usabilidade (Modal e Notificações)

* O **Modal** foi implementado com transições suaves (CSS) e lógica de estado (JavaScript) para fornecer uma experiência de edição de lista **sem a necessidade de redirecionamento de página**.
* As funções de erro e sucesso utilizam um componente **Toast** (`showMessage()`) para fornecer feedback ao usuário de forma **não obstrutiva** (sem usar `alert()`, que trava a aplicação).

---

## ⚙️ Como Utilizar

Para executar este projeto localmente e enviar os e-mails, você precisará de uma conta no **EmailJS**.

### 1. Clonar o Repositório

```bash
git clone [SEU_LINK_DO_REPOSITORIO]
cd amigo-secreto-digital
```

2. Configuração do EmailJS (Chaves)
Crie uma conta gratuita no EmailJS.com.

Obtenha sua Service ID, Template ID e Public Key.

Abra o arquivo js/app.js e preencha as constantes no topo:

```bash
JavaScript

const EMAILJS_SERVICE_ID = 'SUA_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'SEU_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'SUA_PUBLIC_KEY';
```

3. Configuração do Template de E-mail
No seu template do EmailJS, certifique-se de que o campo To Email Address esteja configurado para usar a variável dinâmica que o JavaScript envia:

```bash
HTML

{{to_email}}
```

4. Execução
Abra o arquivo index.html diretamente no seu navegador ou use uma extensão de servidor local (como o Live Server do VS Code).

📝 Contribuição
Contribuições, sugestões e relatórios de bugs são bem-vindos! Se você tiver alguma ideia para melhorar o projeto, sinta-se à vontade para abrir uma issue ou enviar um Pull Request.
