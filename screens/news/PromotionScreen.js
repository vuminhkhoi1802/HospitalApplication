import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
} from 'react-native';
import { AppColors } from '@app/config';
import { PromotionService } from '@app/services';
import { Foundation } from '@expo/vector-icons';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  itemStyle: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
  },
  childViewStyle: {
    flexDirection: 'column',
    flex: 1,
  },
  imageStyle: {
    width: 40,
    height: 40,
  },
  contentStyle: {
    color: 'grey',
    fontSize: 14,
    paddingHorizontal: 10,
  },
  titleStyle: {
    color: AppColors.primaryDark,
    fontSize: 18,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
});

class PromotionScreen extends React.Component {
  static navigationOptions = {
    title: 'Khuyến Mại',
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
    };
  }
  componentDidMount() {
    this.getPromotions();
  }
  getPromotions=() => {
    PromotionService.listPromotions(0, 10, 'ACTIVE')
      .then(promotions => this.getPromotionsSuccess(promotions))
      .catch(error => this.getPromotionFailure(error));
  }
  getPromotionFailure = (error) => {
    this.setState({ isLoading: false });
    Alert.alert('Lỗi', error.message);
  }
  getPromotionsSuccess = (promotions) => {
    this.setState({
      isLoading: false,
      dataSource: promotions,
    });
  }
  openUrl = url => Linking.openURL(url).then(() => {}).catch(() => {})

  renderRow = (item) => {
    return (
      <TouchableOpacity
        style={styles.itemStyle}
        onPress={() => { if (item.target) { this.openUrl(item.target); } }}
      >
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
          marginVertical: 4,
          marginHorizontal: 4,
          padding: 8,
          alignItems: 'center',
        }}
        >
          <Foundation
            name="burst-sale"
            size={30}
            color={AppColors.primary}
          />
          <View style={styles.childViewStyle}>
            <Text style={styles.titleStyle}>{item.promotionName}</Text>
            <Text style={styles.contentStyle}>{item.message}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    const indicator = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
    const promotionList = (
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={this.state.dataSource}
        keyExtractor={item => `${item.promotionsId}`}
        renderItem={({ item }) => this.renderRow(item)}
      />
    );
    if (this.state.isLoading) {
      return indicator;
    }
    if (!this.state.dataSource.length) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, color: '#444' }}>Không có chương trình khuyến mại nào</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        {promotionList}
      </View>
    );
  }
}

export default PromotionScreen;
