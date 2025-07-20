import { NativeModules } from 'react-native';

const { InstalledApps } = NativeModules;

export const fetchInstalledApps = async () => {
  try {
    const apps = await InstalledApps.getInstalledApps();
    return apps; // array of { name, package }
  } catch (e) {
    console.error('Error fetching installed apps:', e);
    return [];
  }
};
