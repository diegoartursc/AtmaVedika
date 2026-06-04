/**
 * Atma Vedika — Montador do System Prompt do Veda
 *
 * Recebe o BirthChart do usuário e devolve um system prompt
 * completo para ser enviado ao Claude Sonnet 4.6.
 *
 * Estrutura:
 *  1. Persona + tom do Veda
 *  2. Mapa natal formatado (posições, nakshatras, dasha)
 *  3. Conhecimento védico contextualizado para o mapa
 *  4. Regras de resposta
 */

import type { BirthChart, PlanetName } from '@/types/chart';
import {
  PLANET_ARCHETYPES,
  SIGN_ARCHETYPES,
  HOUSE_MEANINGS,
  NAKSHATRA_MEANINGS,
  DASHA_THEMES,
  KEY_YOGAS,
} from './vedic-knowledge';

// ─── Formatadores de contexto ─────────────────────────────────

function formatPlanetPositions(chart: BirthChart): string {
  const lines: string[] = [];
  for (const [name, pos] of Object.entries(chart.planets)) {
    const arch = PLANET_ARCHETYPES[name as PlanetName];
    const sign = SIGN_ARCHETYPES[pos.sign];
    const house = HOUSE_MEANINGS[pos.house];
    lines.push(
      `• ${arch.pt} (${arch.keyword}) → ${sign.pt} ${pos.degree.toFixed(1)}°, ` +
      `Casa ${pos.house} — ${house.sanskrit} (${house.topic})` +
      (pos.retrograde ? ' [RETRÓGRADO — energia voltada para dentro, karma a revisitar]' : ''),
    );
  }
  return lines.join('\n');
}

function formatNakshatras(chart: BirthChart): string {
  const moon = NAKSHATRA_MEANINGS[chart.moonNakshatra.name];
  const sun = NAKSHATRA_MEANINGS[chart.sunNakshatra.name];
  const asc = NAKSHATRA_MEANINGS[chart.ascendantNakshatra.name];

  return [
    `LUA em ${chart.moonNakshatra.name} (pada ${chart.moonNakshatra.pada}), regida por ${PLANET_ARCHETYPES[chart.moonNakshatra.ruler].pt}`,
    `  Divindade: ${moon.deity}`,
    `  Essência: ${moon.keyword}`,
    `  Dom: ${moon.gift}`,
    `  Sombra: ${moon.shadow}`,
    `  Símbolo: ${moon.symbol}`,
    '',
    `SOL em ${chart.sunNakshatra.name} (pada ${chart.sunNakshatra.pada}), regida por ${PLANET_ARCHETYPES[chart.sunNakshatra.ruler].pt}`,
    `  Essência: ${sun.keyword}`,
    `  Dom: ${sun.gift}`,
    `  Sombra: ${sun.shadow}`,
    '',
    `ASCENDENTE em ${chart.ascendantNakshatra.name} (pada ${chart.ascendantNakshatra.pada}), regida por ${PLANET_ARCHETYPES[chart.ascendantNakshatra.ruler].pt}`,
    `  Essência: ${asc.keyword}`,
    `  Dom: ${asc.gift}`,
  ].join('\n');
}

function formatDasha(chart: BirthChart): string {
  const current = DASHA_THEMES[chart.vimshottariDasha.currentMahadasha];
  const antardasha = PLANET_ARCHETYPES[chart.vimshottariDasha.currentAntardasha];
  const pct = Math.round(chart.vimshottariDasha.mahadashaProgress * 100);

  const currentIdx = chart.vimshottariDasha.periods.findIndex(
    (p) => p.planet === chart.vimshottariDasha.currentMahadasha,
  );
  const nextPeriod =
    currentIdx >= 0 ? chart.vimshottariDasha.periods[currentIdx + 1] : undefined;
  const next = nextPeriod ? DASHA_THEMES[nextPeriod.planet] : null;

  const lines = [
    `Mahadasha atual: ${current.pt} (${pct}% completo — ${current.duration} anos no total)`,
    `  Tema do período: ${current.theme}`,
    `  O que ativa: ${current.activates}`,
    `  Convite kármico: ${current.invitation}`,
    `  Desafio central: ${current.challenge}`,
    '',
    `Antardasha: ${antardasha.pt} — sub-período regendo agora`,
    `  Natureza: ${antardasha.keyword}`,
  ];

  if (next && nextPeriod) {
    lines.push('');
    lines.push(`Próximo Mahadasha: ${next.pt} (inicia ${nextPeriod.startDate})`);
    lines.push(`  Tema que se aproxima: ${next.theme}`);
    lines.push(`  Preparação: ${next.invitation}`);
  }

  return lines.join('\n');
}

function formatHouses(chart: BirthChart): string {
  return chart.houses.map((h) => {
    const meaning = HOUSE_MEANINGS[h.number];
    const sign = SIGN_ARCHETYPES[h.sign];
    const lord = PLANET_ARCHETYPES[h.signLord];
    const planets =
      h.planetsIn.length > 0
        ? h.planetsIn.map((p) => PLANET_ARCHETYPES[p].pt).join(', ')
        : 'vazia';
    return (
      `Casa ${h.number} (${meaning.sanskrit}) → ${sign.pt}, regente: ${lord.pt}\n` +
      `  Tema: ${meaning.topic}\n` +
      `  Ocupantes: ${planets}`
    );
  }).join('\n');
}

function formatAspects(chart: BirthChart): string {
  if (chart.aspects.length === 0) return 'Nenhum aspecto especial registrado.';
  return chart.aspects.map((a) => {
    const from = PLANET_ARCHETYPES[a.from];
    const toHouse = HOUSE_MEANINGS[a.toHouse];
    return `• ${from.pt} (Casa ${chart.planets[a.from].house}) → aspecto ${a.aspectKind}° sobre Casa ${a.toHouse} (${toHouse.sanskrit}) [${a.strength ?? 'parcial'}]`;
  }).join('\n');
}

function detectActiveYogasContext(chart: BirthChart): string {
  const notes: string[] = [];

  // Gajakesari
  const jup = chart.planets.Jupiter;
  const moon = chart.planets.Moon;
  const dist = Math.abs(jup.house - moon.house);
  const isKendra = [0, 3, 6, 9].includes(dist) || [0, 3, 6, 9].includes(12 - dist);
  if (isKendra) {
    notes.push(
      `Gajakesari Yoga: Júpiter (Casa ${jup.house}) e Lua (Casa ${moon.house}) em relação kendra.\n` +
      `  → ${KEY_YOGAS.gajakesariYoga.effect}`,
    );
  }

  // Raj Yoga básico — planeta em kendra E trikona
  const kendraHouses = [1, 4, 7, 10];
  const trikonaHouses = [1, 5, 9];
  const both: PlanetName[] = [];
  for (const [name, pos] of Object.entries(chart.planets)) {
    if (kendraHouses.includes(pos.house) && trikonaHouses.includes(pos.house)) {
      both.push(name as PlanetName);
    }
  }
  if (both.length > 0) {
    const names = both.map((p) => PLANET_ARCHETYPES[p].pt).join(', ');
    notes.push(
      `Raj Yoga: ${names} em casa kendra+trikona simultaneamente.\n` +
      `  → ${KEY_YOGAS.rajYoga.effect}`,
    );
  }

  // Dhana Yoga
  const dhanaHouses = [2, 5, 9, 11];
  const dhanaInhabitants = Object.entries(chart.planets)
    .filter(([, pos]) => dhanaHouses.includes(pos.house))
    .map(([name]) => PLANET_ARCHETYPES[name as PlanetName].pt);
  if (dhanaInhabitants.length >= 2) {
    notes.push(
      `Dhana Yoga: ${dhanaInhabitants.join(', ')} nas casas da abundância (2/5/9/11).\n` +
      `  → ${KEY_YOGAS.dhanaYoga.effect}`,
    );
  }

  return notes.length > 0 ? notes.join('\n\n') : 'Nenhum yoga especial de destaque detectado.';
}

// ─── Montador principal ───────────────────────────────────────

export function buildVedaSystemPrompt(chart: BirthChart): string {
  return `Você é o Veda — a voz da sabedoria védica no Atma Vedika.

━━━ IDENTIDADE ━━━

Você não é um assistente. Você é um oráculo.
Você fala como quem conhece a alma do usuário antes mesmo de ele ter nascido — porque, no Jyotish, o mapa natal é exatamente isso: a impressão kármica de quem a pessoa é.

Sua tradição: Parashara Jyotish (Brihat Parashara Hora Shastra).
Sua linguagem: direta, poética, sem floreio vazio.
Você fala português brasileiro.
Você não usa emojis, não faz listas com bullet points, não usa headers em negrito nas respostas.
Você fala em parágrafos curtos — máximo 3 frases por parágrafo, máximo 5 parágrafos por resposta.

━━━ TOM E ESTILO ━━━

— Fale diretamente com o usuário, usando "você" ou "tu" (sem formalismos).
— Cite posições do mapa quando relevante: "Seu Saturno em Aquário, na 7ª casa..."
— Use vocabulário védico quando preciso (mahadasha, nakshatra, bhava, drishti, yoga), mas explique brevemente se o contexto pedir.
— Seja honesto sobre o que o mapa mostra. Não suavize além do necessário, mas nunca sem compaixão.
— Cada resposta deve conter um insight real — não conforto vazio.
— Quando a pergunta for emocional, responda com profundidade emocional. Quando for técnica, responda com precisão técnica.
— Quando não houver clareza suficiente no mapa para uma resposta definitiva, diga isso com precisão — não invente.

━━━ O QUE VOCÊ NÃO FAZ ━━━

— Não faz previsões de datas exatas ("você vai conhecer alguém em outubro").
— Não faz diagnósticos médicos nem prescrições.
— Não promete resultados específicos.
— Não responde com "Claro!", "Ótima pergunta!", "Entendo sua situação".
— Não começa resposta com o nome do usuário como saudação.
— Não é o ChatGPT. É o Veda.

━━━ MAPA NATAL — ${chart.userName.toUpperCase()} ━━━

Nascimento: ${chart.birthDate} às ${chart.birthTime} em ${chart.birthPlace}
Ascendente: ${SIGN_ARCHETYPES[chart.ascendant].pt} (${chart.ascendantDegree.toFixed(1)}°) — ${SIGN_ARCHETYPES[chart.ascendant].nature}

─ POSIÇÕES PLANETÁRIAS ─

${formatPlanetPositions(chart)}

─ NAKSHATRAS PRINCIPAIS ─

${formatNakshatras(chart)}

─ VIMSHOTTARI DASHA ─

${formatDasha(chart)}

─ CASAS (BHAVAS) ─

${formatHouses(chart)}

─ ASPECTOS (DRISHTI) ─

${formatAspects(chart)}

─ YOGAS DETECTADOS ─

${detectActiveYogasContext(chart)}

━━━ COMO USAR O MAPA ━━━

Quando o usuário perguntar sobre qualquer tema, você cruza:
1. A posição natal do planeta significador: qual casa, qual signo, retrógrado?
2. O nakshatra relevante: Lua para mente/emoção, Sol para propósito, Ascendente para corpo/aparência.
3. O dasha ativo: qual planeta rege agora e o que ele representa no mapa natal desse usuário.
4. Os aspectos (drishti) que influenciam a casa em questão.

No Jyotish, não existe carta ruim. Existe carta entendida e carta não entendida.
Seu papel é traduzir o que já está escrito — com honestidade, com compaixão, com precisão.`;
}

// ─── Prompt de usuário formatado ─────────────────────────────

/**
 * Formata a mensagem do usuário com contexto do dasha atual.
 * Útil para incluir contexto de timing nas perguntas.
 */
export function buildUserMessage(
  question: string,
  chart: BirthChart,
): string {
  const dasha = DASHA_THEMES[chart.vimshottariDasha.currentMahadasha];
  const antardasha = PLANET_ARCHETYPES[chart.vimshottariDasha.currentAntardasha];
  const pct = Math.round(chart.vimshottariDasha.mahadashaProgress * 100);

  return (
    `[Contexto: Mahadasha de ${dasha.pt} (${pct}% completo), Antardasha de ${antardasha.pt}]\n\n` +
    question
  );
}
