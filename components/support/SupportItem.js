import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import { AppColors } from '@app/config';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  textStyle: {
    color: AppColors.primaryDark,
    fontSize: 14,
  },
  urlStyle: {
    color: 'grey',
    fontSize: 13,
    position: 'absolute',
    right: 12,
  },
  containerStyle: {
    height: 50,
    padding: 5,
    alignItems: 'center',
  },
  imageStyle: {
    width: 16,
    height: 16,
    marginHorizontal: 8,
  },
});

const SupportItem = (props) => {
  const {
    itemText,
    itemUrl,
    itemIcon,
    itemPress,
  } = props;
  return (
    <TouchableOpacity style={styles.containerStyle} onPress={itemPress}>
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
        padding: 8,
        alignItems: 'center',
      }}
      >
        <Image style={styles.imageStyle} source={itemIcon} />
        <Text numberOfLines={1} style={styles.textStyle}>
          {itemText}
        </Text>
        <Text numberOfLines={1} style={styles.urlStyle}>
          {itemUrl}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

SupportItem.propTypes = {
  itemText: PropTypes.string.isRequired,
  itemUrl: PropTypes.string.isRequired,
  itemIcon: PropTypes.number.isRequired,
  itemPress: PropTypes.func.isRequired,
};

export default SupportItem;
