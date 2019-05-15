import React from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo';
import { EventRegister } from 'react-native-event-listeners';
import { AppColors } from '@app/config';
import { UserService } from '@app/services';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  formLabel: {
    color: 'gray',
  },
  infoStyle: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  textInfoStyle: {
    color: 'black',
    fontSize: 16,
    flex: 1,
    fontWeight: 'bold',
  },
  itemLeft: {
    color: AppColors.primary,
    fontSize: 16,
    flex: 1,
  },
  buttonStyle: {
    margin: 5,
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

class ProfileScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Hồ Sơ',
  })
  state = {
    isLoading: true,
    members: [],
  }
  componentDidMount() {
    this.id = EventRegister.addEventListener('profile_MemberUpdated', () => this.reloadMember());
    this.reloadMember();
  }
  componentWillUnmount() {
    EventRegister.removeEventListener(this.id);
  }
  reloadMember = () => {
    UserService.getMembers().then(members => this.setState({
      isLoading: false,
      members,
    }));
  }
  render() {
    const indicator = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
    const listMember = (
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={this.state.members}
        renderItem={({ item }) => (
          <View style={{
            flexDirection: 'column',
            width: windowWidth - 18,
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
            marginHorizontal: 4,
            padding: 8,
            alignItems: 'flex-start',
          }}
          >
            <View style={{
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            >
              <Text style={styles.itemLeft}>
                {item.nickName ? item.nickName : item.fullName}
              </Text>
              <TouchableOpacity
                style={{
                  right: 0,
                  position: 'absolute',
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => this.props.navigation.navigate('AddMember', { memberProfile: item })}
              >
                <Text style={{ marginRight: 25, fontSize: 16 }}>
                  Chỉnh sửa
                </Text>
                <Image
                  source={require('../../assets/images/profile/right_arrow.png')}
                  resizeMode="contain"
                  style={{
                    height: 10,
                    width: 10,
                    right: 10,
                    position: 'absolute',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{
              backgroundColor: 'gray',
              height: 1,
              paddingRight: 5,
              width: windowWidth,
            }}
            />
            <View style={{
              height: 25,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            >
              <Text style={{ color: 'grey', fontSize: 14, flex: 1 }}>
                Họ và tên
              </Text>
              <Text style={{ color: 'grey', fontSize: 14, flex: 1 }}>
                Ngày sinh
              </Text>
              <Text style={{
                color: 'grey',
                fontSize: 14,
                flex: 1,
                right: 20,
                position: 'absolute',
              }}
              >
                Giới tính
              </Text>
            </View>
            <View style={{
              height: 25,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            >
              <Text style={{ color: AppColors.profileText, fontSize: 14, flex: 1 }}>
                {item.fullName}
              </Text>
              <Text style={{ color: AppColors.profileText, fontSize: 14, flex: 1 }}>
                {item.birthday}
              </Text>
              <Text style={{
                color: AppColors.profileText,
                fontSize: 14,
                flex: 1,
                right: 20,
                position: 'absolute',
              }}
              >
                {item.gender === 'FEMALE' ? 'Nữ' : 'Nam'}
              </Text>
            </View>
            <View style={{
              height: 25,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            >
              <Text style={{ color: 'grey', fontSize: 14, flex: 1 }}>
                Quan hệ
              </Text>
              <Text style={{ color: 'grey', fontSize: 14, flex: 1 }}>
                Chiều cao
              </Text>
              <Text style={{
                color: 'grey',
                fontSize: 14,
                flex: 1,
                right: 20,
                position: 'absolute',
              }}
              >
                Cân nặng
              </Text>
            </View>
            <View style={{
              height: 25,
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
            >
              <Text style={{ color: AppColors.profileText, fontSize: 14, flex: 1 }}>
                {item.profileSubType}
              </Text>
              <Text style={{ color: AppColors.profileText, fontSize: 14, flex: 1 }}>
                {item.height}cm
              </Text>
              <Text style={{
                color: AppColors.profileText,
                fontSize: 14,
                flex: 1,
                right: 20,
                position: 'absolute',
              }}
              >
                {item.weight}kg
              </Text>
            </View>
          </View>
          )
        }
        keyExtractor={item => `${item.profileId}`}
      />
    );
    return (
      <View style={{
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        backgroundColor: 'white',
        flexDirection: 'column',
        padding: 5,
      }}
      >
        <View style={{ marginLeft: 3, flexDirection: 'row' }}>
          <View style={{
            width: 80,
            height: 80,
            overflow: 'hidden',
            borderRadius: 40,
            backgroundColor: 'white',
          }}
          >
            <Image
              style={{ width: 80, height: 80, position: 'absolute' }}
              resizeMode="contain"
              source={require('../../assets/images/auth/avatar_default.png')}
            />
            {global.Session.user.avatar && <Image
              style={{ width: 80, height: 80, position: 'absolute' }}
              resizeMode="cover"
              source={{ uri: global.Session.user.avatar }}
            />}
          </View>
          <View style={{ marginLeft: 20, flexDirection: 'column' }}>
            <View style={styles.infoStyle}>
              <Text style={{ color: AppColors.primaryDark, fontSize: 30, fontWeight: 'bold' }}>
                {global.Session.user.fullName}
              </Text>
            </View>
            <Text style={styles.formLabel}>Số điện thoại:</Text>
            <View style={styles.infoStyle}>
              <Text style={styles.textInfoStyle}>
                {global.Session.user.phone}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'column',
            height: 40,
            width: 150,
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
            marginLeft: 3,
            padding: 8,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => this.props.navigation.navigate('ChangePassword')}
        >
          <Text style={{ marginRight: 15, fontSize: 16 }}>
            Đổi mật khẩu
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
        <Text style={{ color: 'gray', marginLeft: 3, marginBottom: 10 }}>
          Danh sách thành viên:
        </Text>
        {this.state.isLoading ? indicator : listMember}
        <TouchableOpacity onPress={() => this.props.navigation.navigate('AddMember')}>
          <LinearGradient
            colors={[AppColors.primaryDark, AppColors.primaryLight]}
            style={styles.buttonStyle}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>
              Thêm Thành Viên
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ProfileScreen;
