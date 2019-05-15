import React from 'react';
import {
  Image,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  ImagePicker,
  LinearGradient,
  Permissions,
} from 'expo';
import { AppColors } from '@app/config';
import { AuthService } from '@app/services';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
  },
  buttonStyle: {
    marginVertical: 10,
    width: windowWidth - 20,
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
class UploadAvatarScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Chọn hình đại diện',
  })
  state = {
    image: null,
    isLoading: false,
  };

  hasPermissions = Promise.all([
    Permissions.askAsync(Permissions.CAMERA),
    Permissions.askAsync(Permissions.CAMERA_ROLL),
  ]).then(r => r.filter(o => o.status === 'granted'))
    .then(permissions => {
      if (permissions.length !== 2) {
        return new Error('Camera & Camera Roll Permissions Required');
      }
      console.log({ permissions });
      return true;
    });

  pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [1, 1],
    });
    console.log(result);
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
  };

  pickFromCamera = async () => {
    const permissions = Permissions.CAMERA;
    const { status } = await Permissions.askAsync(permissions);

    console.log(permissions, status);
    if (status === 'granted') {
      const image = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
        allowsEditing: false,
        aspect: [1, 1],
      }).catch(error => console.log(permissions, { error }));
      console.log(permissions, 'SUCCESS', image);
      if (!image.cancelled) {
        this.setState({ image: image.uri });
      }
    }
  }

  callUploadAvatar = () => {
    if (this.state.image) {
      this.setState({
        isLoading: true,
      });
      AuthService.uploadAvatar(this.state.image)
        .then(() => this.changePasswordSuccess())
        .catch((error) => {
          this.setState({
            isLoading: false,
          });
          Alert.alert('Lỗi', error.message);
        });
    } else {
      Alert.alert('Lỗi', 'Hãy chọn ảnh!');
    }
  }

  render() {
    const { image } = this.state;
    const indicator = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
    if (this.state.isLoading) {
      return indicator;
    }
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            flexDirection: 'column',
            height: 35,
            width: 110,
            shadowColor: '#000000',
            shadowOpacity: 0.2,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 0 },
            elevation: 1.5,
            backgroundColor: 'white',
            borderRadius: 8,
            borderWidth: 0.1,
            borderColor: '#aaa',
            marginVertical: 8,
            padding: 8,
            right: 8,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
          }}
          onPress={() => this.props.navigation.navigate('App')}
        >
          <Text style={{ marginRight: 15, fontSize: 16 }}>
            Bỏ qua
          </Text>
          <Image
            source={require('../../assets/images/profile/right_arrow.png')}
            resizeMode="contain"
            style={{
              height: 10,
              width: 10,
              right: 7,
              position: 'absolute',
            }}
          />
        </TouchableOpacity>
        <View style={{
          width: 280,
          height: 280,
          marginTop: 80,
          overflow: 'hidden',
          borderRadius: 140,
          backgroundColor: 'white',
        }}
        >
          <Image
            style={{ width: 280, height: 280, position: 'absolute' }}
            resizeMode="contain"
            source={require('../../assets/images/auth/avatar_default.png')}
          />
          {image && <Image
            style={{ width: 280, height: 280, position: 'absolute' }}
            resizeMode="cover"
            source={{ uri: image }}
          />}
        </View>
        <View style={{
          height: 50,
          width: windowWidth,
          marginTop: 30,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
        >
          <TouchableOpacity onPress={this.pickFromLibrary}>
            <Image
              style={{ width: windowWidth / 2, height: 50, flex: 1 }}
              resizeMode="contain"
              source={require('../../assets/images/auth/gallery.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.pickFromCamera}>
            <Image
              style={{ width: windowWidth / 2, height: 50, flex: 1 }}
              resizeMode="contain"
              source={require('../../assets/images/auth/camera.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={{
          position: 'absolute',
          alignItems: 'center',
          bottom: 0,
        }}
        >
          <TouchableOpacity onPress={this.callUploadAvatar}>
            <LinearGradient
              colors={[AppColors.primaryDark, AppColors.primaryLight]}
              style={styles.buttonStyle}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>
                Xác Nhận
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default UploadAvatarScreen;
