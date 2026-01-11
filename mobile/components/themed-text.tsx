import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  // Use provided color or default to theme colors
  const color = lightColor || darkColor || (type === 'link' ? Colors.primary : Colors.textPrimary);

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400', // Regular weight for body
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500', // Medium weight
  },
  title: {
    fontSize: 32,
    fontWeight: '500', // Medium weight for headings (not bold)
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500', // Medium weight for headings
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: Colors.primary, // Use primary blue for links
  },
});
