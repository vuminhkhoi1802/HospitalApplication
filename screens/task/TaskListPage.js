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
import PropTypes from 'prop-types';
import { EventRegister } from 'react-native-event-listeners';
import { TaskService } from '@app/services';
import TaskUtils from './TaskUtils';

class TaskListPage extends React.Component {
  state = {
    isLoading: true,
    tasks: [],
  };

  componentDidMount() {
    this.id = EventRegister.addEventListener('task_Updated', () => this.reload());
    this.reload();
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.id);
  }

  reload() {
    this.state = {
      isLoading: true,
      tasks: [],
    };
    TaskService.getTasks(global.Session.user.profileId, 0, 100, this.props.statuses)
      .then(tasks => this.setState({ isLoading: false, tasks }))
      .catch((error) => {
        this.setState({ isLoading: false, tasks: [] });
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
    if (!this.state.tasks.length) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, color: '#444' }}>Không có lịch khám nào</Text>
        </View>
      );
    }
    return (
      <FlatList
        style={{ flex: 1, backgroundColor: 'white', padding: 12 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={this.state.tasks}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => this.props.navigation.navigate('TaskDetail', { taskId: item.taskId })}>
            <View
              style={{
                shadowColor: '#000000',
                shadowOpacity: 0.2,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 0 },
                elevation: 1.5,
                height: 120,
                backgroundColor: 'white',
                borderRadius: 8,
                borderWidth: 0.1,
                borderColor: '#aaa',
                marginVertical: 8,
                marginHorizontal: 4,
                padding: 8,
                flexDirection: 'row',
                alignItems: 'flex-start',
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
                  margin: 4,
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
                    source={{ uri: item.provider ? item.provider.avatar : ' ' }}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'column', flex: 1, marginHorizontal: 12 }}>
                <Text style={{ color: '#444', fontSize: 15, fontWeight: '700' }}>{TaskUtils.formatDate(item.startDate)}</Text>
                <Text style={{ fontSize: 13, color: '#444', marginVertical: 8 }}>
                    Khám bởi {item.provider ? item.provider.fullName : ''}
                </Text>
                <View style={{ height: 0.5, alignSelf: 'stretch', backgroundColor: '#ddd' }} />
                <View style={{ flex: 1, flexDirection: 'row', marginTop: 12 }}>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={{ color: '#bbb', fontSize: 12, marginBottom: 4 }}>Trạng Thái: </Text>
                    <Text style={{ fontSize: 14, color: '#444', fontWeight: '600' }}>{TaskUtils.formatStatus(item.status)}</Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={{ color: '#bbb', fontSize: 12, marginBottom: 4 }}>Thành Viên Khám: </Text>
                    <Text style={{ fontSize: 14, color: '#444', fontWeight: '600' }}>{item.member.fullName}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          )
        }
        keyExtractor={item => `${item.taskId}`}
      />
    );
  }
}

TaskListPage.propTypes = {
  statuses: PropTypes.string.isRequired,
};

export default TaskListPage;
