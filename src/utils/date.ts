import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isBetween from "dayjs/plugin/isBetween";
import localizedFormat from "dayjs/plugin/localizedFormat";
import type { OpenHours } from "../types/Restaurant";

dayjs.extend(weekday);
dayjs.extend(isBetween);
dayjs.extend(localizedFormat);

const indToDay = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

export const getOpenStatus = (
  hours: OpenHours
):
  | {
      open: true;
      closes: string;
    }
  | {
      open: false;
      opens: string;
    } => {
  const cur = dayjs();

  let dayInd = cur.day();
  let itemInd = 0;
  while (itemInd < hours[dayInd].length) {
    const item = hours[dayInd][itemInd];

    const start = dayjs().hour(item.startHour).minute(item.startMinute);
    const end = dayjs().hour(item.endHour).minute(item.endMinute);

    if (cur.isBetween(start, end)) {
      return {
        open: true,
        closes: `Closes at ${end.format("LT")}`,
      };
    }

    itemInd += 1;
  }

  dayInd = cur.add(1, "day").day();
  itemInd = 0;
  const item = hours[dayInd][itemInd];
  const start = dayjs().hour(item.startHour).minute(item.startMinute);

  return {
    open: false,
    opens: `Opens on ${start.format("ddd [at] LT")}`,
  };
};

export const formatOpenHours = (hours: OpenHours): string => {
  const times = Array(7).fill("");

  for (let i = 0; i < times.length; i += 1) {
    const start = hours[i][0];
    const startTime = dayjs().hour(start.startHour).minute(start.startMinute);
    const end = hours[i][hours[i].length - 1];
    const endTime = dayjs().hour(end.endHour).minute(end.endMinute);

    const formatted = `${startTime.format("LT")} - ${endTime.format("LT")}`;
    if (i === 0 || formatted !== times[i - 1]) {
      times[i] = formatted;
    }
  }

  let result = "";

  for (let i = 0; i < times.length; i += 1) {
    const time = times[i];

    if (time != null) {
      const start = indToDay[i];
      let end = "";

      while (i < 6 && times[i + 1] != null) {
        end = ` - ${indToDay[i + 1]}`;
        i += 1;
      }

      if (result.length > 0) result += ", ";
      result += `${start + end}: ${time}`;
    }
  }

  return result;
};
