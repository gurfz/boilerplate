import Purchases from '@revenuecat/purchases-js';

let initialized = false;

const init = async () => {
  if (initialized) return;
  await Purchases.configure("rcb_sb_ZiQKhOxludWeUlPrYqesfCdTX"); // From RevenueCat dashboard
  initialized = true;
};

export const checkPremium = async () => {
  await init();
  const info = await Purchases.getCustomerInfo();
  return !!info.entitlements.active['premium_access'];
};

export const showPaywall = async () => {
  await init();
  // Option 1: Hosted paywall (easiest)
  window.location.href = "https://app.revenuecat.com/paywall?project_id=entl4bfce8a87e";
  // Option 2: Embedded paywall (advanced – use RevenueCat's hosted or custom)
  return false; // Status updates on reload
};