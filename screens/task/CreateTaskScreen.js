import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners';
import DatePicker from 'react-native-datepicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalSelector from 'react-native-modal-selector';
import { AppColors } from '@app/config';
import { UserService } from '@app/services';
import CheckBox from 'react-native-check-box';

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

class CreateTaskScreen extends React.Component {
  static navigationOptions = () => ({
    title: 'Đặt Lịch Hẹn',
  })

  constructor(props) {
    super(props);
    const today = new Date();
    this.state = {
      taskForm: {
        member: {},
        note: '',
        date: `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`,
        extra: {
          pickup: false,
        },
      },
      members: [],
      showMemberPicker: false,
    };
  }

  componentDidMount() {
    this.id = EventRegister.addEventListener('profile_MemberUpdated', () => this.reloadMember());
    this.reloadMember();
  }

  componentWillUnmount() {
    EventRegister.removeEventListener(this.id);
  }

  reloadMember() {
    UserService.getMembers().then((originMembers) => {
      const members = [{ profileId: 0, fullName: 'Chọn Thành Viên', section: true }, ...originMembers];
      if (members.length === 1) {
        this.setState({
          taskForm: this.state.taskForm,
          members,
          showMemberPicker: this.state.showMemberPicker,
        });
      } else {
        this.setState({
          taskForm: { ...this.state.taskForm, member: members[1] },
          members,
          showMemberPicker: this.state.showMemberPicker,
        });
      }
    });
  }

  submit = async () => {
    if (!this.state.taskForm.member.profileId) {
      Alert.alert('Xin hãy chọn thành viên!');
      return;
    }
    this.props.navigation.navigate('TaskProviderPicker', { taskForm: this.state.taskForm });
  }

  render() {
    const today = new Date();
    const next3Month = new Date(today.getFullYear(), today.getMonth() + 4, 0);
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAwareScrollView style={{ padding: 12, flex: 1 }} keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Thành viên:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <ModalSelector
                data={this.state.members}
                keyExtractor={member => `${member.profileId}`}
                labelExtractor={member => member.fullName}
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
                onChange={member => this.setState({
                  taskForm: { ...this.state.taskForm, member },
                  members: this.state.members,
                  showMemberPicker: false,
                })}
              >
                <Text style={[...styles.formField]}>{this.state.taskForm.member.fullName}</Text>
              </ModalSelector>
              <EvilIcons name="chevron-down" size={24} color={AppColors.primary} />
              <TouchableOpacity
                style={{
                  backgroundColor: AppColors.primary,
                  borderRadius: 16,
                  marginLeft: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 32,
                  width: 96,
                  paddingHorizontal: 12,
                }}
                onPress={() => this.props.navigation.navigate('AddMember')}
              >
                <Text style={{ color: 'white', fontSize: 14 }}>Thêm</Text>
              </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: AppColors.primary, height: 1, marginRight: 108 }} />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Ngày hẹn:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <DatePicker
                style={{ flex: 1 }}
                date={this.state.taskForm.date}
                mode="date"
                format="DD/MM/YYYY"
                minDate={new Date()}
                maxDate={next3Month}
                confirmBtnText="Đồng Ý"
                cancelBtnText="Hủy"
                showIcon={false}
                customStyles={{
                  btnTextConfirm: { color: AppColors.primary },
                  dateInput: { alignItems: 'flex-start', borderWidth: 0 },
                }}
                timeZoneOffsetInMinutes={(-1) * ((new Date()).getTimezoneOffset() / 60) * 60}
                onDateChange={date => this.setState({
                  taskForm: { ...this.state.taskForm, date },
                  members: this.state.members,
                })}
              />
              <EvilIcons name="calendar" size={24} color={AppColors.primary} />
            </View>
            <View style={{ backgroundColor: AppColors.primary, height: 1 }} />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Bạn có muốn yêu cầu xe đến đón?</Text>
            <CheckBox
              style={{ flex: 1, marginTop: 12 }}
              checkBoxColor={AppColors.primary}
              isChecked={this.state.taskForm.extra.pickup}
              onClick={() => this.setState({
                taskForm: {
                  ...this.state.taskForm,
                  extra: { pickup: !this.state.taskForm.extra.pickup },
                },
                members: this.state.members,
              })}
              leftText="Xe đưa đón"
            />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.formLabel}>Ghi chú:</Text>
            <TextInput
              style={[...styles.formField, { height: 80 }]}
              value={this.state.taskForm.note}
              onChangeText={value => this.setState({
                taskForm: { ...this.state.taskForm, note: value },
                members: this.state.members,
              })}
              underlineColorAndroid="rgba(0,0,0,0)"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              returnKeyType="next"
              blurOnSubmit={false}
              multiline
            />
            <View style={{ backgroundColor: AppColors.primary, height: 1 }} />
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
          disabled={!this.state.taskForm.member}
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: '500' }}>Chọn Bác Sĩ</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default CreateTaskScreen;
