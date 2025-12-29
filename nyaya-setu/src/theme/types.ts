import { MD3Theme } from 'react-native-paper';

export type CustomColors = MD3Theme['colors'] & {
  success: string;
  info: string;
  warning: string;
};

export type CustomTheme = Omit<MD3Theme, 'colors'> & {
  colors: CustomColors;
};
