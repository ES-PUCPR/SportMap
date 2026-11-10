const TEXTOS = {
    'Partidas': 'Matches', 'Mapa': 'Map', 'Quadras': 'Courts', 'Times': 'Teams', 'Usuários': 'Users',
    'Meu perfil': 'My profile', 'Sair': 'Sign out', 'Entrar': 'Sign in', 'Criar conta': 'Create account',
    'Encontre uma partida': 'Find a match', 'Criar partida': 'Create match', 'Alterar partida': 'Edit match',
    'Cadastrar quadra': 'Add court', 'Alterar quadra': 'Edit court', 'Criar time': 'Create team', 'Alterar time': 'Edit team',
    'Perfil': 'Profile', 'Quadras próximas': 'Nearby courts', 'Voltar': 'Back', 'Salvar': 'Save',
    'E-mail': 'Email', 'Senha': 'Password', 'Nome': 'Name', 'Telefone': 'Phone', 'Posição': 'Position',
    'Sua posição': 'Your position', 'Nova senha (opcional)': 'New password (optional)', 'Sou dono de quadra': 'I own a court',
    'Sem preferência': 'No preference', 'Ainda não tem conta?': 'No account yet?', 'Cadastre-se': 'Sign up',
    'Já tem conta?': 'Already have an account?', 'Local': 'Location', 'Data': 'Date', 'A partir de': 'From',
    'Modalidade': 'Type', 'Todas': 'All', 'Filtrar': 'Filter', 'Quadra': 'Court', 'Número de jogadores': 'Number of players',
    'Início': 'Start', 'Fim': 'End', 'Descrição': 'Description', 'Endereço': 'Address', 'Piso': 'Surface',
    'Sigla': 'Abbreviation', 'Cidade': 'City', 'Time': 'Team', 'Rua, número e cidade': 'Street, number and city',
    'Digite um endereço': 'Type an address', 'Usar minha localização': 'Use my location',
    'Goleiro': 'Goalkeeper', 'Zagueiro': 'Defender', 'Lateral': 'Full-back', 'Volante': 'Defensive midfielder',
    'Meia': 'Midfielder', 'Atacante': 'Forward', 'Campo': 'Field',
    'Alterar': 'Edit', 'Excluir': 'Delete', 'Aprovar': 'Approve', 'Reprovar': 'Reject', 'Ativo': 'Active',
    'Ver partida': 'View match', 'Ver partidas': 'View matches', 'Vagas:': 'Spots:', 'Data:': 'Date:',
    'Organizador:': 'Organizer:', 'Situação:': 'Status:', 'Situação': 'Status', 'Distância:': 'Distance:',
    'Jogador': 'Player', 'Jogadores': 'Players', 'Cancelar partida': 'Cancel match', 'Entrar na partida': 'Join match',
    'Trocar posição': 'Change position', 'Sair da partida': 'Leave match', 'Novo time': 'New team', 'Nova quadra': 'New court',
    'aberta': 'open', 'completa': 'full', 'cancelada': 'cancelled', 'pendente': 'pending', 'aprovada': 'approved', 'reprovada': 'rejected',
    'Nenhuma partida encontrada.': 'No matches found.', 'Nenhuma quadra encontrada.': 'No courts found.',
    'Não foi possível obter sua localização. Digite um endereço.': 'Could not get your location. Type an address.',
    'Credenciais inválidas.': 'Invalid credentials.', 'Preencha nome, e-mail e senha.': 'Fill in name, email and password.',
    'O CPF precisa ter 11 números.': 'The CPF must have 11 digits.', 'Conta criada com sucesso.': 'Account created successfully.',
    'Já existe uma conta com este e-mail ou CPF.': 'An account with this email or CPF already exists.', 'Não há registros.': 'No records found.',
    'Registro inserido com sucesso.': 'Record added successfully.', 'Falha ao inserir o registro.': 'Could not add the record.',
    'Registro alterado com sucesso.': 'Record updated successfully.', 'Não foi possível alterar o registro.': 'Could not update the record.',
    'Registro excluído.': 'Record deleted.', 'Registro não excluído.': 'Record not deleted.',
    'Registro não excluído. A quadra pode ter partidas ligadas a ela.': 'Record not deleted. The court may have linked matches.',
    'ID não informado.': 'ID not provided.', 'É necessário informar um ID para exclusão.': 'An ID is required to delete.',
    'Preencha o nome do time.': 'Fill in the team name.', 'Preencha nome e endereço.': 'Fill in name and address.',
    'Apenas o administrador pode validar quadras.': 'Only the administrator can validate courts.', 'Preencha todos os campos.': 'Fill in all fields.',
    'Esta quadra já tem uma partida nesse horário.': 'This court already has a match at this time.',
    'Esta partida foi cancelada.': 'This match was cancelled.', 'Não há vagas disponíveis nesta partida.': 'There are no spots available in this match.',
    'Você já está nesta partida.': 'You are already in this match.',
    'Modo escuro': 'Dark mode', 'Modo claro': 'Light mode', 'Sim': 'Yes', 'Não': 'No',
    'Tipo de partida': 'Match type', 'Tipo:': 'Type:', 'Pública': 'Public', 'Privada visível': 'Private (visible)',
    'Privada por convite': 'Private (invite only)', 'Privada visível (entrada com aprovação)': 'Private visible (entry needs approval)',
    'Privada somente por convite': 'Private, invite only', 'Convidar jogador por e-mail': 'Invite player by email', 'Convidar': 'Invite',
    'Aceitar convite': 'Accept invite', 'Recusar convite': 'Decline invite', 'Pedir para entrar': 'Request to join', 'Cancelar pedido': 'Cancel request',
    'Recusar': 'Reject', 'Você foi convidado': 'You were invited', 'confirmado': 'confirmed', 'convidado': 'invited', 'recusado': 'rejected',
    'Pedido enviado ao organizador.': 'Request sent to the organizer.', 'Seu pedido já foi enviado ao organizador.': 'Your request was already sent to the organizer.',
    'Seu pedido foi recusado pelo organizador.': 'Your request was rejected by the organizer.', 'Esta partida é somente para convidados.': 'This match is invite only.',
    'Convite enviado.': 'Invite sent.', 'Usuário não encontrado.': 'User not found.', 'Este usuário já está nesta partida.': 'This user is already in this match.',
    'Apenas o organizador pode aprovar pedidos.': 'Only the organizer can approve requests.', 'Apenas o organizador pode convidar jogadores.': 'Only the organizer can invite players.',
    'Apenas o organizador pode alterar a partida.': 'Only the organizer can edit the match.', 'Apenas o organizador pode cancelar a partida.': 'Only the organizer can cancel the match.'
};

const idioma = localStorage.getItem('idioma') || 'pt';

function traduzir(texto) {
    const limpo = texto.trim();
    if (idioma == 'en' && TEXTOS[limpo]) {
        return texto.replace(limpo, TEXTOS[limpo]);
    }
    return texto;
}

function traduzirElemento(elemento) {
    if (elemento.nodeType == Node.TEXT_NODE) {
        elemento.nodeValue = traduzir(elemento.nodeValue);
    } else if (elemento.nodeType == Node.ELEMENT_NODE) {
        if (elemento.placeholder) {
            elemento.placeholder = traduzir(elemento.placeholder);
        }
        elemento.childNodes.forEach(traduzirElemento);
    }
}

if (idioma == 'en') {
    // Traduz também o conteúdo inserido depois, como as listas
    new MutationObserver((mudancas) => {
        for (const mudanca of mudancas) {
            mudanca.addedNodes.forEach(traduzirElemento);
        }
    }).observe(document.documentElement, { childList: true, subtree: true });

    const alertOriginal = window.alert.bind(window);
    window.alert = (mensagem) => alertOriginal(traduzir(mensagem));
}

document.addEventListener('DOMContentLoaded', () => {
    const seletor = document.getElementById('idioma');
    seletor.value = idioma;
    seletor.addEventListener('change', () => {
        localStorage.setItem('idioma', seletor.value);
        window.location.reload();
    });
});
