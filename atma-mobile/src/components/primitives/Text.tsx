/**
 * Atma Vedika — Text primitive
 *
 * Wrapper sobre RN.Text com tokens do design system tipados.
 */

import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { semantic } from '@/theme/colors';
import { textStyles, type TextStyleName } from '@/theme/typography';

export interface TextProps extends RNTextProps {
  variant?: TextStyleName;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export function Text({
  variant = 'body',
  color = semantic.textPrimary,
  align = 'left',
  style,
  ...rest
}: TextProps) {
  return (
    <RNText
      style={[textStyles[variant], { color, textAlign: align }, style]}
      {...rest}
    />
  );
}
