import React from 'react';
import { Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ImageViewer from 'react-native-image-zoom-viewer';

class ProviderPhotoViewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      images: props.navigation.state.params.images,
      index: props.navigation.state.params.index,
    };
  }

  render() {
    return (
      <Modal visible={this.state.visible} transparent onRequestClose={() => {}}>
        <ImageViewer
          imageUrls={this.state.images}
          enableSwipeDown
          onCancel={() => this.props.navigation.goBack()}
          index={this.state.index}
          saveToLocalByLongPress={false}
          failImageSource={require('../../assets/images/auth/logo.png')}
          renderHeader={() => (
            <TouchableOpacity
              style={{
                position: 'absolute',
                width: 48,
                height: 48,
                top: 32,
                left: 16,
                zIndex: 100,
              }}
              onPress={() => {
                this.setState({ visible: false });
                this.props.navigation.goBack();
              }}
            >
              <Ionicons name="ios-close-outline" size={32} color="white" />
            </TouchableOpacity>
          )}
        />
      </Modal>
    );
  }
}

export default ProviderPhotoViewScreen;
