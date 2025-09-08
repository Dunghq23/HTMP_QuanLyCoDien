package htmp.codien.quanlycodien.model.enums;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum WorkRequestStatus {
    SCHEDULED("Đã lên lịch"),
    UPDATED("Đã cập nhật"),
    CANCELED("Đã hủy"),
    PENDING_HEAD("Chờ trưởng phòng duyệt"),
    PENDING_DIRECTOR("Chờ giám đốc duyệt"),
    APPROVED("Đã phê duyệt"),
    REJECTED("Bị từ chối");

    private final String description;
}