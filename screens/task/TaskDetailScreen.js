import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Linking,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Image,
} from 'react-native';
import { TaskService } from '@app/services';
import { AppColors } from '@app/config';
import { EventRegister } from 'react-native-event-listeners';
import TaskDetailItem from '@app/components/task/TaskDetailItem.js';
import TaskUtils from './TaskUtils';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  buttonStyle: {
    margin: 10,
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
  formContainer: {
    alignSelf: 'stretch',
    marginTop: 12,
  },
  formLabel: {
    color: 'gray',
  },
  formField: {
    color: 'black', height: 40, fontSize: 16, flex: 1,
  },
  shadowStyle: {
    width: windowWidth - 16,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    elevation: 1.5,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 0.1,
    borderColor: '#aaa',
    margin: 8,
    padding: 8,
  },
});

class TaskDetailScreen extends React.Component {
  static navigationOptions = {
    title: 'Chi Tiết Lịch Khám',
  };
  constructor(props) {
    super(props);
    this.state = { isLoading: true, mTask: null, modalVisible: false };
  }
  componentDidMount() {
    this.getTask(this.props.navigation.state.params.taskId);
  }
  getTask = (id) => {
    this.setState({
      isLoading: true,
    });
    TaskService.getTaskDetail(id)
      .then(response => this.getTaskSuccess(response))
      .catch(error => this.showError(error));
  }
  getTaskSuccess = (response) => {
    console.log('TASK: ', response);
    this.setState({ mTask: response }, function () {
      this.setState({ isLoading: false });
    });
  }
  callCancelTask = (reason) => {
    this.setState({
      modalVisible: false,
      isLoading: true,
    });
    TaskService.cancelTask(this.state.mTask.taskId, reason)
      .then(() => this.cancelTaskSuccess())
      .catch(error => this.showError(error));
  }
  acceptTask = () => {
    TaskService.acceptTask(this.state.mTask.taskId, global.Session.user.profileId)
      .then(() => this.cancelTaskSuccess())
      .catch(error => this.showError(error));
  }
  cancelTaskSuccess = () => {
    EventRegister.emit('task_Updated');
    this.getTask(this.state.mTask.taskId);
  }
  showError = (error) => {
    this.setState({ isLoading: false });
    Alert.alert('Lỗi', error.message);
  }
  generateStatusColor = (status) => {
    if (status === 'CREATED' || status === 'POSTPONED') {
      return AppColors.yellowStatus;
    }
    if (status === 'CONFIRMED') {
      return AppColors.blueStatus;
    }
    if (status === 'CANCELLED' || status === 'DECLINED') {
      return 'grey';
    }
    return AppColors.greenStatus;
  }
  generateStatus = (status) => {
    return (
      <View
        style={{
          height: 40,
          width: 120,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          backgroundColor: this.generateStatusColor(status),
          position: 'absolute',
          right: 10,
          top: 10,
        }}
      >
        <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>
          {TaskUtils.formatStatus(status)}
        </Text>
      </View>
    );
  }
  generateProvider = (provider, category) => {
    return (
      <View style={{
        marginLeft: 10,
        height: 64,
        alignItems: 'center',
        flexDirection: 'row',
        width: windowWidth,
        flex: 1,
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
            zIndex: 10,
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
              source={{ uri: provider.avatar || '' }}
            />
          </View>
        </View>
        <View style={{
          marginLeft: 10,
          alignItems: 'stretch',
          flexDirection: 'column',
          width: windowWidth,
          flex: 1,
        }}
        >
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
              {provider ? provider.fullName : ''}
            </Text>
            <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
              {provider ? `Chuyên môn: ${category.name}` : ''}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  generateConsumer = (consumer, member) => {
    return (
      <View style={{
        marginLeft: 10,
        height: 56,
        alignItems: 'stretch',
        flexDirection: 'row',
        width: windowWidth,
        flex: 1,
      }}
      >
        <View style={{
          width: 48,
          height: 48,
          margin: 4,
          backgroundColor: '#00000000',
          zIndex: 10,
        }}
        />
        <View style={{
          marginLeft: 10,
          alignItems: 'stretch',
          flexDirection: 'column',
          width: windowWidth,
          flex: 1,
        }}
        >
          <View style={{ justifyContent: 'center', flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              <Text style={{ color: 'gray' }}>Bệnh nhân: </Text>
              <Text style={{ color: 'black' }}>
                {member.fullName}
              </Text>
            </Text>
            <Text style={{ color: 'gray', fontSize: 16, fontWeight: 'bold' }}>
              Người đặt lịch: {consumer.fullName}
            </Text>
          </View>
        </View>
      </View>
    );
  }
  openUrl = url => Linking.openURL(url).then(() => {}).catch(() => {})
  render() {
    const indicator = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
    if (this.state.isLoading) {
      return indicator;
    }

    let cancelButton;
    if (this.state.mTask.status === 'CREATED') {
      cancelButton = (
        <TouchableOpacity
          style={{
            backgroundColor: AppColors.redStatus,
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
          }}
          onPress={() => this.setState({ modalVisible: true })}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>HỦY KHÁM</Text>
        </TouchableOpacity>
      );
    } else {
      cancelButton = (
        <View style={{ alignSelf: 'stretch', flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              backgroundColor: AppColors.redStatus,
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              flex: 1,
            }}
            onPress={() => this.setState({ modalVisible: true })}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>HỦY KHÁM</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: AppColors.primary,
              alignItems: 'center',
              justifyContent: 'center',
              height: 50,
              flex: 1,
            }}
            onPress={() => this.acceptTask()}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '500' }}>ĐỒNG Ý</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Modal
              animationType="slide"
              transparent
              visible={this.state.modalVisible}
              onRequestClose={() => {}}
            >
              <View style={{
                flex: 1,
                backgroundColor: 'rgba(52, 52, 52, 0.8)',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              >
                <View style={[styles.shadowStyle, { height: 180, alignItems: 'center', flexDirection: 'column' }]}>
                  <View style={styles.formContainer}>
                    <Text style={styles.formLabel}>Lý do huỷ khám:</Text>
                    <TextInput
                      style={[...styles.formField, { height: 80 }]}
                      onChangeText={value => this.setState({ textReason: value })}
                      underlineColorAndroid="rgba(0,0,0,0)"
                      showsVerticalScrollIndicator={false}
                      showsHorizontalScrollIndicator={false}
                      returnKeyType="next"
                      blurOnSubmit={false}
                      multiline
                    />
                    <View style={{ backgroundColor: AppColors.primary, height: 1 }} />
                  </View>
                  <View style={{
                    marginTop: 8,
                    position: 'absolute',
                    right: 20,
                    bottom: 20,
                  }}
                  >
                    <TouchableOpacity onPress={() => this.callCancelTask(this.state.textReason)}>
                      <Text>Xác Nhận</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{
                    marginTop: 8,
                    position: 'absolute',
                    left: 20,
                    bottom: 20,
                  }}
                  >
                    <TouchableOpacity onPress={() => this.setState({ modalVisible: false })}>
                      <Text>Bỏ Qua</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            <View style={styles.container}>
              <View style={[styles.shadowStyle, { height: 60, alignItems: 'flex-start', flexDirection: 'row' }]}>
                <Text style={{
                  marginTop: 15,
                  marginLeft: 10,
                  color: 'gray',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
                >
                  Trạng thái
                </Text>
                {this.generateStatus(this.state.mTask.status)}
              </View>
              {this.state.mTask.status === 'CONFIRMED' ?
                <View style={[styles.shadowStyle, { padding: 12 }]}>
                  <Text style={{ color: 'red' }}>Vui lòng liên hệ phòng khám để đổi lịch khám</Text>
                </View> : <View />
              }
              <View style={[styles.shadowStyle, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                {this.state.mTask.provider ?
                  this.generateProvider(this.state.mTask.provider, this.state.mTask.category)
                  : <View />}
                {this.generateConsumer(this.state.mTask.consumer, this.state.mTask.member)}
              </View>
              <View style={[styles.shadowStyle, { alignItems: 'flex-start', flexDirection: 'column' }]}>
                <TaskDetailItem
                  itemIcon="ios-call-outline"
                  itemIconText="Liên hệ:"
                  itemText="+842435641981"
                  isPhone
                />
                <TaskDetailItem
                  itemIcon="ios-calendar-outline"
                  itemIconText="Lịch khám:"
                  itemText={TaskUtils.formatDate(this.state.mTask.startDate)}
                  isPhone={false}
                />
                <TaskDetailItem
                  itemIcon="ios-contact-outline"
                  itemIconText="Mã bệnh nhân:"
                  itemText={this.state.mTask.patientCode ? this.state.mTask.patientCode : 'Chưa có mã'}
                  isPhone={false}
                />
                <TaskDetailItem
                  itemIcon="ios-car-outline"
                  itemIconText="Xe đưa đón:"
                  itemText={this.state.mTask.extras ? 'Có' : 'Không'}
                  isPhone={false}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        {this.state.mTask.status === 'CREATED' || this.state.mTask.status === 'POSTPONED' ? cancelButton : <View />}
      </View>
    );
  }
}

export default TaskDetailScreen;
