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

class TaskProviderPickerScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Chọn Bác Sĩ',
  })

  state = {
    isLoading: true,
    providers: [],
    taskForm: {},
  }

  componentDidMount() {
    this.state = {
      isLoading: true,
      providers: [],
      taskForm: this.props.navigation.state.params.taskForm,
    };
    ProviderService.getProvider(AppConfig.providerId, 'CHILDREN')
      .then(provider => this.setState({
        isLoading: false,
        providers: provider.children,
        taskForm: this.state.taskForm,
      }))
      .catch((error) => {
        this.setState({ isLoading: false, providers: [], taskForm: this.state.taskForm });
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
          style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={this.state.providers}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('TaskProviderSchedule', { taskForm: this.state.taskForm, provider: item })}>
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
                  <TouchableOpacity
                    style={{ marginTop: 4, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => this.props.navigation.navigate('ProviderDetails', { provider: item })}
                  >
                    <Text style={{ color: AppColors.primary, fontSize: 12, marginRight: 4 }}>
                      Xem chi tiết
                    </Text>
                    <EvilIcons name="chevron-down" size={16} color={AppColors.primary} />
                  </TouchableOpacity>
                </View>
                <View style={{
                  backgroundColor: AppColors.primary,
                  alignSelf: 'stretch',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 12,
                  borderTopRightRadius: 4,
                  borderBottomRightRadius: 4,
                }}
                >
                  <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>Chọn</Text>
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

export default TaskProviderPickerScreen;
