import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import SupportItem from '@app/components/support/SupportItem.js';
import { AppColors } from '@app/config';
import { AuthService } from '@app/services';
import { LinearGradient, Constants } from 'expo';
import AppConfig from '../../config/AppConfig';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  textStyle: {
    color: AppColors.primaryDark,
    fontSize: 18,
    marginTop: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  containerStyle: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    paddingTop: 15,
  },
  buttonStyle: {
    marginVertical: 10,
    width: windowWidth - 40,
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

class SupportScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Hỗ Trợ',
  })
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }
  callLogout = () => {
    this.setState({
      isLoading: true,
    });
    AuthService.logout().finally(() => {
      this.setState({
        isLoading: false,
      });
      global.Session.logout();
    });
  }
  confirmDialog = () => {
    Alert.alert(
      '',
      'Bạn chắc chắn muốn đăng xuất?', [
        { text: 'Không' },
        { text: 'Có, Đăng Xuất', onPress: () => this.callLogout() },
      ],
      { cancelable: true },
    );
  }
  openUrl = url => Linking.openURL(url).then(() => {}).catch(() => {})

  render() {
    const button = (
      <TouchableOpacity onPress={this.confirmDialog}>
        <LinearGradient
          colors={[AppColors.primaryDark, AppColors.primaryLight]}
          style={styles.buttonStyle}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.buttonText}>
            Đăng Xuất
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
    const indicator = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
    return (
      <View style={styles.containerStyle}>
        <Image source={require('../../assets/images/auth/logo.png')} />
        <Text style={styles.textStyle}>
          NHA KHOA VIỆT ÚC
        </Text>
        <Text style={{
          color: AppColors.primaryDark,
          fontSize: 15,
          textAlign: 'center',
          marginBottom: 15,
        }}
        >
          Nơi cung cấp dịch vụ chăm sóc và điều trị răng miệng tốt nhất
        </Text>
        <SupportItem
          itemText="Website"
          itemUrl="www.nhakhoavietuc.com"
          itemIcon={require('../../assets/images/support/support_website.png')}
          itemPress={() => this.openUrl('http://nhakhoavietuc.com')}
        />
        <SupportItem
          itemText="Fanpage"
          itemUrl="www.facebook.com/nhakhoavietuc"
          itemIcon={require('../../assets/images/support/support_fanpage.png')}
          itemPress={() => this.openUrl('https://www.facebook.com/nhakhoavietuc')}
        />
        <SupportItem
          itemText="Liên hệ và tư vấn"
          itemUrl="+84945699990"
          itemIcon={require('../../assets/images/support/support_phone.png')}
          itemPress={() => this.openUrl('tel:+84945699990')}
        />
        <SupportItem
          itemText="Email"
          itemUrl="nhakhoavietuc@gmail.com"
          itemIcon={require('../../assets/images/support/support_email.png')}
          itemPress={() => this.openUrl('mailto:nhakhoavietuc@gmail.com')}
        />
        <Text style={{ color: 'gray', marginVertical: 12 }}>Version {Constants.manifest.version}{AppConfig.versionSuffix}</Text>
        <View style={{
          position: 'absolute',
          bottom: 0,
          alignItems: 'center',
          height: 70,
        }}
        >
          {this.state.isLoading ? indicator : button}
        </View>
      </View>
    );
  }
}

export default SupportScreen;
