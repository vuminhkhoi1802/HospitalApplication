import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { EvilIcons } from '@expo/vector-icons';
import DatePicker from 'react-native-datepicker';
import ModalSelector from 'react-native-modal-selector';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppColors } from '@app/config';
import { UserService } from '@app/services';
import { RadioGroup } from '@components/button';

const styles = StyleSheet.create({
  formContainer: {
    alignSelf: 'stretch',
    marginTop: 12,
  },
  formLabel: {
    color: 'gray',
  },
  formField: {
    color: 'black', height: 40, fontSize: 16, flex: 1,
  },
});

class AddMemberScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('memberProfile') ? 'Sửa Thành Viên' : 'Thêm Thành Viên',
  })

  state = {
    loading: true,
    memberProfile: {
      gender: 'MALE',
      weight: 0,
      height: 0,
    },
    bloods: [],
    relations: [],
  }

  componentWillMount() {
    const memberProfile = this.props.navigation.getParam('memberProfile', {
      gender: 'MALE',
      weight: 0,
      height: 0,
    });
    if (!memberProfile.gender) { memberProfile.gender = 'MALE'; }
    this.setState({ memberProfile, loading: false });
    this.genders.map((item) => {
      const gender = item;
      gender.selected = gender.value === memberProfile.gender;
      return gender;
    });
    this.fetchBloodType();
    this.fetchRelation();
  }

  fetchBloodType = () => {
    this.setState({ loading: true });
    UserService.getReference('BLOOD_TYPE').then(bloods => this.setState({
      loading: false,
      bloods,
    }));
  }

  fetchRelation = () => {
    this.setState({ loading: true });
    UserService.getReference('FAMILY_RELATION').then(relations => this.setState({
      loading: false,
      relations,
    }));
  }

  genders = [
    {
      label: 'Nam',
      value: 'MALE',
      color: AppColors.primary,
    },
    {
      label: 'Nữ',
      value: 'FEMALE',
      color: AppColors.primary,
    },
  ]

  submit = async () => {
    if (this.state.loading) {
      return;
    }
    if (!this.state.memberProfile.fullName || this.state.memberProfile.fullName === '') {
      Alert.alert('Xin hãy nhập tên!');
      return;
    }
    if (!this.state.memberProfile.birthday || this.state.memberProfile.birthday === '') {
      Alert.alert('Xin hãy nhập ngày sinh!');
      return;
    }
    if (!this.state.memberProfile.profileSubType || this.state.memberProfile.profileSubType === '') {
      Alert.alert('Xin hãy nhập quan hệ!');
      return;
    }
    if (!this.state.memberProfile.bloodType || this.state.memberProfile.bloodType === '') {
      Alert.alert('Xin hãy nhập nhóm máu!');
      return;
    }
    if (this.state.memberProfile.height < 0) {
      Alert.alert('Xin hãy nhập đúng chiều cao!');
      return;
    }
    if (this.state.memberProfile.weight < 0) {
      Alert.alert('Xin hãy nhập đúng cân nặng!');
      return;
    }

    this.setState({ ...this.state, loading: true });
    if (this.state.memberProfile.profileId) {
      UserService.updateMember(this.state.memberProfile)
        .then(() => {
          Alert.alert('Sửa Thành Viên', 'Thành Công', [
            {
              text: 'Đóng',
              onPress: () => {
                this.props.navigation.goBack();
                EventRegister.emit('profile_MemberUpdated');
              },
            },
          ]);
        }).catch((error) => {
          Alert.alert('Lỗi', error.message);
          this.setState({ ...this.state, loading: false });
        });
    } else {
      UserService.addMember(this.state.memberProfile)
        .then(() => {
          Alert.alert('Thêm Thành Viên', 'Thành Công', [
            {
              text: 'Đóng',
              onPress: () => {
                this.props.navigation.goBack();
                EventRegister.emit('profile_MemberUpdated');
              },
            },
          ]);
        }).catch((error) => {
          Alert.alert('Lỗi', error.message);
          this.setState({ ...this.state, loading: false });
        });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAwareScrollView style={{ padding: 12, flex: 1 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Họ và tên (*):</Text>
            <TextInput
              style={styles.formField}
              value={this.state.memberProfile.fullName}
              onChangeText={value => this.setState({
                memberProfile: { ...this.state.memberProfile, fullName: value },
                loading: this.state.loading,
              })}
              underlineColorAndroid="rgba(0,0,0,0)"
              keyboardType="ascii-capable"
              returnKeyType="next"
              blurOnSubmit={false}
            />
            <View style={{ backgroundColor: AppColors.primary, height: 1 }} />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Giới tính:</Text>
            <RadioGroup
              radioButtons={this.genders}
              onPress={data => this.setState({
                memberProfile: {
                  ...this.state.memberProfile,
                  gender: data.find(e => e.selected === true).value,
                },
                loading: this.state.loading,
              })}
              flexDirection="row"
            />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Ngày sinh (*):</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <DatePicker
                style={{ flex: 1 }}
                date={this.state.memberProfile.birthday}
                mode="date"
                format="DD/MM/YYYY"
                minDate="01/01/1900"
                maxDate={new Date()}
                confirmBtnText="Đồng Ý"
                cancelBtnText="Hủy"
                showIcon={false}
                customStyles={{
                  btnTextConfirm: { color: AppColors.primary },
                  dateInput: { alignItems: 'flex-start', borderWidth: 0 },
                }}
                onDateChange={date => this.setState({
                  memberProfile: {
                    ...this.state.memberProfile,
                    birthday: date,
                  },
                  loading: this.state.loading,
                })}
              />
              <EvilIcons name="calendar" size={24} color={AppColors.primary} />
            </View>
            <View style={{ backgroundColor: AppColors.primary, height: 1 }} />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Tên thường gọi:</Text>
            <TextInput
              style={styles.formField}
              value={this.state.memberProfile.nickName}
              onChangeText={value => this.setState({
                memberProfile: { ...this.state.memberProfile, nickName: value },
                loading: this.state.loading,
              })}
              underlineColorAndroid="rgba(0,0,0,0)"
              returnKeyType="next"
              blurOnSubmit={false}
            />
            <View style={{ backgroundColor: AppColors.primary, height: 1 }} />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Quan hệ (*):</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <ModalSelector
                data={this.state.relations}
                keyExtractor={relations => `${relations.value}`}
                labelExtractor={relations => relations.value}
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
                style={{ flex: 1, marginRight: 4 }}
                onChange={relation => this.setState({
                  memberProfile: {
                    ...this.state.memberProfile,
                    profileSubType: relation.value,
                  },
                })}
              >
                <Text style={{
                  color: 'black',
                  paddingTop: 10,
                  height: 40,
                  fontSize: 16,
                  flex: 1,
                }}
                >
                  {this.state.memberProfile.profileSubType ? this.state.memberProfile.profileSubType : ''}
                </Text>
              </ModalSelector>
              <EvilIcons name="chevron-down" size={24} color={AppColors.primary} />
            </View>
            <View style={{ backgroundColor: AppColors.primary, height: 1 }} />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Nhóm máu (*):</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <ModalSelector
                data={this.state.bloods}
                keyExtractor={bloods => `${bloods.value}`}
                labelExtractor={bloods => bloods.value}
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
                style={{ flex: 1, marginRight: 4 }}
                onChange={blood => this.setState({
                  memberProfile: {
                    ...this.state.memberProfile,
                    bloodType: blood.value,
                  },
                })}
              >
                <Text style={{
                  color: 'black',
                  paddingTop: 10,
                  height: 40,
                  fontSize: 16,
                  flex: 1,
                }}
                >
                  {this.state.memberProfile.bloodType ? this.state.memberProfile.bloodType : 'O'}
                </Text>
              </ModalSelector>
              <EvilIcons name="chevron-down" size={24} color={AppColors.primary} />
            </View>
            <View style={{ backgroundColor: AppColors.primary, height: 1 }} />
          </View>
          <View style={[styles.formContainer, { flexDirection: 'row' }]}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={styles.formLabel}>Chiều cao:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TextInput
                  style={styles.formField}
                  value={`${this.state.memberProfile.height}`}
                  onChangeText={value => this.setState({
                    memberProfile: {
                      ...this.state.memberProfile,
                      height: parseFloat(value, 10) || 0,
                    },
                    loading: this.state.loading,
                  })}
                  underlineColorAndroid="rgba(0,0,0,0)"
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <Text style={{ backgroundColor: AppColors.primary, color: 'white', padding: 12 }}>CM</Text>
              </View>
              <View style={{ backgroundColor: AppColors.primary, height: 1 }} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.formLabel}>Cân nặng:</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <TextInput
                  style={styles.formField}
                  value={`${this.state.memberProfile.weight}`}
                  onChangeText={value => this.setState({
                    memberProfile: {
                      ...this.state.memberProfile,
                      weight: parseFloat(value, 10) || 0,
                    },
                    loading: this.state.loading,
                  })}
                  underlineColorAndroid="rgba(0,0,0,0)"
                  keyboardType="numbers-and-punctuation"
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
                <Text style={{ backgroundColor: AppColors.primary, color: 'white', padding: 12 }}>KG</Text>
              </View>
              <View style={{ backgroundColor: AppColors.primary, height: 1 }} />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <TouchableOpacity
          style={{
            backgroundColor: AppColors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
          }}
          onPress={this.submit}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>Hoàn Tất</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default AddMemberScreen;
