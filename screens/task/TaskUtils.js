function formatInteger(num, length) {
  let r = `${num}`;
  while (r.length < length) {
    r = `0${r}`;
  }
  return r;
}

function formatDate(start) {
  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) {
    return '';
  }
  let hour = startDate.getHours();
  let am;
  if (hour >= 12) {
    am = 'Chiều';
    if (hour > 12) { hour -= 12; }
  } else {
    am = 'Sáng';
  }
  const minute = startDate.getMinutes();
  let hourElement;
  if (minute >= 30) {
    hourElement = `${formatInteger(hour, 2)}:${formatInteger(minute, 2)} - ${formatInteger(hour + 1, 2)}:00`;
  } else {
    hourElement = `${formatInteger(hour, 2)}:${formatInteger(minute, 2)} - ${formatInteger(hour, 2)}:30`;
  }
  const dayElement = `${formatInteger(startDate.getDate(), 2)}/${formatInteger(startDate.getMonth() + 1, 2)}/${startDate.getFullYear()}`;
  return `${dayElement} ${hourElement} ${am}`;
}

function formatStatus(status) {
  switch (status) {
    case 'CREATED': return 'Chờ phản hồi';
    case 'POSTPONED': return 'Thay đổi';
    case 'ACCEPTED': return 'Thống nhất';
    case 'CONFIRMED': return 'Hẹn khám';
    case 'IN_WORKING': return 'Đang khám';
    case 'CANCELLED': return 'Bỏ khám';
    case 'DECLINED': return 'Huỷ khám';
    case 'CLOSED': return 'Kết thúc';
    case 'IN_PROGRESS': return 'Đang xử lý';
    case 'BOOKED': return 'Đã hẹn';
    default: return '';
  }
}

const TaskUtils = { formatDate, formatStatus };
export default TaskUtils;
