import React from 'react';
import { StatusBar, Alert } from 'react-native';
import { Notifications } from 'expo';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { EventRegister } from 'react-native-event-listeners';
import {
  AuthNavigator,
  AppNavigator,
} from '@app/navigation';
import SplashScreen from '@screens/splash';
import { ProviderPhotoViewScreen } from '@screens/provider';
import Session from './providers/Session';
import NotificationHandler from './screens/notification/NotificationHandler';

export let navigatorRef; //eslint-disable-line

Session.wakeup();

const RootStack = createSwitchNavigator(
  {
    Splash: SplashScreen,
    Auth: AuthNavigator,
    App: AppNavigator,
  },
  {
    initialRouteName: 'Splash',
  },
);

const RootWithModalStack = createStackNavigator(
  {
    Root: RootStack,
    ProviderPhotoView: ProviderPhotoViewScreen,
  },
  {
    mode: 'modal',
    headerMode: 'none',
  },
);

export default class App extends React.Component {
  static async handleNotification(notification) {
    console.log(`[PUSH] Received: ${JSON.stringify(notification)}`);
    const isUserAuthenticated = await global.Session.isUserAuthenticated();
    if (isUserAuthenticated) {
      if (notification.origin === 'selected') {
        NotificationHandler.handleNotification(notification, true);
      } else if (notification.origin === 'received') {
        Alert.alert('Thông Báo', notification.data.content, [
          {
            text: 'Xem',
            onPress: () => NotificationHandler.handleNotification(notification, true),
          },
          {
            text: 'Bỏ Qua',
            onPress: () => EventRegister.emit('notification_Updated'),
          },
        ]);
      }
    }
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
    navigatorRef = this.navigator;
    this.notificationSubscription = Notifications.addListener(App.handleNotification);
  }

  render() {
    return <RootWithModalStack ref={(nav) => { this.navigator = nav; }} />;
  }
}
