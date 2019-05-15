import React from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { Entypo } from '@expo/vector-icons';
import { AppColors } from '@app/config';
import { ProviderService } from '@app/services';
import TaskUtils from './TaskUtils';

class TaskProviderScheduleScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.provider ? navigation.state.params.provider.fullName : '',
  })

  static workingTimes = []
  static workingWeekDays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

  static buildMonths() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return Array(4).fill().map((_, i) => i).map(index => ({
      originMonth: currentMonth + index,
      month: (currentMonth + index) % 12,
      year: currentMonth + index >= 12 ? currentYear + 1 : currentYear,
    }));
  }

  static buildDays(date) {
    const today = new Date();
    const weekDays = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const numberOfDayInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let dates = [];
    let i = 0;
    if (today.getMonth() === date.getMonth()
      && today.getFullYear() === date.getFullYear()) {
      if (today.getHours() < 23 || today.getMinutes() < 30) {
        // we are not at last block of day yet
        dates.push(today.getDate() - 1);
      }
      for (i = today.getDate(); i < numberOfDayInMonth; i += 1) {
        dates.push(i);
      }
    } else {
      dates = Array(numberOfDayInMonth).fill().map((_, index) => index);
    }
    return dates.map(index => ({
      day: index + 1,
      date: new Date(date.getFullYear(), date.getMonth(), index + 1),
    })).map(item => ({
      day: item.day,
      weekDay: weekDays[item.date.getDay()],
      date: item.date,
    }));
  }

  static buildBlocks(date) {
    const today = new Date();
    let hours = [];
    let i = 0;
    const blocks = [];
    const beginOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0, 0, 0, 0,
    ).getTime();

    if (today.getMonth() === date.getMonth()
      && today.getFullYear() === date.getFullYear()
      && today.getDate() === date.getDate()) {
      for (i = today.getHours() + 1; i < 24; i += 1) {
        hours.push(i);
      }
      // check if not due to half of previous hour
      if (today.getMinutes() < 30) {
        const hour = today.getHours();
        blocks.push({
          id: (hour * 2) + 1,
          startDate: beginOfDay + (hour * 3600 * 1000) + (30 * 60 * 1000),
          endDate: beginOfDay + (hour * 3600 * 1000) + (60 * 59 * 1000), // subtract 1 second
          label: `${hour}:30 - ${hour + 1}:00`,
        });
      }
    } else {
      hours = Array(24).fill().map((_, i) => i);
    }

    hours.forEach((hour) => {
      blocks.push({
        id: hour * 2,
        startDate: beginOfDay + (hour * 3600 * 1000),
        endDate: beginOfDay + (hour * 3600 * 1000) + (30 * 59 * 1000), // subtract 1 second
        label: `${hour}:00 - ${hour}:30`,
      });
      blocks.push({
        id: (hour * 2) + 1,
        startDate: beginOfDay + (hour * 3600 * 1000) + (30 * 60 * 1000),
        endDate: beginOfDay + (hour * 3600 * 1000) + (60 * 59 * 1000), // subtract 1 second
        label: `${hour}:30 - ${hour + 1}:00`,
      });
    });
    return blocks;
  }

  // after merging, each block should contains statuses:
  // 'NONE' (available), 'BUSY' (if exist in schedule), 'NOT_AVAILALBLE' (filter from workingTime)
  static mergeBlocks(blocks, schedules) {
    return blocks.map((item) => {
      const block = item;
      const busyBlock = schedules.findIndex(schedule => schedule.startDate === block.startDate);
      if (busyBlock >= 0) {
        block.status = 'BUSY';
      } else {
        block.status = this.isBlockInWorkingTime(block) ? 'NONE' : 'NOT_AVAILALBLE';
      }
      return block;
    });
  }

  static isBlockInWorkingTime(block) {
    const blockStartDate = new Date(block.startDate);
    const blockEndDate = new Date(block.endDate);
    const dayInWeekOfDate = this.workingWeekDays[blockStartDate.getDay()];
    for (let i = 0; i < this.workingTimes.length; i += 1) {
      const wtBlock = this.workingTimes[i];
      if (wtBlock.period.includes(dayInWeekOfDate)) {
        if (this.totalMinsInDay(blockStartDate) >= this.totalMinsInUTCDay(wtBlock.startTime)
          && this.totalMinsInDay(blockEndDate) <= this.totalMinsInUTCDay(wtBlock.endTime)) {
          return true;
        }
      }
    }
    return false;
  }

  static totalMinsInDay = date => (date.getHours() * 60) + date.getMinutes()

  static totalMinsInUTCDay(milliseconds) {
    const date = new Date(milliseconds);
    const value = (date.getUTCHours() * 60) + date.getUTCMinutes();
    if (value === 0) {
      return 24 * 60;
    }
    return value;
  }

  constructor(props) {
    super(props);
    const today = new Date();
    let { date } = props.navigation.state.params.taskForm;
    const parts = date.split('/');
    date = new Date(parts[2], parts[1] - 1, parts[0]);
    let selectedMonth = date.getMonth();
    if (date.getFullYear() > today.getFullYear()) {
      // user has chosen next year as date
      selectedMonth += 12;
    }
    this.state = {
      isLoading: false,
      taskForm: props.navigation.state.params.taskForm,
      provider: props.navigation.state.params.provider,
      calendar: {
        months: TaskProviderScheduleScreen.buildMonths(),
        selectedMonth,
        days: TaskProviderScheduleScreen.buildDays(date),
        selectedDay: date.getDate(),
        blocks: TaskProviderScheduleScreen.buildBlocks(date),
      },
    };

    this.loadWorkingTime();
  }

  componentDidMount() {
    let index = this.state.calendar.months
      .findIndex(item => item.originMonth === this.state.calendar.selectedMonth);
    this.monthList.scrollToOffset({ offset: 120 * index, animated: true });

    index = this.state.calendar.days
      .findIndex(item => item.day === this.state.calendar.selectedDay);
    setTimeout(() => this.dayList.scrollToOffset({ offset: 57 * index, animated: false }), 10);

    this.loadSchedule();
  }

  setMonth(month) {
    if (month === this.state.calendar.selectedMonth) {
      return;
    }
    const year = new Date().getFullYear() + (month >= 12 ? 1 : 0);
    const days = TaskProviderScheduleScreen.buildDays(new Date(year, month % 12, 1));
    this.setState({
      isLoading: false,
      taskForm: this.state.taskForm,
      provider: this.state.provider,
      calendar: {
        ...this.state.calendar,
        selectedMonth: month,
        days,
        selectedDay: days[0].day,
        blocks: TaskProviderScheduleScreen.buildBlocks(days[0].date),
      },
    });

    let index = this.state.calendar.months.findIndex(item => item.originMonth === month);
    this.monthList.scrollToOffset({ offset: 120 * index, animated: true });

    index = this.state.calendar.days
      .findIndex(item => item.day === this.state.calendar.selectedDay);
    setTimeout(() => this.dayList.scrollToOffset({ offset: 0, animated: true }), 100);
    this.loadSchedule();
  }

  setDay(selectedDay) {
    if (selectedDay === this.state.calendar.selectedDay) {
      return;
    }
    const month = this.state.calendar.selectedMonth;
    const year = new Date().getFullYear() + (month >= 12 ? 1 : 0);
    const date = new Date(year, month % 12, selectedDay);
    this.setState({
      isLoading: false,
      taskForm: this.state.taskForm,
      provider: this.state.provider,
      calendar: {
        ...this.state.calendar,
        selectedDay,
        blocks: TaskProviderScheduleScreen.buildBlocks(date),
      },
    });

    this.loadSchedule();
  }

  createTask(selectedBlock) {
    if (selectedBlock.status !== 'NONE') {
      return;
    }
    this.setState({ ...this.state, isLoading: true });
    ProviderService.createTask(
      this.state.provider.profileId,
      selectedBlock.startDate,
      selectedBlock.endDate,
      this.state.taskForm,
    ).then(() => {
      const message = `Bạn đã đặt thành công lịch hẹn vào ngày ${TaskUtils.formatDate(selectedBlock.startDate)}`;
      Alert.alert('Thành Công', message, [
        {
          text: 'OK',
          onPress: () => {
            this.props.navigation.navigate('Home');
            EventRegister.emit('task_Updated');
          },
        },
      ]);
    }).catch((error) => {
      Alert.alert('Lỗi', error.message);
      this.setState({ ...this.state, isLoading: false });
    });
  }

  loadSchedule() {
    const { selectedMonth, selectedDay } = this.state.calendar;
    const year = new Date().getFullYear() + (selectedMonth >= 12 ? 1 : 0);
    const startDate = new Date(year, selectedMonth % 12, selectedDay, 0, 0, 0, 0).getTime();
    const endDate = new Date(year, selectedMonth % 12, selectedDay, 23, 59, 59, 999).getTime();
    ProviderService.getSchedule(this.state.provider.profileId, startDate, endDate)
      .then((schedules) => {
        // merge schedules with blocks
        this.setState({
          isLoading: false,
          taskForm: this.state.taskForm,
          provider: this.state.provider,
          calendar: {
            ...this.state.calendar,
            blocks: TaskProviderScheduleScreen.mergeBlocks(this.state.calendar.blocks, schedules),
            selectedBlock: null,
          },
        }, () => {
          const index = this.state.calendar.blocks.findIndex(i => i.status === 'NONE');
          if (index >= 0) {
            this.blockList.scrollToOffset({ offset: 76 * index, animated: true });
          }
        });
      })
      .catch((error) => {
        Alert.alert('Lỗi', error.message);
        this.blockList.scrollToOffset({ offset: 0, animated: true });
      });
  }

  loadWorkingTime() {
    ProviderService.getWorkingTime(this.state.provider.profileId)
      .then((workingTimes) => {
        TaskProviderScheduleScreen.workingTimes = workingTimes;
        this.loadSchedule();
      })
      .catch(() => {});
  }

  renderDivider(dayIndex) {
    if (dayIndex === this.state.calendar.selectedDay) {
      return (<View style={{
        backgroundColor: '#05c886',
        width: 4,
        flex: 1,
      }}
      />);
    }
    return (<View style={{
      backgroundColor: '#ccc6',
      width: 1,
      marginLeft: 3,
      flex: 1,
    }}
    />);
  }

  static renderBlockIndicator(item) {
    let status = 'Không khám';
    let color = '#eee8'; // block background
    let indicatorColor = '#6666'; // indicator background
    if (item.status === 'BUSY') { status = 'Bận khám'; color = 'red'; indicatorColor = 'white'; }
    if (item.status === 'NONE') { status = 'Chọn'; color = '#05c886'; indicatorColor = 'white'; }
    return (
      <View style={{
        width: 56,
        alignSelf: 'stretch',
        backgroundColor: color,
        borderBottomRightRadius: 2,
        borderTopRightRadius: 2,
      }}
      >
        <View style={{
          marginTop: 16,
          marginLeft: 20,
          width: 28,
          height: 2,
          borderRadius: 2,
          backgroundColor: indicatorColor,
          marginBottom: 8,
        }}
        />
        <Text style={{ color: indicatorColor, fontSize: 11, marginLeft: 12 }}>{status}</Text>
      </View>
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
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{
          backgroundColor: AppColors.primary,
          height: 48,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <FlatList
            contentContainerStyle={{ paddingLeft: (Dimensions.get('window').width / 2) - 60 }}
            horizontal
            ref={(list) => { this.monthList = list; }}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={this.state.calendar.months}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => this.setMonth(item.originMonth)}
                style={{ width: 120, height: 48, paddingVertical: 12 }}
              >
                <View style={{ flex: 1, alignItems: 'center', flexDirection: 'column' }}>
                  <Text style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: 15,
                    paddingHorizontal: 24,
                  }}
                  >
                    Tháng {item.month + 1}
                  </Text>
                  <View style={{
                    alignSelf: 'stretch',
                    backgroundColor: this.state.calendar.selectedMonth === item.originMonth ? 'white' : '#0000',
                    marginHorizontal: 48,
                    borderRadius: 2,
                    marginTop: 4,
                    height: 2,
                  }}
                  />
                </View>
              </TouchableOpacity>
              )
            }
            keyExtractor={item => `${item.originMonth}`}
          />
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{
            width: 88,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          >
            <FlatList
              ref={(list) => { this.dayList = list; }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={this.state.calendar.days}
              ItemSeparatorComponent={() => (<View style={{ backgroundColor: '#ccc6', height: 1, marginRight: 8 }} />)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => this.setDay(item.day)}
                  style={{ width: 88, height: 56 }}
                >
                  <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                    <View style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      flexDirection: 'column',
                      padding: 8,
                      backgroundColor: item.day === this.state.calendar.selectedDay ? '#eee1' : '#0000',
                    }}
                    >
                      <Text style={{
                        color: '#111',
                        fontWeight: '400',
                        fontSize: 15,
                        marginBottom: 4,
                      }}
                      >
                        {item.day}
                      </Text>
                      <Text style={{
                        color: '#444',
                        fontSize: 12,
                      }}
                      >
                        {item.weekDay}
                      </Text>
                    </View>
                    <View style={{ width: 4, alignSelf: 'stretch' }}>
                      {this.renderDivider(item.day)}
                    </View>
                    <Entypo
                      name="triangle-right"
                      size={12}
                      color={item.day === this.state.calendar.selectedDay ? '#05c886' : '#0000'}
                      style={{ marginLeft: -3 }}
                    />
                  </View>
                </TouchableOpacity>
                )
              }
              keyExtractor={item => `${item.day}`}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              ref={(list) => { this.blockList = list; }}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              data={this.state.calendar.blocks}
              extraData={this.state.calendar.selectedBlock}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => this.createTask(item)} style={{ height: 76 }}>
                  <View
                    style={{
                      shadowColor: '#000000',
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      shadowOffset: { width: 0, height: 0 },
                      height: 60,
                      margin: 8,
                      backgroundColor: 'white',
                      borderRadius: 4,
                      elevation: 2,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{
                      flex: 1,
                      alignItems: 'flex-end',
                      flexDirection: 'column',
                      padding: 8,
                      backgroundColor: item.day === this.state.calendar.selectedDay ? '#eee1' : '#0000',
                    }}
                    >
                      <Text style={{ color: '#999', fontSize: 11, marginBottom: 4 }}>Thời gian</Text>
                      <Text style={{ color: '#333', fontSize: 18, fontWeight: '400' }}>{item.label}</Text>
                    </View>
                    {TaskProviderScheduleScreen.renderBlockIndicator(item)}
                  </View>
                </TouchableOpacity>
                )
              }
              keyExtractor={item => `${item.id}`}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default TaskProviderScheduleScreen;
