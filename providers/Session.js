import { AsyncStorage } from 'react-native';
import { Permissions, Notifications, Constants } from 'expo';
import { NavigationActions } from 'react-navigation';
import { PushService } from '@app/services';
import { navigatorRef } from '../App';

function isCurrentRouteMatch(navState, matcher) {
  const { index } = navState;
  if (index < navState.routes.length && index >= 0) {
    return navState.routes[index].routeName === matcher;
  }
  return false;
}

global.Session = {
  user: null,
  isUserAuthenticated: async () => {
    const token = await AsyncStorage.getItem('com.beestromed.camellia.accessToken');
    console.log(`[APP] Token: ${token}`);
    return token;
  },
  login: (user) => {
    global.Session.user = user;
    global.Session.registerForPush();
  },
  logout: async () => {
    await AsyncStorage.removeItem('com.beestromed.camellia.accessToken');
    if (!isCurrentRouteMatch(navigatorRef.state.nav, 'Auth')) {
      navigatorRef.dispatch(NavigationActions.navigate({ routeName: 'Auth' }));
    }
  },
  wakeup: async () => {
    Notifications.setBadgeNumberAsync(0).then(() => {}).catch(() => {});
  },
  registerForPush: async () => {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
    if (!Constants.isDevice) {
      return;
    }

    // Get the token that uniquely identifies this device
    const isUserAuthenticated = await global.Session.isUserAuthenticated();
    const token = await Notifications.getExpoPushTokenAsync();
    console.log(`[PUSH] Device: ${token}`);
    if (isUserAuthenticated && token) { PushService.registerDevice(token); }
  },
};

export default global.Session;
