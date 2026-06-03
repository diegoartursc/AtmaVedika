/**
 * Atma Vedika — Tab Perfil
 *
 * Identidade + configurações funcionais. Cada SettingRow abre o sheet
 * apropriado: OptionPickerSheet pra escolhas, InfoSheet pra textos.
 */

import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { CosmicBackground } from '@/components/effects/CosmicBackground';
import { PulsingGlow } from '@/components/effects/PulsingGlow';
import { Text } from '@/components/primitives/Text';
import { TAB_BAR_HEIGHT } from '@/components/navigation/CustomTabBar';
import {
  InfoSheet,
} from '@/components/settings/InfoSheet';
import {
  OptionPickerSheet,
  type PickerOption,
} from '@/components/settings/OptionPickerSheet';
import { mockBirthChart } from '@/mocks/birthChart';
import {
  useUserStore,
  type AppLanguage,
  type Ayanamsa,
  type HouseSystem,
  type ZodiacKind,
} from '@/store/userStore';
import { palette, semantic } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { spacing } from '@/theme/spacing';

const SIGN_PT: Record<string, string> = {
  Aries: 'Áries',
  Taurus: 'Touro',
  Gemini: 'Gêmeos',
  Cancer: 'Câncer',
  Leo: 'Leão',
  Virgo: 'Virgem',
  Libra: 'Libra',
  Scorpio: 'Escorpião',
  Sagittarius: 'Sagitário',
  Capricorn: 'Capricórnio',
  Aquarius: 'Aquário',
  Pisces: 'Peixes',
};

const HOUSE_OPTIONS: PickerOption<HouseSystem>[] = [
  {
    value: 'whole-sign',
    label: 'Whole Sign',
    caption: 'cada signo é uma casa inteira. Tradição clássica védica.',
  },
  {
    value: 'placidus',
    label: 'Placidus',
    caption: 'sistema ocidental moderno baseado em tempo.',
  },
  {
    value: 'equal',
    label: 'Equal House',
    caption: '12 casas de 30° a partir do ascendente.',
  },
];

const AYANAMSA_OPTIONS: PickerOption<Ayanamsa>[] = [
  {
    value: 'lahiri',
    label: 'Lahiri',
    caption: 'padrão oficial do governo indiano. O mais usado.',
  },
  {
    value: 'krishnamurti',
    label: 'Krishnamurti',
    caption: 'usado por seguidores do sistema KP.',
  },
  {
    value: 'raman',
    label: 'Raman',
    caption: 'tradicional pré-Lahiri. Pequena diferença de minutos.',
  },
];

const ZODIAC_OPTIONS: PickerOption<ZodiacKind>[] = [
  {
    value: 'sidereal',
    label: 'Sideral',
    caption: 'baseado nas estrelas fixas. Tradição védica.',
  },
  {
    value: 'tropical',
    label: 'Tropical',
    caption: 'baseado nas estações. Tradição ocidental.',
  },
];

const LANGUAGE_OPTIONS: PickerOption<AppLanguage>[] = [
  { value: 'pt', label: 'Português', caption: 'idioma atual.' },
  { value: 'en', label: 'English', caption: 'em breve.' },
  { value: 'es', label: 'Español', caption: 'em breve.' },
];

const HOUSE_LABEL: Record<HouseSystem, string> = {
  'whole-sign': 'Whole Sign',
  placidus: 'Placidus',
  equal: 'Equal House',
};

const AYANAMSA_LABEL: Record<Ayanamsa, string> = {
  lahiri: 'Lahiri',
  krishnamurti: 'Krishnamurti',
  raman: 'Raman',
};

const ZODIAC_LABEL: Record<ZodiacKind, string> = {
  sidereal: 'sideral',
  tropical: 'tropical',
};

const LANGUAGE_LABEL: Record<AppLanguage, string> = {
  pt: 'português',
  en: 'english',
  es: 'español',
};

type PickerKind = 'house' | 'ayanamsa' | 'zodiac' | 'language';
type InfoKind = 'credits' | 'privacy' | 'terms' | 'version';

const INFO_TEXT: Record<InfoKind, { title: string; body: string }> = {
  version: {
    title: 'versão',
    body:
      'Atma Vedika · MVP 0.1.0\n\n' +
      'Esta versão entrega o esqueleto da experiência: navegação cósmica, mapa védico interativo, cena 3D do céu natal.\n\n' +
      'O cálculo astrológico real (Swiss Ephemeris) e a IA do Veda chegam nas próximas fases.',
  },
  credits: {
    title: 'créditos',
    body:
      'Atma Vedika é construído com a colaboração de várias bibliotecas e tradições:\n\n' +
      '· React Native · Expo · React Native Reanimated · Gesture Handler\n' +
      '· Three.js + React Three Fiber pra cena 3D\n' +
      '· React Native Skia + SVG pros gradientes\n' +
      '· Tipografias Playfair Display + Inter (Google Fonts)\n\n' +
      'A sabedoria carregada vem do Jyotish — a astrologia védica tradicional, com mais de 5000 anos de história.',
  },
  privacy: {
    title: 'privacidade',
    body:
      'Política de Privacidade — Atma Vedika\n\nÚltima atualização: 2026.\n\n— O QUE COLETAMOS —\n\nPra calcular seu mapa natal, precisamos de:\n\n· nome (apenas pra personalizar a experiência)\n· data de nascimento\n· hora de nascimento\n· cidade de nascimento\n\nEsses dados ficam armazenados localmente no seu aparelho via AsyncStorage. Não saem dele sem você decidir.\n\n— O QUE NÃO FAZEMOS —\n\n· Não vendemos seus dados pra anunciantes.\n· Não compartilhamos com terceiros sem consentimento explícito.\n· Não rastreamos sua localização contínua.\n· Não acessamos seu microfone, câmera ou contatos.\n\n— QUANDO USAMOS O BACKEND —\n\nNa fase atual (MVP 0.1.0), tudo é processado offline no seu aparelho. Quando o backend entrar:\n\n· Cálculos astrológicos (Swiss Ephemeris) — envio criptografado, sem armazenar.\n· Chat com Veda (IA) — perguntas vão pro provedor de IA (Anthropic) com criptografia TLS. Suas conversas NÃO são usadas pra treinar modelos.\n\n— DIREITOS LGPD —\n\nVocê tem o direito de:\n\n· Acessar todos os seus dados a qualquer momento.\n· Corrigir dados incorretos (use "editar" no Perfil).\n· Apagar tudo permanentemente (use "recomeçar do início" no Perfil).\n· Exportar seus dados (em breve).\n\n— CRIANÇAS —\n\nO app não é destinado a menores de 13 anos. Se você é responsável por uma criança e suspeita que ela usou o app, entre em contato pra deletarmos os dados.\n\n— CONTATO —\n\nQualquer dúvida sobre privacidade: privacidade@atmavedika.app',
  },
  terms: {
    title: 'termos de uso',
    body:
      'Termos de Uso — Atma Vedika\n\nÚltima atualização: 2026.\n\n— NATUREZA DO SERVIÇO —\n\nO Atma Vedika é um aplicativo de entretenimento e desenvolvimento pessoal baseado na tradição da astrologia védica (Jyotish). As leituras, interpretações e sugestões são oferecidas a título informativo e contemplativo — NÃO constituem:\n\n· Diagnóstico médico ou psicológico\n· Aconselhamento financeiro profissional\n· Recomendação jurídica\n· Predição garantida de eventos futuros\n\nDecisões importantes (saúde, finanças, relacionamentos) devem ser tomadas com base em sua própria reflexão e, quando apropriado, com auxílio de profissionais qualificados.\n\n— USO ACEITÁVEL —\n\nAo usar o Atma Vedika, você concorda em:\n\n· Não compartilhar contas\n· Não tentar fazer reverse engineering do app\n· Não usar pra atividades ilegais ou abusivas\n· Respeitar os direitos autorais do conteúdo\n\n— CONTEÚDO PREMIUM —\n\nFuncionalidades premium (em breve) serão cobradas via assinatura mensal/anual. A cobrança será feita pelas lojas oficiais (App Store / Play Store). Cancele a qualquer momento nas configurações da loja.\n\nReembolso segue as políticas da Apple/Google.\n\n— PROPRIEDADE INTELECTUAL —\n\nO conteúdo, design e código do Atma Vedika são propriedade dos seus criadores. Os ensinamentos védicos em si (Jyotish) são patrimônio cultural universal, mas a forma de apresentação aqui é original.\n\n— LIMITAÇÃO DE RESPONSABILIDADE —\n\nO Atma Vedika é fornecido "como está". Os criadores não se responsabilizam por:\n\n· Decisões tomadas com base nas leituras\n· Interrupções temporárias do serviço\n· Perda de dados em caso de uninstall\n\n— ALTERAÇÕES —\n\nEsses termos podem ser atualizados. Mudanças significativas serão comunicadas no app.\n\n— LEI APLICÁVEL —\n\nEstes termos seguem a legislação brasileira. Foro: comarca de São Paulo, SP.',
  },
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const chart = useUserStore((s) => s.birthChart) ?? mockBirthChart;
  const settings = useUserStore((s) => s.settings);
  const setSetting = useUserStore((s) => s.setSetting);
  const resetOnboarding = useUserStore((s) => s.resetOnboarding);
  const prefillOnboardingFromChart = useUserStore(
    (s) => s.prefillOnboardingFromChart,
  );

  const [activePicker, setActivePicker] = useState<PickerKind | null>(null);
  const [activeInfo, setActiveInfo] = useState<InfoKind | null>(null);
  const dismissGestureHint = useUserStore((s) => s.dismissGestureHint);

  // Reabre o hint do gesto na próxima abertura da Home.
  const replayHint = () => {
    // dismissGestureHint marca como true — fazemos o inverso aqui via raw set
    useUserStore.setState({ hasSeenGestureHint: false });
    // Volta pro Home pra ver o hint
    router.push('/(app)/home');
  };

  void dismissGestureHint;

  return (
    <CosmicBackground glowIntensity={0.35} vignettes>
      <PulsingGlow size={420} color={palette.gold.deep} intensity={0.16} top="22%" />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: TAB_BAR_HEIGHT + insets.bottom + spacing.xxl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Identidade */}
          <View style={styles.identity}>
            <Text variant="ritual" color={semantic.textGold} align="center">
              ✦  perfil  ✦
            </Text>
            <View style={{ height: spacing.sm }} />
            <Text variant="display" color={semantic.textPrimary} align="center">
              {chart.userName}
            </Text>
            <View style={{ height: spacing.md }} />
            <Text variant="caption" color={semantic.textTertiary} align="center">
              {formatDate(chart.birthDate)} · {chart.birthTime} · {chart.birthPlace}
            </Text>
          </View>

          <View style={styles.statsRow}>
            <Stat label="ascendente" value={SIGN_PT[chart.ascendant] ?? chart.ascendant} />
            <View style={styles.statsDivider} />
            <Stat label="sol" value={SIGN_PT[chart.planets.Sun.sign] ?? chart.planets.Sun.sign} />
            <View style={styles.statsDivider} />
            <Stat label="lua" value={chart.moonNakshatra.name} />
          </View>

          <SettingSection title="conta" index={0}>
            <SettingRow
              label="dados de nascimento"
              value="editar"
              onPress={() => {
                prefillOnboardingFromChart();
                router.push('/onboarding/birth-data');
              }}
            />
            <SettingRow
              label="comparar com alguém"
              value="conexões"
              onPress={() => router.push('/(app)/compatibility')}
            />
            <SettingRow
              label="recomeçar do início"
              value="apagar tudo"
              destructive
              onPress={() => {
                resetOnboarding();
                router.replace('/');
              }}
              isLast
            />
          </SettingSection>

          <SettingSection title="astrologia" index={1}>
            <SettingRow
              label="sistema de casas"
              value={HOUSE_LABEL[settings.houseSystem]}
              onPress={() => setActivePicker('house')}
            />
            <SettingRow
              label="ayanamsa"
              value={AYANAMSA_LABEL[settings.ayanamsa]}
              onPress={() => setActivePicker('ayanamsa')}
            />
            <SettingRow
              label="zodíaco"
              value={ZODIAC_LABEL[settings.zodiac]}
              onPress={() => setActivePicker('zodiac')}
              isLast
            />
          </SettingSection>

          <SettingSection title="preferências" index={2}>
            <SettingToggle
              label="leitura diária"
              caption="notificação ao nascer do sol"
              value={settings.dailyNotifications}
              onValueChange={(v) => setSetting('dailyNotifications', v)}
            />
            <SettingRow
              label="idioma"
              value={LANGUAGE_LABEL[settings.language]}
              onPress={() => setActivePicker('language')}
            />
            <SettingRow label="tema" value="cósmico" />
            <SettingRow
              label="ver tutorial novamente"
              value="abrir no Mapa"
              onPress={replayHint}
              isLast
            />
          </SettingSection>

          <SettingSection title="sobre" index={3}>
            <SettingRow
              label="versão"
              value="0.1.0"
              onPress={() => setActiveInfo('version')}
            />
            <SettingRow
              label="créditos"
              value="ver"
              onPress={() => setActiveInfo('credits')}
            />
            <SettingRow
              label="privacidade"
              value="ler"
              onPress={() => setActiveInfo('privacy')}
            />
            <SettingRow
              label="termos de uso"
              value="ler"
              onPress={() => setActiveInfo('terms')}
              isLast
            />
          </SettingSection>

          <View style={styles.signOff}>
            <View style={styles.divider} />
            <Text variant="caption" color={semantic.textTertiary} align="center">
              feito com céu, gold e código.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Pickers */}
      <OptionPickerSheet
        visible={activePicker === 'house'}
        title="sistema de casas"
        subtitle="como o céu é dividido em 12 áreas da vida."
        options={HOUSE_OPTIONS}
        selected={settings.houseSystem}
        onSelect={(v) => setSetting('houseSystem', v)}
        onDismiss={() => setActivePicker(null)}
      />
      <OptionPickerSheet
        visible={activePicker === 'ayanamsa'}
        title="ayanamsa"
        subtitle="o ângulo de correção entre o céu fixo e o tropical."
        options={AYANAMSA_OPTIONS}
        selected={settings.ayanamsa}
        onSelect={(v) => setSetting('ayanamsa', v)}
        onDismiss={() => setActivePicker(null)}
      />
      <OptionPickerSheet
        visible={activePicker === 'zodiac'}
        title="zodíaco"
        subtitle="referencial astronômico do mapa."
        options={ZODIAC_OPTIONS}
        selected={settings.zodiac}
        onSelect={(v) => setSetting('zodiac', v)}
        onDismiss={() => setActivePicker(null)}
      />
      <OptionPickerSheet
        visible={activePicker === 'language'}
        title="idioma"
        options={LANGUAGE_OPTIONS}
        selected={settings.language}
        onSelect={(v) => setSetting('language', v)}
        onDismiss={() => setActivePicker(null)}
      />

      {/* Info sheets */}
      <InfoSheet
        visible={activeInfo === 'version'}
        title={INFO_TEXT.version.title}
        body={INFO_TEXT.version.body}
        onDismiss={() => setActiveInfo(null)}
      />
      <InfoSheet
        visible={activeInfo === 'credits'}
        title={INFO_TEXT.credits.title}
        body={INFO_TEXT.credits.body}
        onDismiss={() => setActiveInfo(null)}
      />
      <InfoSheet
        visible={activeInfo === 'privacy'}
        title={INFO_TEXT.privacy.title}
        body={INFO_TEXT.privacy.body}
        onDismiss={() => setActiveInfo(null)}
      />
      <InfoSheet
        visible={activeInfo === 'terms'}
        title={INFO_TEXT.terms.title}
        body={INFO_TEXT.terms.body}
        onDismiss={() => setActiveInfo(null)}
      />
    </CosmicBackground>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="ritual" color={semantic.textTertiary} align="center">
        {label}
      </Text>
      <View style={{ height: spacing.xs }} />
      <Text variant="heading" color={palette.gold.glow} align="center">
        {value}
      </Text>
    </View>
  );
}

function SettingSection({
  title,
  children,
  index = 0,
}: {
  title: string;
  children: React.ReactNode;
  index?: number;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(14);

  useEffect(() => {
    const delay = 200 + index * 110;
    opacity.value = withDelay(
      delay,
      withTiming(1, {
        duration: 600,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
    );
    translateY.value = withDelay(
      delay,
      withTiming(0, {
        duration: 600,
        easing: Easing.bezier(0.16, 1, 0.3, 1),
      }),
    );
  }, [index, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.section, animatedStyle]}>
      <Text
        variant="ritual"
        color={semantic.textTertiary}
        style={styles.sectionTitle}
      >
        {title}
      </Text>
      <View style={styles.sectionCard}>{children}</View>
    </Animated.View>
  );
}

interface SettingRowProps {
  label: string;
  value?: string;
  destructive?: boolean;
  onPress?: () => void;
  isLast?: boolean;
}

function SettingRow({
  label,
  value,
  destructive,
  onPress,
  isLast,
}: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.row,
        isLast && styles.rowLast,
        pressed && onPress && styles.rowPressed,
      ]}
    >
      <Text
        variant="bodyEmphasis"
        color={destructive ? palette.ember.rose : semantic.textPrimary}
        style={styles.rowLabel}
      >
        {label}
      </Text>
      <View style={styles.rowRight}>
        {value ? (
          <Text variant="caption" color={semantic.textTertiary}>
            {value}
          </Text>
        ) : null}
        {onPress ? <Text style={styles.chevron}>›</Text> : null}
      </View>
    </Pressable>
  );
}

interface SettingToggleProps {
  label: string;
  caption?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}

function SettingToggle({
  label,
  caption,
  value,
  onValueChange,
}: SettingToggleProps) {
  return (
    <View style={styles.row}>
      <View style={styles.rowLabelGroup}>
        <Text variant="bodyEmphasis" color={semantic.textPrimary}>
          {label}
        </Text>
        {caption ? (
          <>
            <View style={{ height: 2 }} />
            <Text variant="caption" color={semantic.textTertiary}>
              {caption}
            </Text>
          </>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: palette.silver.breath, true: palette.gold.deep }}
        thumbColor={value ? palette.gold.glow : palette.silver.muted}
      />
    </View>
  );
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.xl,
  },
  identity: {
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: spacing.xxxl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(212,175,55,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.22)',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statsDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: palette.silver.breath,
  },
  section: {
    marginTop: spacing.xxxl,
  },
  sectionTitle: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionCard: {
    borderRadius: radii.lg,
    backgroundColor: 'rgba(11,8,32,0.55)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(212,175,55,0.18)',
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(245,244,240,0.06)',
    minHeight: 56,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowPressed: {
    backgroundColor: 'rgba(212,175,55,0.05)',
  },
  rowLabel: {
    flex: 1,
  },
  rowLabelGroup: {
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  chevron: {
    fontSize: 18,
    color: palette.silver.muted,
    opacity: 0.5,
  },
  signOff: {
    marginTop: spacing.xxxl,
    alignItems: 'center',
  },
  divider: {
    width: 32,
    height: 1,
    backgroundColor: palette.gold.deep,
    marginBottom: spacing.sm,
    opacity: 0.6,
  },
});
