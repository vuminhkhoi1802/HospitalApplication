import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GradientButton } from '@components/button';
import { AuthService, UserService } from '@app/services';

const styles = StyleSheet.create({
  input: {
    height: 34,
    width: 230,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#f8971b',
    borderWidth: 1,
    fontSize: 16,
  },
});

class RegisterScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Đăng Ký',
  })
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      TextInputName: '',
      TextInputPhone: '',
      TextInputEmail: '',
      TextInputPassword: '',
      TextInputRePassword: '',
    };
  }
  callRegister=(phone, password, email, fullName) => {
    this.setState({
      isLoading: true,
    });
    AuthService.register(phone, password, email, fullName)
      .then(() => this.confirmDialog(phone, password))
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        Alert.alert('Lỗi', error.message);
      });
  }
  callLogin = (phone, password) => {
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
        this.props.navigation.navigate('UploadAvatar');
        // this.props.navigation.navigate('App');
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        Alert.alert('Lỗi', error.message);
        global.Session.logout();
      });
  }
  confirmDialog = (phone, password) => {
    Alert.alert(
      '',
      'Đăng ký tài khoản thành công!', [
        { text: 'OK', onPress: () => this.callLogin(phone, password) },
      ],
      { cancelable: false },
    );
  }
  validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  validateInput = () => {
    const {
      TextInputPhone,
      TextInputEmail,
      TextInputName,
      TextInputPassword,
      TextInputRePassword,
    } = this.state;
    if (TextInputPhone === '') {
      Alert.alert('Hãy nhập số điện thoại!');
    } else if (TextInputPhone.length < 10) {
      Alert.alert('Số điện thoại không hợp lệ!');
    } else if (TextInputName === '') {
      Alert.alert('Hãy nhập họ tên!');
    } else if (TextInputEmail === '') {
      Alert.alert('Hãy nhập email!');
    } else if (!this.validateEmail(TextInputEmail)) {
      Alert.alert('Email không đúng!');
    } else if (TextInputPassword.length < 6) {
      Alert.alert('Mật khẩu phải có ít nhất 6 kí tự!');
    } else if (TextInputPassword !== TextInputRePassword) {
      Alert.alert('Mật khẩu và xác nhận mật khẩu không khớp!');
    } else {
      this.callRegister(TextInputPhone, TextInputPassword, TextInputEmail, TextInputName);
    }
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../../assets/images/auth/logo.png')} style={{ marginVertical: 32 }} />
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, alignSelf: 'stretch' }}
          contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
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
            onSubmitEditing={() => { this.TextInputName.focus(); }}
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.input}
            value={this.state.TextInputName}
            onChangeText={TextInputName => this.setState({ TextInputName })}
            ref={(ref) => { this.TextInputName = ref; }}
            placeholder="Họ tên"
            autoCorrect
            underlineColorAndroid="rgba(0,0,0,0)"
            keyboardType="default"
            onSubmitEditing={() => { this.TextInputEmail.focus(); }}
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.input}
            value={this.state.TextInputEmail}
            onChangeText={TextInputEmail => this.setState({ TextInputEmail })}
            ref={(ref) => { this.TextInputEmail = ref; }}
            placeholder="Email"
            autoCorrect
            underlineColorAndroid="rgba(0,0,0,0)"
            keyboardType="email-address"
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
            onSubmitEditing={() => { this.TextInputRePassword.focus(); }}
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.input}
            value={this.state.TextInputRePassword}
            onChangeText={TextInputRePassword => this.setState({ TextInputRePassword })}
            ref={(ref) => { this.TextInputRePassword = ref; }}
            placeholder="Xác nhận mật khẩu"
            autoCapitalize="none"
            underlineColorAndroid="rgba(0,0,0,0)"
            secureTextEntry
            autoCorrect={false}
            keyboardType="default"
            onSubmitEditing={this.submit}
            blurOnSubmit
          />
          <GradientButton btnText="Đăng Ký" btnOnPress={this.validateInput} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default RegisterScreen;
