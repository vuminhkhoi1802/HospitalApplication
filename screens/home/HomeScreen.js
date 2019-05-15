import React from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Linking,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { HomeService, NotificationService } from '@app/services';
import { LinearGradient } from 'expo';
import { AppColors } from '@app/config';
import { EventRegister } from 'react-native-event-listeners';
import ModalSelector from 'react-native-modal-selector';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  list: {
    justifyContent: 'center',
    flexDirection: 'column',
    width: windowWidth,
    height: windowWidth,
  },
  itemStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
    margin: 1,
    width: (windowWidth / 3) - 2,
    height: (windowWidth / 3) - 2,
    backgroundColor: 'white',
  },
  textStyle: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 0,
  },
  iconStyle: {
    width: 77,
    height: 30,
    alignSelf: 'center',
    flex: 1,
  },
  container: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
  },
  bannerStyle: {
    justifyContent: 'center',
    width: windowWidth,
    height: windowWidth / 2.2,
  },
  listStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonStyle: {
    marginVertical: 10,
    width: windowWidth - 20,
    padding: 12,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    const notifCount = (
      <View style={{
        backgroundColor: 'red',
        position: 'absolute',
        top: 5,
        right: 10,
        width: 16,
        height: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      >
        <Text
          numberOfLines={1}
          style={{
            color: 'white',
            fontSize: 10,
          }}
        >
          {(state.params && state.params.notificationCount > 0) ?
            state.params.notificationCount : 0}
        </Text>
      </View>
    );
    return {
      headerTitle: <Image source={require('../../assets/images/navigation/header_logo.png')} style={styles.iconStyle} resizeMode="contain" />,
      headerLeft: (<View />),
      headerRight: (
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Image source={require('../../assets/images/navigation/icon_notification.png')} style={{ margin: 12 }} />
          {(state.params && state.params.notificationCount > 0) ? notifCount : (<View />)}
        </TouchableOpacity>
      ),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      timer: null,
    };
  }
  componentDidMount() {
    this.getBanners();
    this.id = EventRegister.addEventListener('notification_Updated', () => this.countNotification());
    this.countNotification();
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
    EventRegister.removeEventListener(this.id);
  }
  getBanners=() => {
    HomeService.getBanners()
      .then((banners) => {
        this.setState({
          isLoading: false,
          dataSource: banners,
          bannerIndex: 0,
        });
        if (banners.length > 1) {
          const timer = setInterval(this.scrollBanner, 3000);
          this.setState({ timer });
        }
      })
      .catch(error => Alert.alert('Lỗi', error.message));
  }

  countNotification=() => {
    NotificationService.countNotification(false)
      .then(response => this.countNotificationSuccess(response))
      .catch(error => Alert.alert('Lỗi', error.message));
  }
  countNotificationSuccess = (response) => {
    const { setParams } = this.props.navigation;
    setParams({ notificationCount: response });
  }
  scrollBanner = () => {
    if (this.state.bannerIndex + 1 < this.state.dataSource.length) {
      this.setState({
        bannerIndex: this.state.bannerIndex += 1,
      });
    } else {
      this.setState({
        bannerIndex: 0,
      });
    }
    this.flatListRef.scrollToIndex({ animated: true, index: this.state.bannerIndex });
  }
  handlePress = (key) => {
    if (key === 'information') {
      this.props.navigation.navigate('ProviderOverview');
    }
    if (key === 'price') {
      this.openUrl('http://nhakhoavietuc.com/bang-gia-nha-khoa');
    }
    if (key === 'task') {
      this.props.navigation.navigate('TaskList');
    }
    if (key === 'location') {
      this.openUrl('https://www.google.com/maps/place/Nha+Khoa+Vi%E1%BB%87t+%C3%9Ac/@21.003129,105.8206288,19z/data=!3m1!4b1!4m5!3m4!1s0x3135ac845e623f69:0x6065ddfced261909!8m2!3d21.003129!4d105.821176');
    }
    if (key === 'promotion') {
      this.props.navigation.navigate('Promotion');
    }
    if (key === 'support') {
      this.props.navigation.navigate('Support');
    }
    if (key === 'news') {
      this.props.navigation.navigate('News');
    }
    if (key === 'profile') {
      this.props.navigation.navigate('Profile');
    }
  }
  openUrl = url => Linking.openURL(url).then(() => {}).catch(() => {})

  itemRender = (item) => {
    // const locationData = [
    //   { key: '0', content: 'Chọn Địa Điểm', url: '' },
    //   { key: '1', content: '630 Trường Chinh, Ngã Tư Sở', url: 'https://www.google.com/maps/place/Nha+Khoa+Vi%E1%BB%87t+%C3%9Ac/@21.003129,105.8206288,19z/data=!3m1!4b1!4m5!3m4!1s0x3135ac845e623f69:0x6065ddfced261909!8m2!3d21.003129!4d105.821176' },
    //   { key: '2', content: '12 Điện Biên Phủ', url: 'https://www.google.com/maps/place/Nha+Khoa+Vi%E1%BB%87t+%C3%9Ac+Luxury/@21.029278,105.8403513,17z/data=!3m1!4b1!4m5!3m4!1s0x3135ab97bcbbda3f:0xc3d114e004607a11!8m2!3d21.029278!4d105.84254' },
    // ];
    const contactData = [
      { key: '0', content: 'Chọn Phương Thức', url: '' },
      { key: '1', content: 'Gọi Điện', url: 'tel:+84945699990' },
      { key: '2', content: 'Gửi Email', url: 'mailto:nhakhoavietuc@gmail.com?subject=Hỗ trợ&body=Xin chào Nha Khoa Việt Úc,' },
    ];
    // if (item.key === 'location') {
    //   return (
    //     <ModalSelector
    //       data={locationData}
    //       keyExtractor={location => `${location.key}`}
    //       labelExtractor={location => location.content}
    //       supportedOrientations={['portrait']}
    //       cancelText="Hủy"
    //       overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
    //       cancelStyle={{ height: 44 }}
    //       cancelTextStyle={{ height: 44, padding: 4, color: 'red' }}
    //       cancelContainerStyle={{ height: 44 }}
    //       sectionStyle={{ height: 32, padding: 4, margin: 0 }}
    //       sectionTextStyle={{ height: 32, padding: 0, color: AppColors.primary }}
    //       optionStyle={{ height: 40, alignItems: 'center', padding: 12 }}
    //       optionTextStyle={{ height: 40, color: 'black' }}
    //       animationType="fade"
    //       style={{ flex: 1, margin: 1, backgroundColor: 'white' }}
    //       onChange={location => this.openUrl(location.url)}
    //     >
    //       <View style={{ width: (windowWidth / 3) - 2, height: (windowWidth / 3) - 2 }}>
    //         <View style={{ flex: 1 }} />
    //         <View style={{
    //           justifyContent: 'center',
    //           alignItems: 'center',
    //           paddingVertical: 4,
    //           marginTop: -24,
    //           }}
    //         >
    //           <Image source={item.source} />
    //         </View>
    //         <View style={{ flex: 1, alignItems: 'center' }}>
    //           <Text style={styles.textStyle}>
    //             {item.title}
    //           </Text>
    //         </View>
    //       </View>
    //     </ModalSelector>
    //   );
    // }
    if (item.key === 'contact') {
      return (
        <ModalSelector
          data={contactData}
          keyExtractor={contact => `${contact.key}`}
          labelExtractor={contact => contact.content}
          supportedOrientations={['portrait']}
          cancelText="Hủy"
          overlayStyle={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
          cancelStyle={{ height: 44 }}
          cancelTextStyle={{ height: 44, padding: 4, color: 'red' }}
          cancelContainerStyle={{ height: 44 }}
          sectionStyle={{ height: 32, padding: 4, margin: 0 }}
          sectionTextStyle={{ height: 32, padding: 0, color: AppColors.primary }}
          optionStyle={{ height: 40, alignItems: 'center', padding: 12 }}
          optionTextStyle={{ height: 40, color: 'black' }}
          animationType="fade"
          style={{ flex: 1, margin: 1, backgroundColor: 'white' }}
          onChange={contact => this.openUrl(contact.url)}
        >
          <View style={{ width: (windowWidth / 3) - 2, height: (windowWidth / 3) - 2 }}>
            <View style={{ flex: 1 }} />
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 4,
              marginTop: -24,
              }}
            >
              <Image source={item.source} />
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.textStyle}>
                {item.title}
              </Text>
            </View>
          </View>
        </ModalSelector>
      );
    }

    return (
      <TouchableOpacity style={styles.itemStyle} onPress={() => this.handlePress(item.key)}>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }} />
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 4,
            marginTop: -24,
            }}
          >
            <Image source={item.source} />
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 12, textAlign: 'center', paddingHorizontal: 0 }}>{item.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  render() {
    const dots = [];
    if (this.state.dataSource.length > 1) {
      for (let index = 0; index < this.state.dataSource.length; index += 1) {
        dots.push(
          <View key={index}>
            <Image
              source={index === this.state.bannerIndex ? require('../../assets/images/home/color_dot.png') : require('../../assets/images/home/white_dot.png')}
              resizeMode="contain"
              style={{ height: 8, width: 8, margin: 4 }}
            />
          </View>);
      }
    }
    const indicator = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
    const banner = (
      <View style={{
        flex: 1,
        alignItems: 'center',
      }}
      >
        <FlatList
          horizontal
          numColumns={1}
          contentContainerStyle={styles.listStyle}
          data={this.state.dataSource}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={0}
          initialNumToRender={2}
          ref={(ref) => { this.flatListRef = ref; }}
          keyExtractor={item => `${item.bannerId}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={item.target ? () => this.openUrl(item.target) : () => {}}>
              <Image source={{ uri: item.path }} style={[styles.bannerStyle, { resizeMode: 'stretch' }]} />
            </TouchableOpacity>
            )
          }
        />
        <View style={{
          position: 'absolute',
          alignItems: 'center',
          bottom: 8,
          flexDirection: 'row',
        }}
        >
          {dots}
        </View>
      </View>
    );
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
      }}
      >
        <View style={styles.container}>
          <View style={styles.bannerStyle}>
            {this.state.isLoading ? indicator : banner}
          </View>
          <FlatList
            onEndReachedThreshold={0}
            numColumns={3}
            contentContainerStyle={styles.list}
            keyExtractor={item => item.key}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={[
              { key: 'information', title: 'Thông Tin\nPhòng Khám', source: require('../../assets/images/home/home_info.png') },
              { key: 'price', title: 'Bảng Giá', source: require('../../assets/images/home/home_price.png') },
              { key: 'news', title: 'Cẩm Nang', source: require('../../assets/images/home/home_tips.png') },
              { key: 'task', title: 'Lịch Hẹn', source: require('../../assets/images/home/home_incoming.png') },
              { key: 'profile', title: 'Hồ Sơ', source: require('../../assets/images/home/home_profile.png') },
              { key: 'promotion', title: 'Chương Trình\nKhuyến Mại', source: require('../../assets/images/home/home_history.png') },
              { key: 'location', title: 'Địa Điểm', source: require('../../assets/images/home/home_location.png') },
              { key: 'contact', title: 'Liên Hệ &\nTư Vấn', source: require('../../assets/images/home/home_contact.png') },
              { key: 'support', title: 'Hỗ Trợ', source: require('../../assets/images/home/home_support.png') },
            ]}
            renderItem={({ item }) => this.itemRender(item)}
          />
        </View>
        <View style={{
          position: 'absolute',
          alignItems: 'center',
          bottom: 0,
        }}
        >
          <TouchableOpacity onPress={() => this.props.navigation.navigate('CreateTask')}>
            <LinearGradient
              colors={[AppColors.primaryDark, AppColors.primaryLight]}
              style={styles.buttonStyle}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buttonText}>
                Đặt Lịch Hẹn
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <StatusBar barStyle="light-content" backgroundColor="#f8971b" />
      </View>
    );
  }
}

export default HomeScreen;
