import * as dayJs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayJs.extend(utc);
dayJs.extend(timezone);

export function getDayRangeWib(date?: string) {
  const targetDate = date ? dayJs(date) : dayJs();

  const startOfDay = targetDate.tz('Asia/Jakarta').startOf('minute').toDate();
  const endOfDay = targetDate.tz('Asia/Jakarta').endOf('minute').toDate();

  return {
    startOfDay,
    endOfDay,
  };
}
