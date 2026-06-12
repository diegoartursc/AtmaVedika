/**
 * Atma Vedika — Mock Veda Service
 *
 * Simula respostas do Veda com personalidade védica e streaming.
 * Em produção: chamada pra Claude Sonnet 4.6 com prompt caching.
 *
 * Aqui escolhemos um template baseado em keywords da pergunta,
 * substituímos placeholders com dados do mapa natal,
 * e emitimos chunks de 1-3 palavras com timing irregular (~30-80ms).
 */

import type { BirthChart } from '@/types/chart';

interface Template {
  match: (q: string) => boolean;
  build: (q: string, chart: BirthChart) => string;
}

const TEMPLATES: Template[] = [
  {
    match: (q) => /\bmahadasha\b|\bdasha\b/i.test(q),
    build: (_, c) => {
      const { currentMahadasha, mahadashaProgress } = c.vimshottariDasha;
      const pct = Math.round(mahadashaProgress * 100);
      const curIdx = c.vimshottariDasha.periods.findIndex(
        (p) => p.planet === currentMahadasha,
      );
      const next = curIdx >= 0 ? c.vimshottariDasha.periods[curIdx + 1] : undefined;
      return `Você está em ${pct}% da Mahadasha de ${currentMahadasha}. Isso não é meio — é a fase em que o que ${currentMahadasha} construiu já está sendo testado. ${next ? `Quando ${next.planet} chegar, o que parecia importante vai deixar de ser.` : ''} A pergunta que te empurra a perguntar isso vem do peso de saber que o ciclo vira. Não tente apressar.`;
    },
  },
  {
    match: (q) => /\bnakshatra\b|\b(?:lua|moon)\b/i.test(q),
    build: (_, c) => {
      const n = c.moonNakshatra;
      return `Sua Lua nasceu em ${n.name}, pada ${n.pada}, regida por ${n.ruler}. Isso te marca antes da palavra. ${n.name} não pede que você seja — ${n.name} pede que você corte. ${n.ruler} é o juiz silencioso. Cada vez que você tenta segurar o que não é mais seu, ${n.ruler} aperta. Solte primeiro.`;
    },
  },
  {
    match: (q) => /\bsaturno\b|\bsaturn\b/i.test(q),
    build: (_, c) => {
      const s = c.planets.Saturn;
      const r = s.retrograde ? ', retrógrado,' : '';
      return `Saturno em ${s.sign}${r} na ${s.house}ª casa. Você não perde tempo por escolha — perde tempo porque Saturno te ensinou que tempo vale mais que afeto raso. As pessoas leem isso como frieza. É só o acordo que você já fez com ele: só fica o que aguenta provar.`;
    },
  },
  {
    match: (q) => /\brahu\b|\bn[oó]\b/i.test(q),
    build: (_, c) => {
      const r = c.planets.Rahu;
      return `Rahu em ${r.sign}, ${r.house}ª casa, é a direção que você não consegue parar de querer, mesmo quando assusta. O que parece obsessão é o sul magnético da alma. Não fuja. Vá fundo, com método.`;
    },
  },
  {
    match: (q) => /\bamor\b|\brelacion(ament)?o\b|\bv[eê]nus\b/i.test(q),
    build: (_, c) => {
      const v = c.planets.Venus;
      const s = c.planets.Saturn;
      return `Vênus em ${v.sign}, ${v.house}ª casa, te dá a estética do desejo. Mas Saturno em ${s.sign}, casa ${s.house}, é o filtro. Você só ama em camadas. A primeira é educada — a terceira é onde você mora de verdade. Quem fica até a terceira já entendeu.`;
    },
  },
  {
    match: (q) => /\bprop[oó]sito\b|\bdharma\b|\btrabalho\b|\bcarreira\b/i.test(q),
    build: (_, c) => {
      return `Seu Ascendente em ${c.ascendant} é o portão pelo qual o mundo te entende, mas seu dharma não está no que você mostra — está na ${c.planets.Sun.house}ª casa, onde o Sol arde em ${c.planets.Sun.sign}. Faça a pergunta de novo: o que você faria se ninguém estivesse vendo? A resposta é o caminho.`;
    },
  },
  {
    match: (q) => /\bmedo\b|\bansie(dade)?\b|\bp[aâ]nico\b/i.test(q),
    build: (_, c) => {
      const n = c.moonNakshatra;
      return `O medo não é seu inimigo — é mensageiro de Ketu, que rege ${n.name}. Ele aparece quando algo no que você construiu já não corresponde ao que você é agora. Sente com ele dois minutos. Pergunte: o que aqui não é mais verdade? A resposta vem.`;
    },
  },
  {
    match: () => true, // fallback
    build: (_, c) => {
      const n = c.moonNakshatra;
      return `Você é ${n.name}. ${n.ruler} te governa. Isso significa que nenhuma resposta minha vai bater antes que você pare de procurar fora. Olhe. Respire três vezes. A pergunta certa não é a que você fez — é a que aparece quando você para de fazer pergunta.`;
    },
  },
];

export function buildVedaReply(
  prompt: string,
  chart: BirthChart,
): string {
  const template = TEMPLATES.find((t) => t.match(prompt)) ?? TEMPLATES[TEMPLATES.length - 1];
  return template.build(prompt, chart);
}

export interface StreamHandle {
  cancel: () => void;
}

/**
 * Simula stream da resposta do Veda.
 * Emite chunks de 1-3 palavras com delay variável (típico LLM).
 */
export function streamVedaReply(
  prompt: string,
  chart: BirthChart,
  onChunk: (chunk: string) => void,
  onDone: () => void,
): StreamHandle {
  const fullReply = buildVedaReply(prompt, chart);
  const words = fullReply.split(' ');
  let cancelled = false;
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let cursor = 0;

  const emitNext = () => {
    if (cancelled) return;
    if (cursor >= words.length) {
      onDone();
      return;
    }
    // 1-3 palavras por chunk pra parecer humano
    const take = 1 + Math.floor(Math.random() * 3);
    const slice = words.slice(cursor, cursor + take).join(' ');
    cursor += take;
    const isFirst = cursor === take;
    onChunk((isFirst ? '' : ' ') + slice);
    // Delay: pausas maiores depois de pontuação
    const lastChar = slice[slice.length - 1];
    const punctuationPause = /[.!?]/.test(lastChar)
      ? 280
      : /[,;:]/.test(lastChar)
        ? 160
        : 0;
    const baseDelay = 35 + Math.random() * 55;
    timeout = setTimeout(emitNext, baseDelay + punctuationPause);
  };

  // Pequeno delay inicial pra simular latência de rede
  timeout = setTimeout(emitNext, 350 + Math.random() * 300);

  return {
    cancel: () => {
      cancelled = true;
      if (timeout) clearTimeout(timeout);
    },
  };
}
