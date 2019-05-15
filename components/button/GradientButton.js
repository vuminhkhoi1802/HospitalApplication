import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { LinearGradient } from 'expo';
import { AppColors } from '@app/config';

const styles = StyleSheet.create({
  mButtonStyle: {
    marginVertical: 10,
    width: 230,
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  mButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

class GradientButton extends React.Component {
  render() {
    const { btnText, btnOnPress } = this.props;
    return (
      <TouchableOpacity onPress={btnOnPress}>
        <LinearGradient
          colors={[AppColors.primaryDark, AppColors.primaryLight]}
          style={styles.mButtonStyle}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.mButtonText}>
            {btnText}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

GradientButton.propTypes = {
  btnText: PropTypes.string.isRequired,
  btnOnPress: PropTypes.func.isRequired,
};

export default GradientButton;
