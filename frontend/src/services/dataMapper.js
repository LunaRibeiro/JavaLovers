// Mapeador de dados entre frontend e backend
export const mapDonorToBackend = (frontendDonor) => {
  return {
    name: frontendDonor.nomeCompleto,
    cpfCnpj: frontendDonor.cpf,
    contact: frontendDonor.telefoneCelular || frontendDonor.email,
  };
};

export const mapDonorFromBackend = (backendDonor) => {
  return {
    id: backendDonor.donorId,
    nomeCompleto: backendDonor.name,
    cpf: backendDonor.cpfCnpj,
    telefoneCelular: backendDonor.contact,
    email: backendDonor.contact, // Assumindo que contact pode ser email
    endereco: '', // Campos não disponíveis no backend atual
    bairro: '',
    numero: '',
    complemento: '',
    pontoReferencia: '',
  };
};

export const mapItemToBackend = (frontendItem) => {
  return {
    name: frontendItem.nome,
    description: frontendItem.descricao || '',
    quantity: frontendItem.quantidade || 0,
    categoryId: frontendItem.categoriaId || null,
  };
};

export const mapItemFromBackend = (backendItem) => {
  return {
    id: backendItem.itemId,
    nome: backendItem.name,
    descricao: backendItem.description,
    quantidade: backendItem.quantity,
    categoria: backendItem.category?.name || '',
    categoriaId: backendItem.category?.categoryId || null,
  };
};

export const mapUserToBackend = (frontendUser) => {
  return {
    name: frontendUser.nomeCompleto,
    email: frontendUser.email,
    password: frontendUser.senha,
    profileId: frontendUser.perfilId || 1, // Default profile
  };
};

export const mapUserFromBackend = (backendUser) => {
  return {
    id: backendUser.userId,
    nomeCompleto: backendUser.name,
    email: backendUser.email,
    perfil: backendUser.profile?.name || '',
    perfilId: backendUser.profile?.profileId || null,
  };
};

// Mapeador para Beneficiários (quando o controller for criado)
export const mapBeneficiaryToBackend = (frontendBeneficiary) => {
  return {
    fullName: frontendBeneficiary.nomeCompleto,
    cpf: frontendBeneficiary.cpfCrnm || frontendBeneficiary.nif,
    phone: frontendBeneficiary.telefoneCelular,
    socioeconomicData: JSON.stringify({
      endereco: frontendBeneficiary.endereco,
      bairro: frontendBeneficiary.bairro,
      numero: frontendBeneficiary.numero,
      complemento: frontendBeneficiary.complemento,
      pontoReferencia: frontendBeneficiary.pontoReferencia,
    }),
    beneficiaryStatus: 'PENDING', // Status padrão
  };
};

export const mapBeneficiaryFromBackend = (backendBeneficiary) => {
  let socioeconomicData = {};
  try {
    socioeconomicData = JSON.parse(backendBeneficiary.socioeconomicData || '{}');
  } catch (e) {
    console.warn('Erro ao parsear socioeconomicData:', e);
  }

  return {
    id: backendBeneficiary.beneficiaryId,
    nomeCompleto: backendBeneficiary.fullName,
    cpfCrnm: backendBeneficiary.cpf,
    nif: '', // Campo não disponível no backend atual
    telefoneCelular: backendBeneficiary.phone,
    email: '', // Campo não disponível no backend atual
    endereco: socioeconomicData.endereco || '',
    bairro: socioeconomicData.bairro || '',
    numero: socioeconomicData.numero || '',
    complemento: socioeconomicData.complemento || '',
    pontoReferencia: socioeconomicData.pontoReferencia || '',
    status: backendBeneficiary.beneficiaryStatus,
  };
};

// Mapeador para Voluntários (usando User com profile específico)
export const mapVolunteerToBackend = (frontendVolunteer) => {
  return {
    name: frontendVolunteer.nomeCompleto,
    email: frontendVolunteer.email,
    password: 'volunteer123', // Senha padrão para voluntários
    profileId: 2, // Assumindo que profile 2 é para voluntários
  };
};

export const mapVolunteerFromBackend = (backendUser) => {
  return {
    id: backendUser.userId,
    nomeCompleto: backendUser.name,
    email: backendUser.email,
    telefoneCelular: '', // Campo não disponível no backend atual
    cpf: '', // Campo não disponível no backend atual
    endereco: '',
    bairro: '',
    numero: '',
    complemento: '',
    pontoReferencia: '',
  };
};
