import React from 'react';
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '@app/config';
import PropTypes from 'prop-types';

const windowWidth = Dimensions.get('window').width;
const TaskDetailItem = (props) => {
  const {
    itemIcon,
    itemIconText,
    itemText,
    isPhone,
  } = props;
  const phone = (
    <TouchableOpacity onPress={() => Linking.openURL(`tel:${itemText}`).then(() => {}).catch(() => {})}>
      <Text style={{
        marginTop: 5,
        marginLeft: 23,
        color: 'blue',
      }}
      >
        {itemText}
      </Text>
    </TouchableOpacity>
  );
  const other = (
    <Text style={{
      marginTop: 5,
      marginLeft: 23,
      color: 'black',
    }}
    >
      {itemText}
    </Text>
  );
  return (
    <View style={{
      paddingTop: 5,
      alignItems: 'stretch',
      flexDirection: 'column',
      width: windowWidth,
      height: 60,
      }}
    >
      <View style={{
          alignItems: 'stretch',
          flexDirection: 'row',
      }}
      >
        <Ionicons
          name={itemIcon}
          size={24}
          color={AppColors.primary}
        />
        <Text style={{
          marginTop: 5,
          marginLeft: 5,
          color: 'gray',
        }}
        >
          {itemIconText}
        </Text>
      </View>
      {isPhone ? phone : other}
    </View>
  );
};

TaskDetailItem.propTypes = {
  itemIcon: PropTypes.string.isRequired,
  itemIconText: PropTypes.string.isRequired,
  itemText: PropTypes.string.isRequired,
  isPhone: PropTypes.bool.isRequired,
};

export default TaskDetailItem;
