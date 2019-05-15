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
import { UserService } from '@app/services';

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

export default class ChangePasswordScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Đổi Mật Khẩu',
  })
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      TextInputCurrentPassword: '',
      TextInputPassword: '',
      TextInputRePassword: '',
    };
  }
  callChangePassword=(oldPassword, newPassword) => {
    this.setState({
      isLoading: true,
    });
    UserService.updateProfile(oldPassword, newPassword)
      .then(() => this.changePasswordSuccess())
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        Alert.alert('Lỗi', error.message);
      });
  }
  changePasswordSuccess = () => {
    Alert.alert(
      '',
      'Đổi mật khẩu thành công', [
        { text: 'OK', onPress: () => this.props.navigation.goBack(null) },
      ],
      { cancelable: false },
    );
    this.setState({
      isLoading: false,
    });
  }
  validateInput = () => {
    const { TextInputCurrentPassword, TextInputPassword, TextInputRePassword } = this.state;
    if (!TextInputCurrentPassword) {
      Alert.alert('Hãy nhập mật khẩu hiện tại!');
    } else if (!TextInputPassword) {
      Alert.alert('Hãy nhập mật khẩu mới!');
    } else if (TextInputPassword.length < 6) {
      Alert.alert('Mật khẩu mới phải có ít nhất 6 kí tự!');
    } else if (TextInputPassword !== TextInputRePassword) {
      Alert.alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
    } else {
      this.callChangePassword(TextInputCurrentPassword, TextInputPassword);
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
            value={this.state.TextInputCurrentPassword}
            onChangeText={TextInputCurrentPassword => this.setState({ TextInputCurrentPassword })}
            ref={(ref) => { this.TextInputPassword = ref; }}
            placeholder="Mật khẩu hiện tại"
            autoCapitalize="none"
            autoFocus
            secureTextEntry
            autoCorrect={false}
            underlineColorAndroid="rgba(0,0,0,0)"
            keyboardType="default"
            returnKeyType="next"
            onSubmitEditing={() => { this.TextInputPassword.focus(); }}
            blurOnSubmit={false}
          />
          <TextInput
            style={styles.input}
            value={this.state.TextInputPassword}
            onChangeText={TextInputPassword => this.setState({ TextInputPassword })}
            ref={(ref) => { this.TextInputPassword = ref; }}
            placeholder="Mật khẩu mới"
            autoCapitalize="none"
            underlineColorAndroid="rgba(0,0,0,0)"
            secureTextEntry
            autoCorrect={false}
            keyboardType="default"
            returnKeyType="next"
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
            returnKeyType="send"
            onSubmitEditing={this.submit}
            blurOnSubmit
          />
          <GradientButton btnText="Xác Nhận" btnOnPress={this.validateInput} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
