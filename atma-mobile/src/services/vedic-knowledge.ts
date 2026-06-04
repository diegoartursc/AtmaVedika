/**
 * Atma Vedika — Base de Conhecimento Jyotish
 *
 * Fonte primária: Brihat Parashara Hora Shastra (Parashara)
 * Referências secundárias: Jataka Parijata, Phaladeepika, Saravali
 *
 * Usado para montar o system prompt do Veda (Claude Sonnet 4.6).
 * Cada entrada é pesquisada — não cosmética.
 */

import type { PlanetName, SignName, NakshatraName } from '@/types/chart';

// ─── Arquétipos Planetários ──────────────────────────────────

export const PLANET_ARCHETYPES: Record<
  PlanetName,
  {
    pt: string;
    keyword: string;
    nature: string;
    governs: string;
    shadow: string;
    exaltation: SignName;
    debilitation: SignName;
    ownSigns: SignName[];
  }
> = {
  Sun: {
    pt: 'Sol',
    keyword: 'Atma — a alma',
    nature: 'masculino, rajásico, Agni (fogo)',
    governs: 'ego, autoridade, pai, governo, saúde vital, propósito kármico, realeza',
    shadow: 'arrogância, inflexibilidade, necessidade de validação constante',
    exaltation: 'Aries',
    debilitation: 'Libra',
    ownSigns: ['Leo'],
  },
  Moon: {
    pt: 'Lua',
    keyword: 'Manas — a mente',
    nature: 'feminino, sattvico, Jala (água)',
    governs: 'emoções, mãe, lar, memória, intuição, ciclos, público, fertilidade',
    shadow: 'instabilidade emocional, apego excessivo, fusão sem limite',
    exaltation: 'Taurus',
    debilitation: 'Scorpio',
    ownSigns: ['Cancer'],
  },
  Mars: {
    pt: 'Marte',
    keyword: 'Shakti — a força',
    nature: 'masculino, tamásico, Agni (fogo)',
    governs: 'coragem, energia física, irmãos, propriedade, conflito, desejos, cirurgia',
    shadow: 'agressividade, impulsividade, violência, impaciência sem causa',
    exaltation: 'Capricorn',
    debilitation: 'Cancer',
    ownSigns: ['Aries', 'Scorpio'],
  },
  Mercury: {
    pt: 'Mercúrio',
    keyword: 'Buddhi — o intelecto discriminador',
    nature: 'neutro (adota o signo), rajásico, Prithvi/Vayu',
    governs: 'comunicação, comércio, análise, pele, sistema nervoso, matemática, escrita',
    shadow: 'análise paralisante, frivolidade, desonestidade sutil',
    exaltation: 'Virgo',
    debilitation: 'Pisces',
    ownSigns: ['Gemini', 'Virgo'],
  },
  Jupiter: {
    pt: 'Júpiter',
    keyword: 'Guru — a sabedoria expandida',
    nature: 'masculino, sattvico, Akasha (éter)',
    governs: 'sabedoria, dharma, mestres, filhos, graça, fé, riqueza espiritual, lei',
    shadow: 'exagero, dogmatismo, passividade excessiva (confunde graça com inércia)',
    exaltation: 'Cancer',
    debilitation: 'Capricorn',
    ownSigns: ['Sagittarius', 'Pisces'],
  },
  Venus: {
    pt: 'Vênus',
    keyword: 'Kama — o desejo refinado',
    nature: 'feminino, rajásico, Jala/Vayu',
    governs: 'beleza, prazer, relacionamentos, arte, luxo, criatividade, vitalidade reprodutiva',
    shadow: 'indulgência, dependência afetiva, priorizar prazer sobre propósito',
    exaltation: 'Pisces',
    debilitation: 'Virgo',
    ownSigns: ['Taurus', 'Libra'],
  },
  Saturn: {
    pt: 'Saturno',
    keyword: 'Karma — o tempo que cobra',
    nature: 'masculino, tamásico, Vayu (ar)',
    governs: 'karma, disciplina, limitação, massas, serviçais, velhice, morte, moksha',
    shadow: 'rigidez, medo crônico, atraso percebido como punição, isolamento desnecessário',
    exaltation: 'Libra',
    debilitation: 'Aries',
    ownSigns: ['Capricorn', 'Aquarius'],
  },
  Rahu: {
    pt: 'Rahu',
    keyword: 'Obsessão — o karma futuro',
    nature: 'sombra (chhaya graha), tamásico, amplificador',
    governs: 'karma futuro, obsessão, ilusão, tecnologia, estrangeiro, veneno/remédio, ambição',
    shadow: 'compulsão, ilusão que seduz, salto sem fundação, alienação de si mesmo',
    exaltation: 'Taurus',
    debilitation: 'Scorpio',
    ownSigns: ['Aquarius'],
  },
  Ketu: {
    pt: 'Ketu',
    keyword: 'Moksha — o desapego que liberta',
    nature: 'sombra (chhaya graha), tamásico, dissolução',
    governs: 'karma passado, libertação, espiritualidade, isolamento, herança kármica, fogo sagrado',
    shadow: 'desapego que vira abandono, fuga da realidade, confusão sobre onde pertence',
    exaltation: 'Scorpio',
    debilitation: 'Taurus',
    ownSigns: ['Scorpio'],
  },
};

// ─── Arquétipos dos 12 Signos ────────────────────────────────

export const SIGN_ARCHETYPES: Record<
  SignName,
  {
    pt: string;
    element: string;
    quality: string;
    ruler: PlanetName;
    keyword: string;
    nature: string;
  }
> = {
  Aries: {
    pt: 'Áries',
    element: 'fogo',
    quality: 'movável (chara)',
    ruler: 'Mars',
    keyword: 'iniciação',
    nature: 'ativo, impulsivo, pioneiro, guerreiro, inicia mas precisa aprender a sustentar',
  },
  Taurus: {
    pt: 'Touro',
    element: 'terra',
    quality: 'fixo (sthira)',
    ruler: 'Venus',
    keyword: 'sustentação',
    nature: 'estável, sensual, acumulador, paciente, obstinado em preservar o que construiu',
  },
  Gemini: {
    pt: 'Gêmeos',
    element: 'ar',
    quality: 'dual (dvisvabhava)',
    ruler: 'Mercury',
    keyword: 'conexão',
    nature: 'curioso, versátil, comunicativo, dualidade interna entre dois caminhos',
  },
  Cancer: {
    pt: 'Câncer',
    element: 'água',
    quality: 'movável (chara)',
    ruler: 'Moon',
    keyword: 'nutrição',
    nature: 'protetor, intuitivo, emocional, materno, poroso ao ambiente',
  },
  Leo: {
    pt: 'Leão',
    element: 'fogo',
    quality: 'fixo (sthira)',
    ruler: 'Sun',
    keyword: 'soberania',
    nature: 'magnético, criativo, orgulhoso, generoso, precisa de reconhecimento para florescer',
  },
  Virgo: {
    pt: 'Virgem',
    element: 'terra',
    quality: 'dual (dvisvabhava)',
    ruler: 'Mercury',
    keyword: 'discriminação',
    nature: 'analítico, perfeccionista, serviço, detalhe, discernimento que pode virar crítica',
  },
  Libra: {
    pt: 'Libra',
    element: 'ar',
    quality: 'movável (chara)',
    ruler: 'Venus',
    keyword: 'equilíbrio',
    nature: 'diplomático, estético, parceria, justiça, decisão difícil quando os lados pesam igual',
  },
  Scorpio: {
    pt: 'Escorpião',
    element: 'água',
    quality: 'fixo (sthira)',
    ruler: 'Mars',
    keyword: 'transformação',
    nature: 'intenso, secreto, perscrutador, kármico, vai fundo ou não vai',
  },
  Sagittarius: {
    pt: 'Sagitário',
    element: 'fogo',
    quality: 'dual (dvisvabhava)',
    ruler: 'Jupiter',
    keyword: 'expansão',
    nature: 'filosófico, ousado, ensinador, explorador, precisa de liberdade para crescer',
  },
  Capricorn: {
    pt: 'Capricórnio',
    element: 'terra',
    quality: 'movável (chara)',
    ruler: 'Saturn',
    keyword: 'estrutura',
    nature: 'ambicioso, disciplinado, pragmático, paciente, constrói devagar mas constrói para durar',
  },
  Aquarius: {
    pt: 'Aquário',
    element: 'ar',
    quality: 'fixo (sthira)',
    ruler: 'Saturn',
    keyword: 'coletivo',
    nature: 'inovador, humanitário, desapegado, independente, serve o todo mas luta com o particular',
  },
  Pisces: {
    pt: 'Peixes',
    element: 'água',
    quality: 'dual (dvisvabhava)',
    ruler: 'Jupiter',
    keyword: 'dissolução',
    nature: 'compassivo, intuitivo, espiritual, permeável, absorve o entorno sem filtro',
  },
};

// ─── Significados das 12 Casas (Bhavas) ─────────────────────

export const HOUSE_MEANINGS: Record<
  number,
  {
    sanskrit: string;
    topic: string;
    keywords: string;
    significators: string;
    type: string;
  }
> = {
  1: {
    sanskrit: 'Tanu Bhava',
    topic: 'self, corpo, personalidade, dharma físico, aparência',
    keywords: 'identidade, saúde geral, temperamento, primeiro impacto, vitalidade',
    significators: 'Sol (alma), Marte (corpo físico), Ascendente em si',
    type: 'kendra (angular) + trikona',
  },
  2: {
    sanskrit: 'Dhana Bhava',
    topic: 'riqueza, fala, família próxima, valores acumulados',
    keywords: 'dinheiro guardado, voz, alimentação, olhos, infância, conhecimento herdado',
    significators: 'Júpiter (riqueza), Mercúrio (fala), Vênus (prazer material)',
    type: 'panapara (succedente)',
  },
  3: {
    sanskrit: 'Sahaja Bhava',
    topic: 'irmãos, coragem, habilidades manuais, comunicação próxima',
    keywords: 'esforço, escrita, viagens curtas, irmãos, mídia, curiosidade',
    significators: 'Marte (coragem), Mercúrio (comunicação)',
    type: 'apoklima (cadente)',
  },
  4: {
    sanskrit: 'Sukha Bhava',
    topic: 'lar, mãe, educação formal, paz interior, propriedades',
    keywords: 'felicidade, veículos, raízes, infância emocional, terra',
    significators: 'Lua (mãe/lar), Vênus (conforto), Marte (propriedades)',
    type: 'kendra (angular)',
  },
  5: {
    sanskrit: 'Putra Bhava',
    topic: 'filhos, criatividade, romance, inteligência, mantra, karma pré-natal',
    keywords: 'especulação, passatempos, discípulos, amor, devoção, bênção kármica',
    significators: 'Júpiter (filhos/sabedoria), Sol (criatividade/ego)',
    type: 'trikona',
  },
  6: {
    sanskrit: 'Ari Bhava',
    topic: 'inimigos, dívidas, doenças, serviço, rotina, obstáculos',
    keywords: 'saúde cotidiana, competição, empregados, litigação, purificação',
    significators: 'Saturno (serviço/karma), Marte (conflito)',
    type: 'trik (difícil)',
  },
  7: {
    sanskrit: 'Yuvati Bhava',
    topic: 'casamento, parcerias, sociedade, o outro',
    keywords: 'cônjuge, sócios, contatos públicos, viagens longas, negociações',
    significators: 'Vênus (casamento geral), Júpiter (marido no mapa feminino)',
    type: 'kendra (angular)',
  },
  8: {
    sanskrit: 'Randhra Bhava',
    topic: 'transformação, ocultismo, heranças, morte simbólica, crises',
    keywords: 'sexualidade profunda, recursos do parceiro, longevidade, segredos',
    significators: 'Saturno (longevidade), Marte (acidentes), Ketu (misticismo)',
    type: 'trik (difícil)',
  },
  9: {
    sanskrit: 'Dharma Bhava',
    topic: 'dharma, mestres, pai, filosofia, viagens longas, sorte',
    keywords: 'ensino superior, lei, religião, peregrinações, graça divina',
    significators: 'Júpiter (guru/dharma), Sol (pai)',
    type: 'trikona',
  },
  10: {
    sanskrit: 'Karma Bhava',
    topic: 'carreira, status, karma visível, governo, ações públicas',
    keywords: 'profissão, reputação, autoridade, legado, missão no mundo',
    significators: 'Sol (status), Saturno (karma/carreira), Marte (ação)',
    type: 'kendra (angular)',
  },
  11: {
    sanskrit: 'Labha Bhava',
    topic: 'ganhos, desejos realizados, amigos, irmão mais velho',
    keywords: 'renda, rede social, conquistas, aspirações, prosperidade futura',
    significators: 'Júpiter (ganhos), Saturno (grupos/massas)',
    type: 'upachaya (crescimento)',
  },
  12: {
    sanskrit: 'Vyaya Bhava',
    topic: 'libertação, perdas, espiritualidade, isolamento, lugares distantes',
    keywords: 'gastos, sono, ashrams, hospitais, moksha, práticas secretas, karma oculto',
    significators: 'Saturno (isolamento), Ketu (libertação), Júpiter (espiritualidade)',
    type: 'trik (difícil)',
  },
};

// ─── Os 27 Nakshatras ──────────────────────────────────────────
// Fonte: Brihat Parashara Hora Shastra + Nakshatra Insights (Prash Trivedi)

export const NAKSHATRA_MEANINGS: Record<
  NakshatraName,
  {
    ruler: PlanetName;
    deity: string;
    keyword: string;
    gift: string;
    shadow: string;
    symbol: string;
    degrees: string;
  }
> = {
  Ashwini: {
    ruler: 'Ketu',
    deity: 'Ashwini Kumaras (os médicos gêmeos dos deuses)',
    keyword: 'o pioneiro que cura',
    gift: 'rapidez, iniciativa sem medo, capacidade de começar onde outros recuam, cura instintiva',
    shadow: 'impulsividade sem reflexão, começa mas não termina, não aprende pela dor',
    symbol: 'cabeça de cavalo',
    degrees: '0° – 13°20\' Áries',
  },
  Bharani: {
    ruler: 'Venus',
    deity: 'Yama (o senhor da morte e do karma)',
    keyword: 'o portador do peso sagrado',
    gift: 'capacidade de carregar o que outros não suportam, transformação pelo excesso, força criativa profunda',
    shadow: 'acumula até o colapso, não abre mão mesmo quando deveria, testa os limites do tolerável',
    symbol: 'yoni (vulva) — portal entre nascimento e morte',
    degrees: '13°20\' – 26°40\' Áries',
  },
  Krittika: {
    ruler: 'Sun',
    deity: 'Agni (o fogo purificador)',
    keyword: 'o corte que purifica',
    gift: 'clareza cirúrgica, determinação que não se curva, capacidade de eliminar o falso sem hesitar',
    shadow: 'crítica excessiva, fere sem perceber o dano, radicalismo que isola',
    symbol: 'lâmina ou faca de sacrifício',
    degrees: '26°40\' Áries – 10° Touro',
  },
  Rohini: {
    ruler: 'Moon',
    deity: 'Brahma (o criador)',
    keyword: 'a fertilidade que floresce',
    gift: 'beleza magnética, criatividade fértil, atrai o que deseja com naturalidade, presença que nutre',
    shadow: 'possessividade que sufoca, ciúme, apego ao conforto que impede o crescimento',
    symbol: 'carro real ou carruagem',
    degrees: '10° – 23°20\' Touro',
  },
  Mrigashira: {
    ruler: 'Mars',
    deity: 'Soma (a lua, o néctar divino)',
    keyword: 'a busca gentil que nunca para',
    gift: 'curiosidade genuína, sensibilidade que encontra beleza onde outros não veem, mente ágil',
    shadow: 'inquietação crônica, busca o que já tem, foge quando finalmente encontra',
    symbol: 'cabeça de cervo',
    degrees: '23°20\' Touro – 6°40\' Gêmeos',
  },
  Ardra: {
    ruler: 'Rahu',
    deity: 'Rudra (Shiva em forma de tempestade bruta)',
    keyword: 'a tempestade que limpa',
    gift: 'profundidade emocional extrema, capacidade de reconstruir do zero, inteligência radical que vê o oculto',
    shadow: 'destruição desnecessária, caos como modo de vida, raiva não integrada que vira maré',
    symbol: 'lágrima ou diamante bruto',
    degrees: '6°40\' – 20° Gêmeos',
  },
  Punarvasu: {
    ruler: 'Jupiter',
    deity: 'Aditi (mãe de todos os deuses, o ilimitado)',
    keyword: 'o retorno à luz',
    gift: 'renovação sem amargura, otimismo genuíno, capacidade de começar de novo com graça',
    shadow: 'dispersão de energia, dificuldade de sustentar o que inicia, promete mais do que entrega',
    symbol: 'carcaj (aljava com flechas)',
    degrees: '20° Gêmeos – 3°20\' Câncer',
  },
  Pushya: {
    ruler: 'Saturn',
    deity: 'Brihaspati (o mestre espiritual dos deuses)',
    keyword: 'o nutridor que sustenta',
    gift: 'cuidado genuíno sem expectativa de retorno, responsabilidade que nutre, capaz de dar sem esgotar',
    shadow: 'rigidez no cuidado (só do jeito que eu sei), sufoca quem nutre, martiriza-se pelo dever',
    symbol: 'flor de lótus ou círculo sagrado',
    degrees: '3°20\' – 16°40\' Câncer',
  },
  Ashlesha: {
    ruler: 'Mercury',
    deity: 'Nagas (as serpentes sagradas, kundalini)',
    keyword: 'o abraço que não solta',
    gift: 'penetração psíquica profunda, vê além da aparência, cura pela serpente quando a energia está canalizada',
    shadow: 'manipulação sutil, usa insight para controlar, apego que sufoca quem está perto',
    symbol: 'serpente enrolada',
    degrees: '16°40\' – 30° Câncer',
  },
  Magha: {
    ruler: 'Ketu',
    deity: 'Pitris (os ancestrais sagrados)',
    keyword: 'a realeza que carrega ancestrais',
    gift: 'dignidade natural, autoridade herdada do espírito, liderança com senso de propósito maior',
    shadow: 'orgulho que isola, peso da herança ancestral não integrada, sente que deve ser servido',
    symbol: 'trono real ou palanquim',
    degrees: '0° – 13°20\' Leão',
  },
  'Purva Phalguni': {
    ruler: 'Venus',
    deity: 'Bhaga (o deus do prazer legítimo e da prosperidade)',
    keyword: 'o descanso que cria',
    gift: 'prazer sem culpa, criatividade fluída, charme natural que abre portas',
    shadow: 'preguiça quando a vida está boa, hedonismo, evita o que demanda esforço real',
    symbol: 'pernas de leito (o descanso como ato sagrado)',
    degrees: '13°20\' – 26°40\' Leão',
  },
  'Uttara Phalguni': {
    ruler: 'Sun',
    deity: 'Aryaman (deus dos contratos sociais e da honra)',
    keyword: 'o patrono confiável',
    gift: 'confiabilidade estrutural, capacidade de criar vínculos que duram, apoio genuíno',
    shadow: 'dependência excessiva de aprovação social, inflexibilidade ao quebrar regras necessárias',
    symbol: 'cama (o descanso após o trabalho honesto)',
    degrees: '26°40\' Leão – 10° Virgem',
  },
  Hasta: {
    ruler: 'Moon',
    deity: 'Savitar (o sol antes do nascer — potencial puro)',
    keyword: 'as mãos que manifestam',
    gift: 'habilidade manual e mental, cura pelo toque, capacidade de dar forma ao que parecia impossível',
    shadow: 'astúcia sem ética, inteligência que manipula, nervosismo disfarçado de praticidade',
    symbol: 'mão aberta',
    degrees: '10° – 23°20\' Virgem',
  },
  Chitra: {
    ruler: 'Mars',
    deity: 'Vishwakarma (o arquiteto dos deuses)',
    keyword: 'o arquiteto que fascina',
    gift: 'beleza criada com intenção, design que comunica sem palavras, magnetismo visual intenso',
    shadow: 'aparência acima de substância, seduz sem construir profundidade',
    symbol: 'pérola brilhante ou joia',
    degrees: '23°20\' Virgem – 6°40\' Libra',
  },
  Swati: {
    ruler: 'Rahu',
    deity: 'Vayu (o deus do vento)',
    keyword: 'a independência que flutua',
    gift: 'adaptabilidade extrema, encontra caminho onde não há, livre de apegos quando necessário',
    shadow: 'instabilidade como estilo de vida, incapacidade de criar raízes por medo de perder liberdade',
    symbol: 'broto de planta balançando no vento',
    degrees: '6°40\' – 20° Libra',
  },
  Vishakha: {
    ruler: 'Jupiter',
    deity: 'Indra-Agni (poder e fogo sagrado juntos)',
    keyword: 'o propósito que divide',
    gift: 'determinação singular, foco que sacrifica tudo pelo objetivo, inspira pelo exemplo',
    shadow: 'fanatismo pelo objetivo, inveja de quem chegou primeiro, não descansa quando deveria',
    symbol: 'arco de triunfo ou galho bifurcado',
    degrees: '20° Libra – 3°20\' Escorpião',
  },
  Anuradha: {
    ruler: 'Saturn',
    deity: 'Mitra (o deus da amizade e dos contratos sagrados)',
    keyword: 'a devoção que organiza',
    gift: 'amizade profunda e duradoura, capacidade de manter compromissos por amor genuíno',
    shadow: 'ciúme disfarçado de devoção, sufoca quem ama pela intensidade do vínculo',
    symbol: 'lótus ou fileira de oferendas',
    degrees: '3°20\' – 16°40\' Escorpião',
  },
  Jyeshtha: {
    ruler: 'Mercury',
    deity: 'Indra (o rei dos deuses, protetor dos fracos)',
    keyword: 'o ancião que protege',
    gift: 'maturidade que protege, capacidade de carregar responsabilidade pelos outros sem pedir nada',
    shadow: 'domínio excessivo, não delega poder, sente-se mais velho que todos ao redor',
    symbol: 'brinco circular ou guarda-chuva real',
    degrees: '16°40\' – 30° Escorpião',
  },
  Mula: {
    ruler: 'Ketu',
    deity: 'Nirriti (a deusa da dissolução, caos, raiz)',
    keyword: 'a raiz que dissolve para refundar',
    gift: 'vai à raiz de qualquer problema, recusa explicações superficiais, força de reconstrução absoluta',
    shadow: 'destrói o que toca sem perceber, não consegue sustentar formas — ciclos de colapso recorrentes',
    symbol: 'raiz de planta ou cauda de escorpião',
    degrees: '0° – 13°20\' Sagitário',
  },
  'Purva Ashadha': {
    ruler: 'Venus',
    deity: 'Apas (as águas purificadoras, a deusa da fertilidade cósmica)',
    keyword: 'a vitória invicta',
    gift: 'convicção inabalável, inspira massas com presença, purifica ambientes pelo simples fato de estar',
    shadow: 'arrogância de quem se crê invencível, não reconhece a derrota necessária',
    symbol: 'leque ou tarjeta de vitória',
    degrees: '13°20\' – 26°40\' Sagitário',
  },
  'Uttara Ashadha': {
    ruler: 'Sun',
    deity: 'Vishwedevas (a totalidade de todos os deuses juntos)',
    keyword: 'a vitória pelo dharma',
    gift: 'integridade que atrai vitória lenta mas permanente, age pela causa coletiva sem se importar com crédito',
    shadow: 'teimosia após o ponto de retorno, não sabe quando parar, carrega peso que já deveria largar',
    symbol: 'elefante ou dente de elefante (paciência)',
    degrees: '26°40\' Sagitário – 10° Capricórnio',
  },
  Shravana: {
    ruler: 'Moon',
    deity: 'Vishnu (o preservador)',
    keyword: 'o ouvido que transforma',
    gift: 'escuta ativa que cura quem é ouvido, preserva o que tem valor, conecta o que estava separado',
    shadow: 'ouve tudo mas não fala o que precisa ser dito, fofoca, paralisa pela acumulação de informação',
    symbol: 'orelha ou três passos de Vishnu',
    degrees: '10° – 23°20\' Capricórnio',
  },
  Dhanishta: {
    ruler: 'Mars',
    deity: 'Ashta Vasus (os oito deuses da abundância e dos elementos)',
    keyword: 'o ritmo que atrai abundância',
    gift: 'senso musical e rítmico natural, atrai riqueza com aparente facilidade, liderança carismática',
    shadow: 'ganância que distancia, usa carisma para acumular sem partilhar',
    symbol: 'tambor ou flauta',
    degrees: '23°20\' Capricórnio – 6°40\' Aquário',
  },
  Shatabhisha: {
    ruler: 'Rahu',
    deity: 'Varuna (o deus do oceano, do karma oculto e da purificação)',
    keyword: 'o curador das cem estrelas',
    gift: 'cura do que parece incurável, visão que penetra o oculto, guarda segredos que protegem',
    shadow: 'isolamento como armadura permanente, adicção como fuga do que vê demais',
    symbol: 'círculo vazio (mil flores ou cem médicos)',
    degrees: '6°40\' – 20° Aquário',
  },
  'Purva Bhadrapada': {
    ruler: 'Jupiter',
    deity: 'Aja Ekapad (o trovão de um pé, serpente do relâmpago)',
    keyword: 'o fogo que transforma tudo',
    gift: 'intensidade que purifica, capacidade de sacrifício genuíno pelo que acredita',
    shadow: 'fanatismo, radicalismo que queima tudo inclusive a si mesmo',
    symbol: 'espada ou pernas de cama (frente)',
    degrees: '20° Aquário – 3°20\' Peixes',
  },
  'Uttara Bhadrapada': {
    ruler: 'Saturn',
    deity: 'Ahir Budhnya (a serpente das profundezas, raiz do oceano)',
    keyword: 'a profundidade que sustenta o mundo',
    gift: 'sabedoria ancestral profunda, compaixão que cura sem se contaminar, carrega o sofrimento alheio sem quebrar',
    shadow: 'introversão como fuga permanente, carrega tanto que paralisa',
    symbol: 'serpente das profundezas ou pernas de cama (trás)',
    degrees: '3°20\' – 16°40\' Peixes',
  },
  Revati: {
    ruler: 'Mercury',
    deity: 'Pushan (o guia das almas em transição)',
    keyword: 'o guia do fim e do recomeço',
    gift: 'compaixão profunda sem julgamento, guia almas perdidas de volta ao caminho, fecha ciclos com graça',
    shadow: 'hipersensibilidade que paralisa, não sabe quando um ciclo terminou e fica vivendo no já foi',
    symbol: 'peixe ou tambor de pescar',
    degrees: '16°40\' – 30° Peixes',
  },
};

// ─── Temas das 9 Mahadashas (Vimshottari) ────────────────────
// Sistema de 120 anos. Ordem: Ketu → Vênus → Sol → Lua → Marte → Rahu → Júpiter → Saturno → Mercúrio

export const DASHA_THEMES: Record<
  PlanetName,
  {
    duration: number;
    pt: string;
    theme: string;
    activates: string;
    invitation: string;
    challenge: string;
  }
> = {
  Ketu: {
    duration: 7,
    pt: 'Ketu',
    theme: 'dissolução do que não é mais você, karma passado aflorando',
    activates: 'desilusões necessárias, interesse espiritual súbito, retiro, sabedoria oculta',
    invitation: 'soltar a identidade que não serve mais sem resistência',
    challenge: 'confusão, falta de direção, perda de coisas antes valorizadas',
  },
  Venus: {
    duration: 20,
    pt: 'Vênus',
    theme: 'prazer, relacionamentos, arte, riqueza material, beleza',
    activates: 'casamento, criatividade, luxo, conforto, estética, vitalidade',
    invitation: 'criar beleza que dura mais que o prazer imediato',
    challenge: 'indulgência, dependência afetiva, perder-se no conforto',
  },
  Sun: {
    duration: 6,
    pt: 'Sol',
    theme: 'identidade, autoridade, dharma, clareza do propósito',
    activates: 'ego, relação com o pai, carreira pública, saúde vital',
    invitation: 'assumir quem você é sem pedir permissão a ninguém',
    challenge: 'arrogância, necessidade de aprovação, conflito com figuras de autoridade',
  },
  Moon: {
    duration: 10,
    pt: 'Lua',
    theme: 'emoções, intuição, lar, mãe, ciclos, público',
    activates: 'vida doméstica, saúde emocional, relação com o feminino',
    invitation: 'aprender a sentir sem se perder no que sente',
    challenge: 'instabilidade emocional, apego, hipersensibilidade',
  },
  Mars: {
    duration: 7,
    pt: 'Marte',
    theme: 'ação, conflito, coragem, energia, desejos',
    activates: 'ambição, propriedades, irmãos, saúde física, competição',
    invitation: 'agir com coragem sem destruir o que deve ser preservado',
    challenge: 'impulsividade, agressividade, acidentes, conflitos desnecessários',
  },
  Rahu: {
    duration: 18,
    pt: 'Rahu',
    theme: 'obsessão, ambição, salto evolutivo, ilusão',
    activates: 'desejos intensos, mudanças radicais, tecnologia, estrangeiro, transformação',
    invitation: 'perseguir o desejo sem ser consumido por ele',
    challenge: 'compulsão, ilusão, dispersão, perda de identidade',
  },
  Jupiter: {
    duration: 16,
    pt: 'Júpiter',
    theme: 'expansão, sabedoria, fé, graça, ensino',
    activates: 'mestres, casamento, filhos, riqueza espiritual, dharma',
    invitation: 'crescer sem perder o chão e a humildade',
    challenge: 'exagero, dogmatismo, excesso de otimismo',
  },
  Saturn: {
    duration: 19,
    pt: 'Saturno',
    theme: 'karma, disciplina, estrutura, limitação necessária',
    activates: 'responsabilidades pesadas, trabalho árduo, colheita kármica, longevidade',
    invitation: 'construir o que resiste ao tempo aceitando o processo lento',
    challenge: 'atrasos, pessimismo, solidão, peso das obrigações',
  },
  Mercury: {
    duration: 17,
    pt: 'Mercúrio',
    theme: 'intelecto, comunicação, análise, negócios, aprendizado',
    activates: 'contratos, escritas, comércio, estudos, relações comerciais',
    invitation: 'usar a mente a serviço do propósito, não do ego',
    challenge: 'análise paralisante, excesso de informação, frivolidade',
  },
};

// ─── Yogas Importantes ─────────────────────────────────────────

export const KEY_YOGAS: Record<
  string,
  {
    definition: string;
    effect: string;
    activation: string;
  }
> = {
  rajYoga: {
    definition: 'Planetas de casas kendra (1/4/7/10) em conjunção ou aspectando planetas de casas trikona (1/5/9)',
    effect: 'Autoridade, elevação social, liderança, reconhecimento público',
    activation: 'Mahadasha ou antardasha do planeta que forma o yoga',
  },
  dhanaYoga: {
    definition: 'Conexão entre os regentes das casas 2, 5, 9 e 11',
    effect: 'Acumulação de riqueza, múltiplas fontes de ganho',
    activation: 'Mahadasha ou antardasha dos planetas envolvidos',
  },
  gajakesariYoga: {
    definition: 'Júpiter e Lua em relação kendra entre si (1/4/7/10 do outro)',
    effect: 'Sabedoria elevada, fama, generosidade magnética, longevidade',
    activation: 'Mahadasha de Júpiter ou da Lua',
  },
  kemadrumayoga: {
    definition: 'Lua sem planetas nas casas vizinhas (2ª e 12ª da Lua)',
    effect: 'Isolamento emocional, dificuldades materiais, sensação de não pertencer',
    activation: 'Presente ao longo da vida, especialmente em Mahadasha da Lua',
  },
  sadeSati: {
    definition: 'Saturno transitando as casas 12ª, 1ª e 2ª em relação à Lua natal (período de ~7,5 anos)',
    effect: 'Período de provas, responsabilidades, transformação karmica profunda',
    activation: 'Quando Saturno em trânsito chega ao signo anterior à Lua natal',
  },
  viparitaRajaYoga: {
    definition: 'Regentes das casas trik (6, 8, 12) em conjunção ou em casas trik',
    effect: 'Triunfo após adversidade, vitória vinda de situações aparentemente destrutivas',
    activation: 'Mahadasha do planeta envolvido — o pior momento antes da virada',
  },
  neechabangaRajaYoga: {
    definition: 'Planeta em debilitação com condições de cancelamento (debilitation cancellation)',
    effect: 'A fraqueza aparente se inverte — período de grande ascensão após humilhação',
    activation: 'Mahadasha ou antardasha do planeta em debilitação com neecha bhanga',
  },
};
