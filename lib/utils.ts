export function formatToWon(price: number): string {
  return price.toLocaleString("ko-KR");
}
export function formatToTimeAgo(date: Date): string {
  const dayInMs = 1000 * 60 * 60 * 24;
  const hourInMs = 1000 * 60 * 60;
  const minuteInMs = 1000 * 60;
  const secondInMs = 1000;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  let diff = Math.round((time - now) / dayInMs);
  const formatter = new Intl.RelativeTimeFormat("ko");
  if (diff === 0) {
    diff = Math.round((time - now) / hourInMs);
    if (diff === 0) {
      diff = Math.round((time - now) / minuteInMs);
      if (diff === 0) {
        diff = Math.round((time - now) / secondInMs);
        return formatter.format(diff, "seconds");
      }
      return formatter.format(diff, "minutes");
    }
    return formatter.format(diff, "hours");
  }
  return formatter.format(diff, "days");

  // const created_at = new Date(date).getTime();
  // const now = new Date().getTime();
  // const ago = created_at - now;

  // const times: Intl.RelativeTimeFormatUnit[] = [
  //   "days",
  //   "hours",
  //   "minutes",
  //   "seconds",
  // ];
  // const timeInMs: { [key: string]: number } = {
  //   days: 1000 * 60 * 60 * 24,
  //   hours: 1000 * 60 * 60,
  //   minutes: 1000 * 60,
  //   seconds: 1000,
  // };
  // const formatter = new Intl.RelativeTimeFormat("ko");
  // let timesLength = 0;

  // return getDiff(ago, times, timeInMs, formatter, timesLength);
}

// function getDiff(
//   ago: number,
//   times: Intl.RelativeTimeFormatUnit[],
//   timeInMs: { [key: string]: number },
//   formatter: Intl.RelativeTimeFormat,
//   timesLength: number
// ) {
//   timesLength++;
//   const diff = Math.round(ago / timeInMs[times[timesLength]]);
//   console.log(diff);
//   if (diff === 0) {
//     if (timesLength === 3) {
//       return null;
//     }
//     getDiff(ago, times, timeInMs, formatter, timesLength);
//   }
//   return formatter.format(diff, times[timesLength]);
// }
