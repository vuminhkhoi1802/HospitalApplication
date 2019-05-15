import { createStackNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import { Constants } from 'expo';
import { AppColors } from '@app/config';
import HomeScreen from '@screens/home';
import NotificationScreen from '@screens/notification';
import { NewsScreen, PromotionScreen } from '@screens/news';
import SupportScreen from '@screens/support';
import { ProfileScreen, AddMemberScreen, ChangePasswordScreen } from '@screens/profile';
import {
  CreateTaskScreen,
  TaskProviderPickerScreen,
  TaskProviderScheduleScreen,
  TaskListScreen,
  TaskDetailScreen,
} from '@screens/task';
import { ProviderOverviewScreen, ProviderDetailsScreen } from '@screens/provider';

export default createStackNavigator(
  {
    Home: HomeScreen,
    Notification: NotificationScreen,
    Support: SupportScreen,
    News: NewsScreen,
    Promotion: PromotionScreen,
    Profile: ProfileScreen,
    ChangePassword: ChangePasswordScreen,
    AddMember: AddMemberScreen,
    CreateTask: CreateTaskScreen,
    ProviderOverview: ProviderOverviewScreen,
    ProviderDetails: ProviderDetailsScreen,
    TaskProviderPicker: TaskProviderPickerScreen,
    TaskProviderSchedule: TaskProviderScheduleScreen,
    TaskList: TaskListScreen,
    TaskDetail: TaskDetailScreen,
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerStyle: {
        backgroundColor: AppColors.primary,
        ...Platform.select({
          android: {
            marginTop: -Constants.statusBarHeight,
          },
        }),
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerTintColor: 'white',
      headerBackTitle: ' ',
    },
  },
);
