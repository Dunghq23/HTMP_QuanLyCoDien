package htmp.codien.quanlycodien.utils;

import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Function;

public class WorkTimeCalculator {

    public static <T> long calculateTotalMinutes(
            List<T> tasks,
            Function<T, LocalTime> startGetter,
            Function<T, LocalTime> endGetter,
            List<Interval> breaks // thêm list break
    ) {
        if (tasks == null || tasks.isEmpty())
            return 0;

        // Chuyển tasks sang interval
        List<Interval> intervals = new ArrayList<>();
        for (T task : tasks) {
            LocalTime start = startGetter.apply(task);
            LocalTime end = endGetter.apply(task);
            if (start != null && end != null && !end.isBefore(start)) {
                intervals.add(new Interval(start, end));
            }
        }

        // Gộp interval trùng lặp
        intervals.sort(Comparator.comparing(i -> i.start));
        List<Interval> merged = new ArrayList<>();
        for (Interval i : intervals) {
            if (merged.isEmpty()) {
                merged.add(i);
            } else {
                Interval last = merged.get(merged.size() - 1); // Tham chiếu tới phần tử Interval trong ist merged
                if (!i.start.isAfter(last.end)) {
                    last.end = i.end.isAfter(last.end) ? i.end : last.end;
                } else {
                    merged.add(i);
                }
            }
        }

        // Trừ break time ra
        long totalMinutes = 0;
        for (Interval work : merged) {
            List<Interval> cut = subtractBreaks(work, breaks);
            for (Interval c : cut) {
                totalMinutes += Duration.between(c.start, c.end).toMinutes();
            }
        }

        return totalMinutes;
    }

    // Hàm trừ break khỏi work interval
    private static List<Interval> subtractBreaks(Interval work, List<Interval> breaks) {
        List<Interval> result = new ArrayList<>();
        result.add(work);

        if (breaks == null)
            return result;

        for (Interval br : breaks) {
            List<Interval> newResult = new ArrayList<>();

            for (Interval current : result) {
                // Không overlap
                if (br.end.isBefore(current.start) || br.start.isAfter(current.end)) {
                    newResult.add(current);
                    continue;
                }

                // Break nằm giữa
                if (br.start.isAfter(current.start) && br.end.isBefore(current.end)) {
                    newResult.add(new Interval(current.start, br.start));
                    newResult.add(new Interval(br.end, current.end));
                }
                // Break cắt đầu
                else if (br.start.isBefore(current.start) && br.end.isBefore(current.end)) {
                    newResult.add(new Interval(br.end, current.end));
                }
                // Break cắt cuối
                else if (br.start.isAfter(current.start) && br.end.isAfter(current.end)) {
                    newResult.add(new Interval(current.start, br.start));
                }
                // Break bao toàn bộ
                else {
                    // bỏ hết
                }
            }

            result = newResult;
        }

        return result;
    }

    // Class tiện ích
    public static class Interval {
        public LocalTime start;
        public LocalTime end;

        public Interval(LocalTime s, LocalTime e) {
            start = s;
            end = e;
        }

        @Override
        public String toString() {
            return start + " - " + end;
        }
    }
}
