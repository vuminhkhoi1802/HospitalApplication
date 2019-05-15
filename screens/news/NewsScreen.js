import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Text,
  Alert,
} from 'react-native';
import { HomeService } from '@app/services';
import HTML from 'react-native-render-html';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemStyle: {
    flex: 1,
    alignItems: 'center',
  },
});

class NewsScreen extends React.Component {
  static navigationOptions = {
    title: 'Cẩm Nang',
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
    };
  }
  componentDidMount() {
    this.getNews();
  }
  getNews=() => {
    HomeService.getNews()
      .then(response => response.json())
      .then((json) => {
        this.setState({
          isLoading: false,
          dataSource: json,
        });
      })
      .catch(error => Alert.alert('Lỗi', error.message));
  }
  openUrl = url => Linking.openURL(url).then(() => {}).catch(() => {})

  renderRow = (item) => {
    return (
      <TouchableOpacity
        style={styles.itemStyle}
        onPress={() => { if (item.link) { this.openUrl(item.link); } }}
      >
        <View style={{
          shadowColor: '#000000',
          shadowOpacity: 0.2,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 0 },
          elevation: 1.5,
          backgroundColor: 'white',
          borderRadius: 8,
          borderWidth: 0.1,
          paddingTop: 4,
          margin: 8,
          paddingHorizontal: 8,
          borderColor: '#aaa',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
        >
          <HTML html={item.title.rendered} />
          <HTML html={item.excerpt.rendered} />
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    if (!this.state.dataSource.length) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, color: '#444' }}>Không có tin tức nào</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={this.state.dataSource}
          keyExtractor={item => `${item.id}`}
          renderItem={({ item }) => this.renderRow(item)}
        />
      </View>
    );
  }
}

export default NewsScreen;
