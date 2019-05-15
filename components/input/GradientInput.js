import React from 'react';
import {
  TextInput,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  input: {
    height: 34,
    width: 230,
    marginVertical: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#f8971b',
    borderWidth: 1,
    fontSize: 16,
  },
});

class GradientInput extends React.Component {
  render() {
    const { inputHint, inputKeyboardType, inputMaxLength } = this.props;
    return (
      <TextInput
        style={styles.input}
        placeholder={inputHint}
        autoFocus
        autoCorrect
        maxLength={inputMaxLength}
        underlineColorAndroid="rgba(0,0,0,0)"
        keyboardType={inputKeyboardType}
        returnKeyType="next"
        onSubmitEditing={this.next}
        blurOnSubmit={false}
      />
    );
  }
}

GradientInput.propTypes = {
  inputHint: PropTypes.string.isRequired,
  inputKeyboardType: PropTypes.string.isRequired,
  inputMaxLength: PropTypes.number.isRequired,
};

export default GradientInput;
