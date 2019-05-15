import React from 'react';
import {
  View,
  Text,
  SectionList,
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { AppColors } from '@app/config';
import { ProviderService } from '@app/services';

class ProviderDetailsScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Chi Tiết',
  })

  static photoKeyGroups = {
    MAP: {
      value: 1,
      title: 'Bản đồ',
    },
    PROCESS: {
      value: 2,
      title: 'Quy trình',
    },
    CATALOG: {
      value: 3,
      title: 'Bảng giá',
    },
    CERTIFICATE: {
      value: 4,
      title: 'Bằng cấp',
    },
    PHOTO: {
      value: 5,
      title: 'Ảnh',
    },
  }

  static openLinkFromChild(child) {
    switch (child.type) {
      case 'FANPAGE':
      case 'WEBSITE':
        Linking.openURL(child.description).then().catch((() => {})); break;
      case 'PHONE':
        Linking.openURL(`tel:${child.description}`).then().catch((() => {})); break;
      case 'ADDRESS':
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${child.description}`).then().catch((() => {})); break;
      case 'EMAIL':
        Linking.openURL(`mailto:${child.description}`).then().catch((() => {})); break;
      default: break;
    }
  }

  state = {
    isLoading: true,
    provider: {},
    overview: [],
    photos: [],
  }

  componentDidMount() {
    ProviderService.getProvider(this.props.navigation.state.params.provider.profileId)
      .then((provider) => {
        const overview = [];
        if (provider.information && provider.information.length) {
          overview.push({
            title: 'THÔNG TIN CHI TIẾT',
            data: provider.information,
          });
        }
        if (provider.categories && provider.categories.length) {
          overview.push({
            title: 'LĨNH VỰC HOẠT ĐỘNG',
            data: provider.categories,
          });
        }
        this.setState({
          isLoading: false,
          provider,
          overview,
          photos: this.state.photos,
        });
        ProviderService.getPhoto(this.props.navigation.state.params.provider.profileId)
          .then((photos) => {
            if (!photos || !photos.length) {
              return;
            }
            const photoMap = photos.reduce((r, a) => {
              const result = r;
              result[a.groupKey] = r[a.groupKey] || [];
              result[a.groupKey].push(a);
              return result;
            }, Object.create(null));
            const overviewPhotos = [];
            Object.keys(photoMap).forEach((key) => {
              const photoArray = photoMap[key];
              if (photoArray && photoArray.length) {
                overviewPhotos.push({ key, data: [{ children: photoArray }] });
              }
            });
            const supportedGroups = ProviderDetailsScreen.photoKeyGroups;
            const filteredAndSortedOverviewPhotos = overviewPhotos
              .filter(map => supportedGroups[map.key].value)
              .sort((l, r) => supportedGroups[l.key].value > supportedGroups[r.key].value)
              .map((item) => {
                const rename = item;
                rename.title = supportedGroups[rename.key].title;
                return rename;
              });
            this.renderPhoto(filteredAndSortedOverviewPhotos);
          })
          .catch(() => {});
      }).catch((error) => {
        this.setState({ ...this.state, isLoading: false });
        Alert.alert('Lỗi', error.message);
      });
  }

  renderPhoto(filteredAndSortedOverviewPhotos) {
    const { overview } = this.state;
    overview.push(...filteredAndSortedOverviewPhotos);
    const photos = filteredAndSortedOverviewPhotos
      .map(sectionedPhotos => sectionedPhotos.data)
      .reduce((flatten, data) => flatten.concat(data), [])
      .map(data => data.children)
      .reduce((flatten, children) => flatten.concat(children), [])
      .map(photo => ({ url: photo.name, id: photo.sphotoId }));
    this.setState({
      isLoading: false,
      provider: this.state.provider,
      overview,
      photos,
    });
  }

  static renderChildDescription(children) {
    const views = [];
    for (let index = 0; index < children.length; index += 1) {
      const child = children[index];
      switch (child.type) {
        case 'FANPAGE':
        case 'WEBSITE':
        case 'PHONE':
        case 'ADDRESS':
        case 'EMAIL':
          views.push(
            <TouchableOpacity style={{ marginLeft: 8, marginTop: 8 }} onPress={() => this.openLinkFromChild(child)} key={child + index}>
              <Text style={{ color: '#273BD4' }}>{child.description}</Text>
            </TouchableOpacity>,
          );
          break;
        default:
          views.push(<Text style={{ color: '#222', marginLeft: 8, marginTop: 8 }} key={child + index}>{child.description}</Text>);
          break;
      }
    }
    return views;
  }

  renderPhotoGallery(photos) {
    const views = [];
    for (let index = 0; index < photos.length; index += 1) {
      const overallIndex = this.state.photos.findIndex(photo => photo.id === photos[index].sphotoId);
      const image = (
        <TouchableOpacity
          style={{ width: 120, height: 120, marginRight: 12 }}
          key={photos[index].sphotoId}
          onPress={() => this.props.navigation.navigate('ProviderPhotoView', { images: this.state.photos, index: overallIndex })}
        >
          <Image
            style={{ width: 120, height: 120 }}
            source={{ uri: photos[index].name }}
          />
        </TouchableOpacity>
      );
      views.push(image);
    }
    return (
      <ScrollView horizontal style={{ height: 144, alignSelf: 'stretch', padding: 12 }}>
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white' }}>{views}</View>
      </ScrollView>
    );
  }

  renderItem(item) {
    if (item.title) {
      // information
      return (
        <View style={{ padding: 12 }}>
          <Text style={{ color: '#aaa' }} key={item.title}>{item.title}</Text>
          {ProviderDetailsScreen.renderChildDescription(item.children)}
        </View>);
    }
    if (item.categoryId) {
      // category
      return (
        <View style={{ padding: 12 }}>
          <Text style={{ color: '#222', marginLeft: 8, marginTop: 8 }} key={item.categoryId}>{item.name}</Text>
        </View>);
    }
    if (item.children && item.children.length) {
      // all photo
      return this.renderPhotoGallery(item.children);
    }
    return (<View />);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View
          style={{
            height: 210,
            marginHorizontal: 16,
            marginVertical: 24,
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              shadowColor: '#000000',
              shadowOpacity: 0.3,
              shadowRadius: 3,
              shadowOffset: { width: 0, height: 0 },
              width: 96,
              height: 96,
              elevation: 4,
              borderColor: '#00000022',
              borderWidth: 0.2,
              borderRadius: 48,
              zIndex: 10,
            }}
          >
            <View style={{
              width: 96,
              height: 96,
              overflow: 'hidden',
              borderRadius: 48,
              backgroundColor: 'white',
            }}
            >
              <Image
                style={{ width: 96, height: 96, position: 'absolute' }}
                resizeMode="contain"
                source={require('../../assets/images/auth/logo.png')}
              />
              <Image
                style={{ width: 96, height: 96, position: 'absolute' }}
                resizeMode="cover"
                source={{ uri: this.state.provider.avatar }}
              />
            </View>
          </View>
          <View style={{
            flex: 1,
            marginTop: -48,
            paddingTop: 56,
            alignItems: 'center',
            alignSelf: 'stretch',
            backgroundColor: AppColors.primary,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>{this.state.provider.fullName}</Text>
            <View style={{
              margin: 16,
              borderColor: 'white',
              borderWidth: 1,
              borderRadius: 4,
              alignSelf: 'stretch',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            >
              <Text style={{ color: 'white', fontSize: 21, fontWeight: '700' }}>{parseFloat(this.state.provider.successRate) || 0}%</Text>
              <Text style={{ color: 'white', fontSize: 16 }}>Thích</Text>
            </View>
          </View>
        </View>
        <View style={{
          height: 1,
          backgroundColor: 'white',
          shadowColor: 'black',
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 2 },
          elevation: 1,
          marginBottom: 1,
          zIndex: 11,
        }}
        />
        <SectionList
          renderItem={({ item }) => this.renderItem(item)}
          renderSectionHeader={({ section: { title } }) => (
            <View style={{ flex: 1, backgroundColor: '#aaa2' }}>
              <View style={{
                backgroundColor: 'white',
                paddingTop: 16,
                marginTop: 12,
                shadowColor: 'black',
                shadowOpacity: 0.05,
                shadowOffset: { width: 0, height: -2 },
                elevation: 3,
              }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' }}>
                  <View style={{
                    width: 2,
                    height: 24,
                    backgroundColor: AppColors.primary,
                    marginLeft: 16,
                    marginRight: 8,
                    marginVertical: 12,
                  }}
                  />
                  <Text style={{ flex: 1, fontSize: 18, color: '#444' }}>{title.toUpperCase()}</Text>
                </View>
              </View>
            </View>
          )}
          sections={this.state.overview}
          stickySectionHeadersEnabled={false}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    );
  }
}

export default ProviderDetailsScreen;
