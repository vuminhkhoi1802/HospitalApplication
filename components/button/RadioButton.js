import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  border: {
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const RadioButton = (props) => {
  const { data } = props;
  const opacity = data.disabled ? 0.2 : 1;
  let layout = { flexDirection: 'row', flex: 1 };
  let margin = { marginLeft: 10 };
  if (data.layout === 'column') {
    layout = { alignItems: 'center' };
    margin = { marginTop: 10 };
  }
  return (
    <TouchableOpacity
      style={[layout, { opacity, marginRight: 12, marginVertical: 8 }]}
      onPress={() => {
        if (!data.disabled) props.onPress(data.label);
      }}
    >
      <View
        style={[
          styles.border,
          {
            borderColor: data.color,
            width: data.size,
            height: data.size,
            borderRadius: data.size / 2,
            alignSelf: 'center',
          },
        ]}
      >
        {data.selected &&
          <View
            style={{
              backgroundColor: data.color,
              width: data.size / 2,
              height: data.size / 2,
              borderRadius: data.size / 2,
            }}
          />}
      </View>
      <Text style={[{ alignSelf: 'center' }, margin]}>{data.label}</Text>
    </TouchableOpacity>
  );
};

RadioButton.propTypes = {
  data: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default RadioButton;
