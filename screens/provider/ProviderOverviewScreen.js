import React from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { AppColors, AppConfig } from '@app/config';
import { ProviderService } from '@app/services';

class ProviderOverviewScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Thông Tin Phòng Khám',
  })

  state = {
    isLoading: true,
    provider: {},
  }

  componentDidMount() {
    ProviderService.getProvider(AppConfig.providerId, 'CHILDREN')
      .then(provider => this.setState({ isLoading: false, provider }))
      .catch((error) => {
        this.setState({ isLoading: false, provider: {} });
        Alert.alert('Lỗi', error.message);
      });
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
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          style={{
            height: 190,
            marginHorizontal: 16,
            marginTop: 24,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              shadowColor: '#000000',
              shadowOpacity: 0.3,
              shadowRadius: 3,
              shadowOffset: { width: 0, height: 0 },
              width: 64,
              height: 64,
              elevation: 4,
              borderColor: '#00000022',
              borderWidth: 0.2,
              borderRadius: 32,
              zIndex: 10,
            }}
          >
            <View style={{
              width: 64,
              height: 64,
              overflow: 'hidden',
              borderRadius: 32,
              backgroundColor: 'white',
            }}
            >
              <Image
                style={{ width: 64, height: 64, position: 'absolute' }}
                resizeMode="contain"
                source={require('../../assets/images/auth/logo.png')}
              />
              <Image
                style={{ width: 64, height: 64, position: 'absolute' }}
                resizeMode="cover"
                source={{ uri: this.state.provider.avatar }}
              />
            </View>
          </View>
          <View style={{
            flex: 1,
            marginTop: -48,
            paddingTop: 56,
            alignItems: 'center',
            alignSelf: 'stretch',
            backgroundColor: AppColors.primary,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>{this.state.provider.fullName}</Text>
            <View style={{
              margin: 16,
              borderColor: 'white',
              borderWidth: 1,
              borderRadius: 4,
              alignSelf: 'stretch',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            >
              <Text style={{ color: 'white', fontSize: 21, fontWeight: '700' }}>{parseFloat(this.state.provider.successRate) || 0}%</Text>
              <Text style={{ color: 'white', fontSize: 16 }}>Thích</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={{
            alignSelf: 'stretch',
            borderBottomColor: AppColors.primary,
            borderBottomWidth: 1,
            borderLeftColor: AppColors.primary,
            borderLeftWidth: 1,
            borderRightColor: AppColors.primary,
            borderRightWidth: 1,
            marginHorizontal: 16,
            height: 40,
          }}
          onPress={() => {
            if (this.state.provider.profileId) {
              this.props.navigation.navigate('ProviderDetails', { provider: this.state.provider });
            }
          }}
        >
          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
            <Text style={{ flex: 1, textAlign: 'center', color: AppColors.primary }}>Xem chi tiết Phòng khám</Text>
            <EvilIcons name="chevron-right" size={24} color={AppColors.primary} />
          </View>
        </TouchableOpacity>
        <Text style={{
          marginHorizontal: 16,
          marginTop: 12,
          color: '#333',
          fontSize: 14,
          fontWeight: '100',
          paddingBottom: 4,
          }}
        >
          Danh sách Bác sĩ của Phòng khám
        </Text>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={this.state.provider.children}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProviderDetails', { provider: item })}>
              <View
                style={{
                  shadowColor: '#000000',
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  shadowOffset: { width: 0, height: 0 },
                  height: 64,
                  backgroundColor: 'white',
                  zIndex: 10,
                  borderRadius: 4,
                  elevation: 1.5,
                  marginTop: 12,
                  marginBottom: 4,
                  marginHorizontal: 2,
                  paddingLeft: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    shadowColor: '#000000',
                    shadowOpacity: 0.4,
                    shadowRadius: 1,
                    shadowOffset: { width: 0, height: 0 },
                    width: 48,
                    height: 48,
                    marginHorizontal: 8,
                    marginVertical: 2,
                    elevation: 2,
                    borderColor: '#00000022',
                    borderWidth: 0.2,
                    borderRadius: 24,
                  }}
                >
                  <View style={{
                    width: 48,
                    height: 48,
                    overflow: 'hidden',
                    borderRadius: 24,
                    backgroundColor: 'white',
                  }}
                  >
                    <Image
                      style={{ width: 48, height: 48, position: 'absolute' }}
                      resizeMode="contain"
                      source={require('../../assets/images/auth/logo.png')}
                    />
                    <Image
                      style={{ width: 48, height: 48, position: 'absolute' }}
                      resizeMode="cover"
                      source={{ uri: item.avatar }}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'column', flex: 1, marginHorizontal: 12 }}>
                  <Text style={{ fontSize: 13, fontWeight: '500', marginBottom: 4 }}>{item.fullName}</Text>
                  <Text>
                    <Text style={{ color: '#444', fontSize: 13 }}>Chuyên khoa: </Text>
                    <Text style={{ fontSize: 13, fontWeight: '500' }}>
                      {item.categories && item.categories.length > 0 ? item.categories[0].name : ''}
                    </Text>
                  </Text>
                </View>
                <View style={{
                  backgroundColor: AppColors.primary,
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 6,
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4,
                }}
                >
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>Xem</Text>
                </View>
              </View>
            </TouchableOpacity>
            )
          }
          keyExtractor={item => `${item.profileId}`}
        />
      </View>
    );
  }
}

export default ProviderOverviewScreen;
