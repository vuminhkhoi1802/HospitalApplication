import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppColors } from '@app/config';
import { AuthService, UserService } from '@app/services';
import { GradientButton } from '@components/button';
import AppConfig from '../../config/AppConfig';

const styles = StyleSheet.create({
  input: {
    height: 34,
    width: 230,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: AppColors.primary,
    borderWidth: 1,
    fontSize: 16,
  },
});

class LoginScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Đăng Nhập',
  })

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      TextInputPhone: '',
      TextInputPassword: '',
    };
  }

  callLogin = async (phone, password) => {
    global.Session.logout();
    this.setState({
      isLoading: true,
    });
    AuthService.login(phone, password)
      .then(async (token) => {
        await AsyncStorage.setItem('com.beestromed.camellia.accessToken', token.access_token);
        return UserService.getProfile();
      })
      .then((user) => {
        global.Session.login(user);
        this.props.navigation.navigate('App');
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        Alert.alert('Lỗi', error.message);
        global.Session.logout();
      });
  }

  validateInput = () => {
    const { TextInputPhone, TextInputPassword } = this.state;
    if (!TextInputPhone) {
      Alert.alert('Hãy nhập số điện thoại!');
    } else if (TextInputPhone.length < 9) {
      Alert.alert('Số điện thoại không hợp lệ!');
    } else if (!TextInputPassword) {
      Alert.alert('Hãy nhập mật khẩu!');
    } else if (TextInputPassword.length < 6) {
      Alert.alert('Mật khẩu phải có ít nhất 6 kí tự!');
    } else {
      this.callLogin(TextInputPhone, TextInputPassword);
    }
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
          <StatusBar barStyle="light-content" backgroundColor="#f8971b" />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../../assets/images/auth/logo.png')} style={{ marginVertical: 32 }} />
        <KeyboardAwareScrollView
          style={{ flex: 1, alignSelf: 'stretch' }}
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
          keyboardShouldPersistTaps="never"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            style={styles.input}
            value={this.state.TextInputPhone}
            onChangeText={TextInputPhone => this.setState({ TextInputPhone })}
            ref={(ref) => { this.TextInputPhone = ref; }}
            placeholder="Số điện thoại"
            autoFocus
            autoCorrect
            maxLength={14}
            underlineColorAndroid="rgba(0,0,0,0)"
            keyboardType="phone-pad"
            onSubmitEditing={() => { this.TextInputPassword.focus(); }}
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.input}
            value={this.state.TextInputPassword}
            onChangeText={TextInputPassword => this.setState({ TextInputPassword })}
            ref={(ref) => { this.TextInputPassword = ref; }}
            placeholder="Mật khẩu"
            autoCapitalize="none"
            underlineColorAndroid="rgba(0,0,0,0)"
            secureTextEntry
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="send"
            onSubmitEditing={this.submit}
            blurOnSubmit
          />
          <GradientButton btnText="Đăng Nhập" btnOnPress={this.validateInput} />
          <GradientButton btnText="Đăng Ký" btnOnPress={() => this.props.navigation.navigate('Register')} />
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')} style={{ alignItems: 'center' }}>
            <Text style={{ padding: 20 }}>
              Quên mật khẩu?
            </Text>
          </TouchableOpacity>
          <Text style={{ padding: 20 }}>{AppConfig.versionSuffix}</Text>
        </KeyboardAwareScrollView>
        <StatusBar barStyle="light-content" backgroundColor="#f8971b" />
      </View>
    );
  }
}

export default LoginScreen;
