import { NavigationActions } from 'react-navigation';
import { EventRegister } from 'react-native-event-listeners';
import { NotificationService } from '@app/services';
import { navigatorRef } from '../../App';

function readNotification(id) {
  NotificationService.readNotification(id).then(() => EventRegister.emit('notification_Updated')).catch(() => {});
}

function handleNotification(notification, fromPush = false) {
  if (fromPush) {
    readNotification(notification.data.notificationId);
  } else if (notification.read) {
    readNotification(notification.id);
  }
  const code = fromPush ? notification.data.code : notification.code;
  switch (code) {
    case 'ABOUT':
      navigatorRef.dispatch(NavigationActions.navigate({ routeName: 'Home' }));
      break;
    case 'TASK_ACCEPTED_BY_ANGEL':
    case 'TASK_ACCEPTED_BY_USER':
    case 'TASK_CANCELLED_NOT_SUITABLE_TIME':
    case 'TASK_ACCEPTED_CLEAN':
    case 'TASK_CLOSED':
    case 'TASK_CONFIRMED_BUT_CANCELLED_BY_ANGEL':
    case 'TASK_CONFIRMED_BUT_CANCELLED_BY_USER':
    case 'TASK_CONFIRMED_BY_USER':
    case 'TASK_CONFIRM_EXPIRED':
    case 'TASK_CREATED':
    case 'TASK_INTERCHANGE_TO_CONSUMER':
    case 'TASK_INTERCHANGE_TO_PROVIDER':
    case 'TASK_POSTPONED':
    case 'TASK_RATED_BY_USER':
    case 'TASK_REMIND_ANGEL_PREVIOUS_HOUR':
    case 'TASK_REMIND_USER_PREVIOUS_DAY':
    case 'TASK_REMIND_USER_PREVIOUS_HOUR':
    case 'TASK_STARTED':
    case 'TASK_STOPPED':
    case 'TASK_UPDATED_BY_CONSUMER':
    case 'TASK_UPDATED_BY_PROVIDER_TO_CONSUMER':
    case 'TASK_UPDATED_BY_PROVIDER_TO_PROVIDER':
      navigatorRef.dispatch(NavigationActions.navigate({
        routeName: 'TaskDetail',
        params: {
          taskId: fromPush ? notification.data.taskId : notification.returnedParams.taskId,
        },
      }));
      break;
    case 'PROMOTION':
      navigatorRef.dispatch(NavigationActions.navigate({ routeName: 'Promotion' }));
      break;
    default: break;
  }
}

const NotificationHandler = { handleNotification };
export default NotificationHandler;
