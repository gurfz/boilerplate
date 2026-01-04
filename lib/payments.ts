import { Platform } from 'react-native';

export * from Platform.select({
  web: './payments.web',
  default: './payments.native',
})!;