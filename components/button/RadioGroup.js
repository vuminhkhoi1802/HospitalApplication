import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import RadioButton from './RadioButton';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  border: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default class RadioGroup extends Component {
  static validate(input) {
    const data = input;
    let selected = false; // Variable to check if "selected: true" for more than one button.
    data.forEach((e) => {
      e.color = e.color ? e.color : '#444';
      e.disabled = e.disabled ? e.disabled : false;
      e.label = e.label ? e.label : 'You forgot to give label';
      e.layout = e.layout ? e.layout : 'row';
      e.selected = e.selected ? e.selected : false;
      if (e.selected) {
        if (selected) {
          // Making "selected: false", if "selected: true" is assigned for more than one button.
          e.selected = false;
        } else {
          selected = true;
        }
      }
      e.size = e.size ? e.size : 24;
      e.value = e.value ? e.value : e.label;
    });

    if (!selected) {
      data[0].selected = true;
    }
    return data;
  }

  constructor(props) {
    super(props);
    this.state = {
      radioButtons: RadioGroup.validate(this.props.radioButtons),
    };
  }

  onPress = (label) => {
    const { radioButtons } = this.state;
    const selectedIndex = radioButtons.findIndex(e => e.selected === true);
    const selectIndex = radioButtons.findIndex(e => e.label === label);
    if (selectedIndex !== selectIndex) {
      radioButtons[selectedIndex].selected = false;
      radioButtons[selectIndex].selected = true;
      this.setState({ radioButtons });
      this.props.onPress(this.state.radioButtons);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: this.props.flexDirection, justifyContent: 'center' }}>
          {this.state.radioButtons.map(data => (
            <RadioButton
              key={data.label}
              data={data}
              onPress={this.onPress}
            />
          ))}
        </View>
      </View>
    );
  }
}

RadioGroup.propTypes = {
  radioButtons: PropTypes.arrayOf(PropTypes.object).isRequired,
  onPress: PropTypes.func.isRequired,
  flexDirection: PropTypes.string.isRequired,
};
