import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
  Image,
  Platform,
} from 'react-native';
import { UserService } from '@app/services';

export default class SplashScreen extends React.Component {
  constructor(props) {
    super(props);
    this.bootstrapAsync();
  }

  bootstrapAsync = async () => {
    const isUserAuthenticated = await global.Session.isUserAuthenticated();
    if (isUserAuthenticated) {
      UserService.getProfile()
        .then((user) => {
          global.Session.login(user);
          this.props.navigation.navigate('App');
        })
        .catch(() => {
          global.Session.logout();
        });
    } else {
      setTimeout(() => this.props.navigation.navigate('Auth'), 1000);
    }
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../../assets/images/splash/bg_splash.png')} resizeMode="cover" />
        <ActivityIndicator style={{ position: 'absolute', top: 0, bottom: -64 }} />
        <StatusBar barStyle={Platform.OS === 'ios' ? 'default' : 'light-content'} backgroundColor="#f8971b" />
      </View>
    );
  }
}
