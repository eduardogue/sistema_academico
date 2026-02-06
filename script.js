// ===== DADOS DOS USUÁRIOS =====
// Esta é nossa "base de dados" simples (sem banco de dados complexo)
const usuarios = [
    {
        usuario: "Eduardo Guerreiro",
        senha: "123",
        nome: "Eduardo Guerreiro",
        curso: "Medicina",
        matricula: "PUCC2024MED001",
        foto: "usuarios/perfilE.jpg",
        pdf: "matriculas/medicina.pdf",
        pdfNome: "medicina.pdf",
        semestre: "2024.1",
        cargaHoraria: "4.200 horas",
        validade: "31/12/2024",
        dataDocumento: "10/04/2024"
    },
    {
        usuario: "Ruan Andre",
        senha: "123",
        nome: "Ruan André",
        curso: "Radiologia",
        matricula: "PUCC2024RAD002",
        foto: "usuarios/perfilR.jpg",
        pdf: "matriculas/radiologia.pdf",
        pdfNome: "radiologia.pdf",
        semestre: "2024.1",
        cargaHoraria: "2.800 horas",
        validade: "31/12/2024",
        dataDocumento: "10/04/2024"
    }
];

// ===== VARIÁVEIS GLOBAIS =====
let usuarioLogado = null;

// ===== QUANDO A PÁGINA CARREGA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sistema PUCC carregado!');
    
    // Verificar se há usuário lembrado
    const usuarioSalvo = localStorage.getItem('usuarioPUCC');
    if (usuarioSalvo) {
        const usuario = usuarios.find(u => u.usuario === usuarioSalvo);
        if (usuario) {
            fazerLoginAutomatico(usuario);
        }
    }
    
    // Configurar botão de login
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', fazerLogin);
    }
    
    // Permitir login com Enter
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                fazerLogin();
            }
        });
    }
    
    // Configurar botão de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', fazerLogout);
    }
    
    // Configurar botões da carteirinha
    const refreshBtn = document.getElementById('refreshCard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            mostrarMensagem('Carteirinha atualizada com sucesso!', 'success');
        });
    }
    
    const shareBtn = document.getElementById('shareCard');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            mostrarMensagem('Função de compartilhamento em desenvolvimento.', 'info');
        });
    }
    
    // Configurar botões do PDF
    const viewPdfBtn = document.getElementById('viewPdfBtn');
    if (viewPdfBtn) {
        viewPdfBtn.addEventListener('click', visualizarPDF);
    }
    
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener('click', baixarPDF);
    }
    
    // Configurar modal
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.addEventListener('click', fecharModal);
    }
    
    // Fechar modal clicando fora
    const modal = document.getElementById('pdfModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                fecharModal();
            }
        });
    }
});

// ===== FUNÇÃO DE LOGIN =====
function fazerLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validar campos
    if (!username || !password) {
        mostrarMensagem('Por favor, preencha todos os campos.', 'error');
        return;
    }
    
    // Procurar usuário
    const usuario = usuarios.find(u => 
        u.usuario === username && u.senha === password
    );
    
    if (!usuario) {
        mostrarMensagem('Usuário ou senha incorretos.', 'error');
        return;
    }
    
    // Salvar no localStorage se marcou "Lembrar-me"
    if (remember) {
        localStorage.setItem('usuarioPUCC', usuario.usuario);
    } else {
        localStorage.removeItem('usuarioPUCC');
    }
    
    // Fazer login
    usuarioLogado = usuario;
    mostrarSistema(usuario);
    mostrarMensagem(`Bem-vindo(a), ${usuario.nome}!`, 'success');
}

// ===== LOGIN AUTOMÁTICO =====
function fazerLoginAutomatico(usuario) {
    usuarioLogado = usuario;
    mostrarSistema(usuario);
    
    // Preencher campos de login
    document.getElementById('username').value = usuario.usuario;
    document.getElementById('remember').checked = true;
}

// ===== MOSTRAR SISTEMA APÓS LOGIN =====
function mostrarSistema(usuario) {
    // Esconder tela de login
    document.getElementById('loginScreen').style.display = 'none';
    
    // Mostrar sistema principal
    document.getElementById('mainSystem').style.display = 'block';
    
    // Atualizar informações do usuário
    atualizarInformacoesUsuario(usuario);
}

// ===== ATUALIZAR INFORMAÇÕES NA TELA =====
function atualizarInformacoesUsuario(usuario) {
    // Atualizar nome no cabeçalho
    document.getElementById('studentName').textContent = usuario.nome;
    
    // Atualizar carteirinha
    document.getElementById('infoName').textContent = usuario.nome;
    document.getElementById('infoCourse').textContent = usuario.curso;
    document.getElementById('infoMatricula').textContent = usuario.matricula;
    document.getElementById('infoValidade').textContent = usuario.validade;
    
    // Atualizar foto (se o arquivo existir)
    const fotoElement = document.getElementById('studentPhoto');
    fotoElement.src = usuario.foto;
    fotoElement.alt = `Foto de ${usuario.nome}`;
    
    // Se a foto não carregar, usar uma padrão
    fotoElement.onerror = function() {
        this.src = 'https://via.placeholder.com/120x150/003366/FFFFFF?text=' + usuario.nome.charAt(0);
    };
    
    // Atualizar informações do PDF
    document.getElementById('currentSemester').textContent = usuario.semestre;
    document.getElementById('workload').textContent = usuario.cargaHoraria;
    document.getElementById('docDate').textContent = usuario.dataDocumento;
    document.getElementById('pdfFileName').textContent = usuario.pdfNome;
    
    // Atualizar link do PDF no modal
    document.getElementById('pdfLink').href = usuario.pdf;
    document.getElementById('modalPdfTitle').textContent = `Comprovante de Matrícula - ${usuario.curso}`;
    
    // Atualizar QR Code (você pode trocar por QR codes diferentes por usuário)
    // Por enquanto usa o mesmo QR Code para todos
}

// ===== FUNÇÃO DE LOGOUT =====
function fazerLogout() {
    if (confirm('Deseja realmente sair do sistema?')) {
        usuarioLogado = null;
        localStorage.removeItem('usuarioPUCC');
        
        // Mostrar tela de login
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('mainSystem').style.display = 'none';
        
        // Limpar campos de login
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('remember').checked = false;
        
        mostrarMensagem('Logout realizado com sucesso.', 'info');
    }
}

// ===== VISUALIZAR PDF =====
function visualizarPDF() {
    if (!usuarioLogado) {
        mostrarMensagem('Faça login para acessar o comprovante.', 'error');
        return;
    }
    
    const modal = document.getElementById('pdfModal');
    modal.style.display = 'flex';
    
    // Adicionar efeito de abertura
    setTimeout(() => {
        modal.classList.add('open');
    }, 10);
}

// ===== BAIXAR PDF =====
function baixarPDF() {
    if (!usuarioLogado) {
        mostrarMensagem('Faça login para baixar o comprovante.', 'error');
        return;
    }
    
    // Criar link de download
    const link = document.createElement('a');
    link.href = usuarioLogado.pdf;
    link.download = `Comprovante_Matricula_${usuarioLogado.nome.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    mostrarMensagem('Download iniciado! Verifique sua pasta de downloads.', 'success');
}

// ===== FECHAR MODAL =====
function fecharModal() {
    const modal = document.getElementById('pdfModal');
    modal.style.display = 'none';
}

// ===== MOSTRAR MENSAGENS =====
function mostrarMensagem(texto, tipo) {
    // Remover mensagem anterior se existir
    const mensagemAntiga = document.querySelector('.mensagem-flutuante');
    if (mensagemAntiga) {
        mensagemAntiga.remove();
    }
    
    // Criar nova mensagem
    const mensagem = document.createElement('div');
    mensagem.className = `mensagem-flutuante ${tipo}`;
    mensagem.textContent = texto;
    
    // Estilos da mensagem
    mensagem.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    // Cores por tipo
    if (tipo === 'success') {
        mensagem.style.background = 'linear-gradient(to right, #28a745, #20c997)';
    } else if (tipo === 'error') {
        mensagem.style.background = 'linear-gradient(to right, #dc3545, #e83e8c)';
    } else if (tipo === 'info') {
        mensagem.style.background = 'linear-gradient(to right, #003366, #00509e)';
    }
    
    // Adicionar ao corpo
    document.body.appendChild(mensagem);
    
    // Remover após 4 segundos
    setTimeout(() => {
        mensagem.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (mensagem.parentNode) {
                mensagem.remove();
            }
        }, 300);
    }, 4000);
    
    // Adicionar animações CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===== FUNÇÃO PARA ADICIONAR NOVOS USUÁRIOS (FUTURO) =====
// Esta função pode ser usada para adicionar até 10 usuários
function adicionarNovoUsuario(novoUsuario) {
    if (usuarios.length < 10) {
        usuarios.push(novoUsuario);
        console.log('Novo usuário adicionado:', novoUsuario.nome);
        return true;
    } else {
        console.log('Limite de 10 usuários atingido.');
        return false;
    }
}

// Exemplo de como adicionar um novo usuário (para uso futuro):
/*
const novoAluno = {
    usuario: "NovoAluno",
    senha: "456",
    nome: "Novo Aluno",
    curso: "Direito",
    matricula: "PUCC2024DIR003",
    foto: "usuarios/perfilN.jpg",
    pdf: "matriculas/direito.pdf",
    pdfNome: "direito.pdf",
    semestre: "2024.1",
    cargaHoraria: "3.600 horas",
    validade: "31/12/2024",
    dataDocumento: "10/04/2024"
};

adicionarNovoUsuario(novoAluno);
*/