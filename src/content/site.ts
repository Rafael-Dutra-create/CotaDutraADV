/**
 * Fonte única de texto, contato e links da landing page.
 *
 * Regra do projeto: nenhum componente tem copy hardcoded — tudo vem daqui.
 *
 * ⚠️ PENDÊNCIAS (marcadas com TODO-ADV no arquivo):
 *   1. Cargos, bios e áreas dos advogados — e o texto de apresentação da equipe,
 *      que ficou como rascunho.
 *   2. Telefone fixo e a inscrição da sociedade na OAB.
 *   3. Confirmar quais áreas do direito a banca realmente atende.
 *   4. Links de redes sociais (Instagram, LinkedIn) — hoje a lista está vazia.
 */

export interface NavLink {
  label: string
  href: string
}

/** Foto do escritório, compartilhada pelo hero e pelo carrossel da seção Local. */
export interface OfficePhoto {
  /** Caminho público da imagem (arquivo em `public/`). */
  src: string
  /** Nome da foto: rótulo acessível dos indicadores e `alt` no carrossel. */
  label: string
}

export interface Service {
  title: string
  description: string
  /** Itens de apoio exibidos como lista na seção. */
  bullets: string[]
}

export interface TeamSlide {
  /** Foto da ficha: o grupo na abertura, o retrato do advogado nas demais. */
  photo: { src: string; alt: string }
  /** Cargo como aparece na referência: "Sócio fundador". Ausente na abertura. */
  role?: string
  name: string
  bio: string
  /** Áreas/qualificações exibidas como etiquetas. Ausente na abertura. */
  tags?: string[]
}

export interface SocialLink {
  label: string
  href: string
}

/* ------------------------------------------------------------------ */
/* Contato                                                             */
/* ------------------------------------------------------------------ */

// Mesmo número atende WhatsApp e telefone (celular).
const WHATSAPP_DIGITS = '5521984700961'
const PHONE_DIGITS = '5521984700961'

// Sede. `STREET` é a linha que o Google Maps reconhece melhor; o complemento
// (sala e nome do prédio) entra só na exibição e no endereço estruturado.
const STREET = 'Rua Campo Grande, 1014'
const COMPLEMENT = 'Sala 526, Passeio Empresarial'
const ADDRESS = `${STREET} — ${COMPLEMENT}`
const DISTRICT = 'Campo Grande'
const CITY = 'Rio de Janeiro'
const STATE = 'RJ'
const ZIP = '23080-000'

/** O endereço numa linha só: rodapé, seção Local e seção Contato. */
const FULL_ADDRESS = `${ADDRESS}, ${DISTRICT}, ${CITY}/${STATE}, CEP ${ZIP}`

/**
 * Identificador do cadastro do escritório no Google (Knowledge Graph MID).
 *
 * Não confundir com o `place_id` (aquele é `ChIJ...`). Este vem da própria
 * busca e é o que faz o link abrir a ficha da empresa em vez de geocodificar um
 * texto de endereço — que é onde o Google erra, porque não resolve "sala 526".
 */
const GOOGLE_KGMID = '/g/11p210x9dq'

/**
 * Texto da busca que abre a ficha.
 * Quem manda é o `kgmid`; este texto é o rótulo que aparece no campo de busca.
 */
const GOOGLE_QUERY = 'Cota e Dutra Advogados Associados'

export const contact = {
  /** Texto exibido no site. */
  phoneDisplay: '+55 (21) 98470-0961',
  /** Link tel: (apenas dígitos, com DDI). */
  phoneHref: `tel:+${PHONE_DIGITS}`,
  whatsappDisplay: '+55 (21) 98470-0961',
  /** Link wa.me sem texto pré-preenchido. */
  whatsappHref: `https://wa.me/${WHATSAPP_DIGITS}`,
  /** Número puro usado para montar deep links com mensagem. */
  whatsappNumber: WHATSAPP_DIGITS,
  email: 'dutraecotaadv@gmail.com',
  address: ADDRESS,
  district: DISTRICT,
  city: CITY,
  state: STATE,
  zip: ZIP,
  /** Endereço numa linha só: rodapé, seção Local e seção Contato. */
  fullAddress: FULL_ADDRESS,
  hours: 'Segunda a sexta, das 9h às 18h', // TODO-ADV
  /** Inscrição da sociedade, exibida no rodapé. */
  oab: 'OAB/UF 00.000', // TODO-ADV
  /**
   * Abre a ficha do escritório no Google.
   *
   * Não é busca por endereço: o Google não resolve "sala 526" a partir de texto,
   * e o cadastro é quem tem o pin certo — com a sala. O `kgmid` vai cru (as
   * barras de `/g/...` não podem ser codificadas) porque é assim que o Google
   * reconhece a entidade. Funciona também para quem recusa o mapa embutido.
   */
  googleHref: `https://www.google.com/search?hl=pt-BR&q=${encodeURIComponent(GOOGLE_QUERY)}&kgmid=${GOOGLE_KGMID}`,
  /**
   * Src do iframe do mapa, sem chave de API. A seção Local só o renderiza depois
   * do consentimento, porque o Google grava cookies próprios.
   *
   * A busca é pelo nome da empresa, não pelo endereço, pela mesma razão do
   * `googleHref`: assim o pin é o do cadastro.
   *
   * TODO-ADV: se o pin abaixo não cair no cadastro, trocar pela URL com `pb=`
   * (Google Maps → Compartilhar → Incorporar um mapa), que carrega a coordenada
   * exata. É o único caso em que o `pb=` faz falta.
   */
  mapEmbedHref: `https://www.google.com/maps?q=${encodeURIComponent(GOOGLE_QUERY)}&hl=pt-BR&z=17&output=embed`,
} as const

/* ------------------------------------------------------------------ */
/* Site                                                                */
/* ------------------------------------------------------------------ */

export const site = {
  /** Marca como aparece no logo. */
  name: 'Cota & Dutra',
  /** Razão de divulgação completa. */
  fullName: 'Cota & Dutra Advogados Associados',
  shortName: 'CotaDutraADV',
  tagline: 'Assessoria jurídica com linguagem clara e acompanhamento próximo.',
  description:
    'Assessoria jurídica em Direito Civil, Família, Trabalho e do Consumidor. Análise inicial do seu caso, linguagem clara e acompanhamento em cada etapa.',
  contact,
} as const

/* ------------------------------------------------------------------ */
/* Navegação                                                           */
/* ------------------------------------------------------------------ */

export const nav: NavLink[] = [
  { label: 'Apresentação', href: '#apresentacao' },
  { label: 'Áreas de atuação', href: '#areas' },
  { label: 'Equipe', href: '#equipe' },
  { label: 'Local', href: '#local' },
  { label: 'Contato', href: '#contato' },
]

export const header = {
  ctaLabel: 'Falar com um advogado',
  menuLabel: 'Abrir menu de navegação',
  /** Rótulo acessível do link do logo. */
  logoLabel: 'Ir para a apresentação',
} as const

/* ------------------------------------------------------------------ */
/* Fotos do escritório                                                 */
/* ------------------------------------------------------------------ */

/**
 * Fonte única das fotos do escritório.
 *
 * As mesmas quatro imagens alimentam o slideshow de fundo do hero e o
 * carrossel da seção Local — mudar o conjunto aqui muda os dois.
 */
export const officePhotos: OfficePhoto[] = [
  { src: '/escritorio/escritorio_1.jpeg', label: 'Sala de atendimento' },
  { src: '/escritorio/escritorio_3.jpeg', label: 'Sala de reunião' },
  { src: '/escritorio/escritorio_4.jpeg', label: 'Ambiente do escritório' },
  // Foto com resolução menor (720×836): fica por último na sequência.
  { src: '/escritorio/escritorio_2.jpeg', label: 'Espaço de espera' },
]

/* ------------------------------------------------------------------ */
/* Apresentação (hero)                                                 */
/* ------------------------------------------------------------------ */

export const hero = {
  eyebrow: 'Advocacia com atendimento próximo',
  title: 'Questões jurídicas resolvidas com estratégia, e explicadas sem juridiquês',
  subtitle:
    'Atuação consultiva e contenciosa em Direito Civil, Família, Trabalho e do Consumidor. Do primeiro contato ao encerramento, você sabe em que ponto o seu caso está.',
  primaryCta: 'Falar com um advogado',
  secondaryCta: 'Áreas de atuação',
  /** Fotos exibidas em sequência no fundo do hero. */
  slides: officePhotos,
  scrollLabel: 'Rolar para as áreas de atuação',
} as const

/* ------------------------------------------------------------------ */
/* Áreas de atuação — TODO-ADV: confirmar áreas realmente atendidas.   */
/* ------------------------------------------------------------------ */

export const services = {
  eyebrow: 'Áreas de atuação',
  title: 'Como podemos ajudar',
  subtitle:
    'Atuação preventiva e contenciosa, sempre buscando o caminho mais curto entre o problema e a solução.',
  ctaLabel: 'Acessar área',
  /** `{area}` é substituído pelo título da área ao montar a mensagem do WhatsApp. */
  ctaMessageTemplate: 'Olá! Vim pelo site e preciso de ajuda com {area}.',
  items: [
    {
      title: 'Direito Civil e Contratos',
      description:
        'Cobranças, indenizações, responsabilidade civil, contratos e questões imobiliárias.',
      bullets: [
        'Revisão e elaboração de contratos',
        'Ações de indenização',
        'Questões de posse e propriedade',
      ],
    },
    {
      title: 'Família e Sucessões',
      description:
        'Divórcio, guarda, pensão, inventário e partilha, com foco em acordo sempre que possível.',
      bullets: ['Divórcio consensual e litigioso', 'Guarda e alimentos', 'Inventário e partilha'],
    },
    {
      title: 'Direito do Trabalho',
      description:
        'Orientação para empregados e empregadores, da rescisão à audiência trabalhista.',
      bullets: [
        'Verbas rescisórias',
        'Horas extras e verbas não pagas',
        'Consultoria para empregadores',
      ],
    },
    {
      title: 'Direito do Consumidor',
      description: 'Problemas com produtos, serviços, planos de saúde e cobranças indevidas.',
      bullets: ['Negativação indevida', 'Planos de saúde', 'Vícios e defeitos de produtos'],
    },
  ] as Service[],
} as const

/* ------------------------------------------------------------------ */
/* Equipe — TODO-ADV: revisar cargos, bios e áreas de cada advogado.    */
/* ------------------------------------------------------------------ */

export const team = {
  eyebrow: 'Quem atende você',
  title: 'Gente que você conhece pelo nome',
  subtitle:
    'Você trata diretamente com o advogado responsável pelo seu caso, sem intermediários.',
  /**
   * Fichas da seção, na ordem: primeiro a banca, depois cada advogado.
   * Os cargos saem do nome da sociedade — Cota e Dutra são os sócios.
   */
  slides: [
    {
      photo: { src: '/advogados/advogados.jpeg', alt: 'Os três advogados do escritório Cota & Dutra' },
      name: site.fullName,
      // TODO-ADV: apresentação escrita por mim, sem copy aprovada; revisar.
      bio: 'Três advogados, um time pequeno de propósito: quem faz a análise inicial é quem acompanha o caso até o fim, sem repassar o atendimento. Atuamos em Direito Civil, Família, Trabalho e do Consumidor, com linguagem clara desde a primeira conversa — inclusive para explicar o que não vale a pena levar adiante.',
      tags: ['Direito Civil', 'Família', 'Trabalho', 'Consumidor'],
    },
    {
      photo: { src: '/advogados/edwilson.jpeg', alt: 'Ed Wilson Dutra, sócio fundador' },
      role: 'Sócio fundador',
      name: 'Ed Wilson Dutra',
      // TODO-ADV: bio escrita por mim, sem copy aprovada; revisar.
      bio: 'Responde pela estratégia dos casos e faz a análise inicial com o cliente. Acompanha pessoalmente audiências e negociações, das causas de menor valor às que correm na Justiça Federal. Atua em contratos, cobranças e responsabilidade civil.',
      tags: ['Direito Civil', 'Contratos', 'Estratégia processual'],
    },
    {
      photo: { src: '/advogados/daniele.jpeg', alt: 'Daniele Cota, sócia' },
      role: 'Sócia',
      name: 'Daniele Cota',
      // TODO-ADV: bio escrita por mim, sem copy aprovada; revisar.
      bio: 'Conduz os casos de família e sucessões, com foco em acordo e na proteção do patrimônio familiar. Cuida de divórcios, guarda, pensão, inventários e partilhas, e explica cada etapa antes de qualquer decisão do cliente.',
      tags: ['Família', 'Sucessões', 'Inventário'],
    },
    {
      photo: { src: '/advogados/luana.jpeg', alt: 'Luana Costa, advogada' },
      role: 'Advogada',
      name: 'Luana Costa',
      // TODO-ADV: bio escrita por mim, sem copy aprovada; revisar.
      bio: 'Atua no contencioso trabalhista e nas relações de consumo, do cálculo das verbas até a audiência. Também cuida das negociações com empresas, tentando o acordo antes de o processo virar anos de espera.',
      tags: ['Trabalhista', 'Consumidor', 'Cálculos'],
    },
  ] as TeamSlide[],
} as const

/* ------------------------------------------------------------------ */
/* Local (sede)                                                        */
/* ------------------------------------------------------------------ */

export const locationSection = {
  eyebrow: 'Onde estamos',
  title: 'Onde nos encontrar',
  subtitle:
    'Atendimento presencial com hora marcada e reuniões por videochamada quando for mais prático para você.',
  /**
   * Botão que abre a ficha do escritório no Google. Fora do gate de consentimento.
   * Não diz "Maps" de propósito: o destino é a busca, não o Maps.
   */
  mapLabel: 'Abrir no Google',
  /** Fotos do escritório no carrossel ao lado do endereço. */
  photos: officePhotos,
  carouselLabel: 'Fotos do escritório',
  prevLabel: 'Foto anterior',
  nextLabel: 'Próxima foto',
  /** Rótulos do bloco de endereço. */
  labels: {
    address: 'Endereço',
    hours: 'Horário de atendimento',
  },
  /** Aviso do gate: nada de terceiros carrega sem uma escolha explícita. */
  mapConsentNotice:
    'O mapa do Google só carrega com a sua autorização, porque pode gravar cookies próprios.',
  mapConsentAction: 'Carregar mapa',
  /** Título acessível do iframe. */
  mapTitle: 'Mapa com a localização do escritório',
} as const

/* ------------------------------------------------------------------ */
/* Contato / formulário                                                */
/* ------------------------------------------------------------------ */

export const contactSection = {
  eyebrow: 'Contato',
  title: 'Conte o que aconteceu',
  subtitle:
    'Preencha os campos e você será direcionado ao nosso WhatsApp com a mensagem já pronta. Também atendemos por telefone e e-mail.',
  /** Rótulos e mensagens do formulário (LeadStore valida os mesmos campos). */
  form: {
    nameLabel: 'Nome completo',
    namePlaceholder: 'Como podemos te chamar',
    emailLabel: 'E-mail',
    emailPlaceholder: 'voce@email.com',
    phoneLabel: 'Telefone / WhatsApp',
    phonePlaceholder: '(00) 00000-0000',
    subjectLabel: 'Assunto',
    subjectPlaceholder: 'Sobre o que você precisa de orientação?',
    messageLabel: 'Mensagem',
    messagePlaceholder: 'Descreva brevemente sua situação (opcional)',
    submitLabel: 'Enviar pelo WhatsApp',
    submittingLabel: 'Enviando...',
    successMessage:
      'Tudo certo! Abrimos o WhatsApp com sua mensagem. Se a janela não abrir, use o botão ao lado.',
    failureMessage: 'Não conseguimos abrir o WhatsApp. Tente novamente ou use o link direto.',
    privacyNote:
      'Ao enviar, você concorda em ser contatado sobre o seu caso. Não compartilhamos seus dados.',
  },
  /** Bloco de contato direto ao lado do formulário. */
  channels: {
    whatsappLabel: 'WhatsApp',
    phoneLabel: 'Telefone',
    emailLabel: 'E-mail',
    addressLabel: 'Endereço',
    hoursLabel: 'Horário de atendimento',
  },
} as const

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export const footer = {
  about:
    'Escritório de advocacia dedicado a resolver o problema do cliente com clareza, prazo combinado e acompanhamento próximo.',
  areasTitle: 'Áreas de atuação',
  navigationTitle: 'Navegação',
  contactTitle: 'Contato',
  socialTitle: 'Redes',
  /** TODO-ADV: preencher quando houver perfis. Lista vazia não renderiza a coluna. */
  social: [] as SocialLink[],
  /** TODO-ADV: revisar texto conforme provimento da OAB sobre publicidade. */
  disclaimer:
    'Este site tem caráter meramente informativo, em conformidade com o Código de Ética e Disciplina da OAB e o Provimento nº 205/2021. Nenhuma informação aqui constitui consulta jurídica ou promessa de resultado.',
  copyright: `© ${new Date().getFullYear()} ${site.fullName}. Todos os direitos reservados.`,
} as const
