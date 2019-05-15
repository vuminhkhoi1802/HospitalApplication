import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Alert,
} from 'react-native';
import { AppColors } from '@app/config';
import { NotificationService } from '@app/services';
import { EventRegister } from 'react-native-event-listeners';
import { Ionicons } from '@expo/vector-icons';
import NotificationHandler from './NotificationHandler';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemStyle: {
    padding: 5,
  },
  contentStyle: {
    color: 'black',
    fontSize: 14,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  titleStyle: {
    color: AppColors.primaryDark,
    fontSize: 18,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  contentReadStyle: {
    color: 'grey',
    fontSize: 14,
    paddingHorizontal: 10,
  },
  titleReadStyle: {
    color: AppColors.primaryDark,
    fontSize: 18,
    paddingHorizontal: 10,
  },
  childViewStyle: {
    flexDirection: 'column',
    flex: 1,
  },
});

class NotificationScreen extends React.Component {
  static navigationOptions = {
    title: 'Thông Báo',
  };
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isLoading: true,
      notifications: [],
    };
  }
  componentDidMount() {
    this.id = EventRegister.addEventListener('notification_Updated', () => this.getNotifications());
    this.getNotifications();
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.id);
  }

  onNotificationClick = (item) => {
    const notifications = this.state.notifications.map((notification) => {
      const returned = notification;
      if (returned.id === item.id) { returned.read = true; }
      return returned;
    });
    this.setState({ isLoading: false, notifications });
    NotificationHandler.handleNotification(item);
  }

  getNotifications = () => {
    this.setState({ isLoading: true, refreshing: true });
    NotificationService.listNotifications(0, 50)
      .then(notifications => this.setState({ refreshing: false, isLoading: false, notifications }))
      .catch(error => Alert.alert('Lỗi', error.message));
  }

  renderRow = (item) => {
    return (
      <TouchableOpacity
        style={styles.itemStyle}
        onPress={() => this.onNotificationClick(item)}
      >
        <View style={{
          flexDirection: 'row',
          width: windowWidth - 20,
          shadowColor: '#000000',
          shadowOpacity: 0.2,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 0 },
          elevation: 1.5,
          backgroundColor: 'white',
          borderRadius: 8,
          borderWidth: 0.1,
          borderColor: '#aaa',
          marginVertical: 4,
          marginHorizontal: 4,
          padding: 8,
          alignItems: 'center',
        }}
        >
          <Ionicons
            name="ios-notifications-outline"
            size={30}
            color={AppColors.primary}
          />
          <View style={styles.childViewStyle}>
            <Text style={item.read ? styles.titleReadStyle : styles.titleStyle}>
              {item.title}
            </Text>
            <Text style={item.read ? styles.contentReadStyle : styles.contentStyle}>
              {item.message}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    const indicator = (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
      }}
      >
        <ActivityIndicator />
      </View>);
    const listNotification = (
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.getNotifications}
          />
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={this.state.notifications}
        keyExtractor={item => `${item.id}`}
        renderItem={({ item }) => this.renderRow(item)}
      />
    );
    return (
      <View style={styles.container}>
        {this.state.isLoading ? indicator : listNotification}
      </View>
    );
  }
}

export default NotificationScreen;
