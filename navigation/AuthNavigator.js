import { createStackNavigator } from 'react-navigation';
import { Platform } from 'react-native';
import { Constants } from 'expo';
import {
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  UploadAvatarScreen,
} from '@screens/authentication';
import { AppColors } from '@app/config';

export default createStackNavigator(
  {
    Login: LoginScreen,
    Register: RegisterScreen,
    ForgotPassword: ForgotPasswordScreen,
    UploadAvatar: UploadAvatarScreen,
  },
  {
    initialRouteName: 'Login',
    navigationOptions: {
      headerStyle: {
        backgroundColor: AppColors.primary,
        ...Platform.select({
          android: {
            marginTop: -Constants.statusBarHeight,
          },
        }),
      },
      headerTintColor: 'white',
      headerBackTitle: ' ',
    },
  },
);
