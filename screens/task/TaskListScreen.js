import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import { AppColors } from '@app/config';
import TaskListPage from './TaskListPage';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
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

class TaskListScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Lịch Hẹn',
  })

  render() {
    return (
      <View style={{
        flex: 1,
      }}
      >
        <View style={{
          flex: 1,
          marginBottom: 70,
        }}
        >
          <ScrollableTabView
            tabBarBackgroundColor={AppColors.primary}
            tabBarUnderlineStyle={{ backgroundColor: '#05c886', height: 3 }}
            tabBarActiveTextColor="white"
            tabBarInactiveTextColor="#fffc"
            tabBarTextStyle={{ fontSize: 16 }}
            renderTabBar={() => <DefaultTabBar />}
          >
            <TaskListPage tabLabel="Sắp Tới" statuses="CREATED,POSTPONED,CONFIRMED" navigation={this.props.navigation} />
            <TaskListPage tabLabel="Lịch Sử Khám" statuses="CANCELLED,DECLINED,CLOSED" navigation={this.props.navigation} />
          </ScrollableTabView>
        </View>
        <View style={{
          position: 'absolute',
          alignItems: 'center',
          right: 10,
          bottom: 0,
        }}
        >
          <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateTask')}>
            <LinearGradient
              colors={[AppColors.primaryDark, AppColors.primaryLight]}
              style={styles.buttonStyle}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>
                Đặt Lịch Hẹn
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default TaskListScreen;
