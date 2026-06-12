/**
 * Atma Vedika — Onboarding · Birth Data
 *
 * Uma tela com 4 sub-perguntas (nome, data, hora, local) que se sucedem
 * com transição horizontal tipo TikTok. Cada sub-step é uma respiração.
 */

import { useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/primitives/Text';
import { SacredButton } from '@/components/primitives/SacredButton';
import { SacredInput } from '@/components/primitives/SacredInput';
import { OnboardingShell } from '@/features/onboarding/OnboardingShell';
import { useUserStore, type OnboardingFormData } from '@/store/userStore';
import { palette, semantic } from '@/theme/colors';
import { duration } from '@/theme/motion';
import { spacing } from '@/theme/spacing';

type FieldKey = keyof OnboardingFormData;

interface Step {
  key: FieldKey;
  ritual: string;
  question: string;
  label: string;
  placeholder: string;
  mask?: 'date' | 'time';
  validate: (value: string) => boolean;
  keyboardType?: 'default' | 'number-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words';
}

const STEPS: Step[] = [
  {
    key: 'name',
    ritual: 'Como o céu deve te chamar?',
    question: 'Seu nome.',
    label: 'nome',
    placeholder: '',
    validate: (v) => v.trim().length >= 2,
    autoCapitalize: 'words',
  },
  {
    key: 'birthDate',
    ritual: 'O dia em que o céu se abriu',
    question: 'Sua data\nde nascimento.',
    label: 'dd / mm / aaaa',
    placeholder: '',
    mask: 'date',
    validate: (v) => /^\d{2}\/\d{2}\/\d{4}$/.test(v),
  },
  {
    key: 'birthTime',
    ritual: 'A hora exata do primeiro respiro',
    question: 'A hora\ndo seu primeiro\nrespiro.',
    label: 'hh : mm',
    placeholder: '',
    mask: 'time',
    validate: (v) => /^\d{2}:\d{2}$/.test(v),
  },
  {
    key: 'birthPlace',
    ritual: 'Onde a terra te recebeu',
    question: 'A cidade\nonde você nasceu.',
    label: 'cidade, estado',
    placeholder: '',
    validate: (v) => v.trim().length >= 3,
    autoCapitalize: 'words',
  },
];

export default function BirthDataScreen() {
  const router = useRouter();
  const onboarding = useUserStore((s) => s.onboarding);
  const setField = useUserStore((s) => s.setOnboardingField);

  const [index, setIndex] = useState(0);
  const step = STEPS[index];

  const value = onboarding[step.key];
  const isValid = useMemo(() => step.validate(value), [step, value]);

  // ─── Transição horizontal entre sub-steps ────────────
  const slide = useSharedValue(0);
  const fade = useSharedValue(1);

  useEffect(() => {
    // Entrada do step (slide vem da direita)
    slide.value = 40;
    fade.value = 0;
    slide.value = withTiming(0, {
      duration: duration.smooth,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    fade.value = withTiming(1, { duration: duration.smooth });
  }, [index, slide, fade]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ translateX: slide.value }],
  }));

  const handleAdvance = () => {
    Keyboard.dismiss();
    if (index < STEPS.length - 1) {
      Haptics.selectionAsync().catch(() => {});
      setIndex(index + 1);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      router.replace('/onboarding/calculating');
    }
  };

  const handleBack = () => {
    Keyboard.dismiss();
    if (index > 0) {
      Haptics.selectionAsync().catch(() => {});
      setIndex(index - 1);
    } else {
      router.back();
    }
  };

  return (
    <OnboardingShell
      footer={
        <SacredButton
          label={index === STEPS.length - 1 ? 'calcular meu mapa' : 'continuar'}
          disabled={!isValid}
          breathing={isValid}
          onPress={handleAdvance}
        />
      }
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.topBar}>
          <Pressable onPress={handleBack} hitSlop={20} style={styles.backBtn}>
            <Text variant="ritual" color={semantic.textTertiary}>
              {'‹  voltar'}
            </Text>
          </Pressable>
          <View style={styles.subStepRow}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.subDot,
                  i === index && styles.subDotActive,
                  i < index && styles.subDotPast,
                ]}
              />
            ))}
          </View>
        </View>

        <Animated.View style={[styles.body, contentStyle]}>
          <View style={styles.spacer} />
          <Text variant="ritual" color={semantic.textGold} align="left">
            {step.ritual}
          </Text>
          <View style={styles.gap} />
          <Text variant="hero" color={semantic.textPrimary} align="left">
            {step.question}
          </Text>

          <View style={styles.gapLarge} />

          <SacredInput
            label={step.label}
            placeholder={step.placeholder}
            value={value}
            onChangeText={(t) => setField(step.key, t)}
            mask={step.mask}
            autoCapitalize={step.autoCapitalize}
            autoCorrect={false}
            autoFocusOnMount
            returnKeyType={index === STEPS.length - 1 ? 'done' : 'next'}
            onSubmitEditing={() => {
              if (isValid) handleAdvance();
            }}
          />

          <View style={styles.spacer} />
        </Animated.View>
      </KeyboardAvoidingView>
    </OnboardingShell>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
  },
  backBtn: {
    paddingVertical: spacing.xs,
    paddingRight: spacing.md,
  },
  subStepRow: {
    flexDirection: 'row',
    gap: 6,
  },
  subDot: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: palette.silver.breath,
  },
  subDotActive: {
    width: 18,
    backgroundColor: palette.gold.glow,
  },
  subDotPast: {
    backgroundColor: palette.gold.deep,
    opacity: 0.7,
  },
  body: {
    flex: 1,
  },
  spacer: { flex: 1 },
  gap: { height: spacing.md },
  gapLarge: { height: spacing.cosmic },
});
