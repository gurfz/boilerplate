import Purchases from 'react-native-purchases';
import PurchasesUI from 'react-native-purchases-ui';

export const checkPremium = async () => {
  const info = await Purchases.getCustomerInfo();
  return !!info.entitlements.active['premium_access'];
};

export const showPaywall = async () => {
  const result = await PurchasesUI.presentPaywall();
  return !!result?.customerInfo?.entitlements?.active['premium_access'];
};