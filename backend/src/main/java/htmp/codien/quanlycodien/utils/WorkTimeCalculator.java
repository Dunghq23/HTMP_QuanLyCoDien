package htmp.codien.quanlycodien.utils;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.function.Function;

public class WorkTimeCalculator {

    public static <T> long calculateTotalMinutes(
            List<T> tasks,
            Function<T, LocalTime> startGetter,
            Function<T, LocalTime> endGetter) {

        if (tasks == null || tasks.isEmpty())
            return 0;

        // Chuyển sang list interval
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
                Interval last = merged.get(merged.size() - 1);
                if (!i.start.isAfter(last.end)) {
                    last.end = i.end.isAfter(last.end) ? i.end : last.end;
                } else {
                    merged.add(i);
                }
            }
        }

        long totalMinutes = 0;
        for (Interval i : merged) {
            totalMinutes += java.time.Duration.between(i.start, i.end).toMinutes();
        }

        return totalMinutes;
    }

    private static class Interval {
        LocalTime start;
        LocalTime end;

        Interval(LocalTime s, LocalTime e) {
            start = s;
            end = e;
        }
    }
}