import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GradientButton } from '@components/button';
import { AuthService } from '@app/services';

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

export default class ForgotPasswordScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Lấy Lại Mật Khẩu',
  })
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      TextInputPhone: '',
      TextInputEmail: '',
    };
  }
  callForgotPassword=(phone) => {
    this.setState({
      isLoading: true,
    });
    AuthService.forgotPassword(phone)
      .then(() => this.confirmDialog())
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        Alert.alert('Lỗi', error.message);
      });
  }
  confirmDialog = () => {
    this.setState({
      isLoading: false,
    });
    Alert.alert(
      '',
      'Mật khẩu mới đã được gửi vào email của bạn!', [
        { text: 'OK', onPress: () => this.props.navigation.navigate('Login') },
      ],
      { cancelable: false },
    );
  }
  validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
  validateInput = () => {
    const { TextInputPhone, TextInputEmail } = this.state;
    if (TextInputPhone === '') {
      Alert.alert('Hãy nhập số điện thoại!');
    } else if (TextInputPhone.length < 9) {
      Alert.alert('Số điện thoại không hợp lệ!');
    } else if (TextInputEmail === '') {
      Alert.alert('Hãy nhập email!');
    } else if (!this.validateEmail(TextInputEmail)) {
      Alert.alert('Email không đúng!');
    } else {
      this.callForgotPassword(TextInputPhone);
    }
  }
  render() {
    const indicator = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
    if (this.state.isLoading) {
      return indicator;
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('../../assets/images/auth/logo.png')} style={{ marginVertical: 32 }} />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
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
            returnKeyType="next"
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
            onSubmitEditing={this.submit}
            blurOnSubmit={false}
          />
          <GradientButton btnText="Xác Nhận" btnOnPress={this.validateInput} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
