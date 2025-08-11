package htmp.codien.quanlycodien.dto.newModel;


import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class HandoverMinutesRequest {
    Long employeeId;
    Long productId;

    // Trường chung
    String benB;           // Bộ phận nhận
    String receiver;       // Người nhận
    String employeeCode;   // Mã nhân viên
    String position;       // Chức vụ
    String handoverType;   // "TAYGA", "BANCAT", "JIG"

    // Trường riêng cho TAYGA
    Integer cutLoai1;
    Integer cutLoai2;
    Integer numLoai1;
    Integer numLoai2;
    Integer kimGapGate;
    Integer kimKepSanPham;

    // Trường riêng cho BANCAT
    Integer thanKimLoai1;
    Integer thanKimLoai2;
    Integer luoiKimLoai1;
    Integer luoiKimLoai2;

    // Trường riêng cho JIG
    String jigDetailName; // Tên JIG
    Integer numberOfJigs;
    String note; // Ghi chú
}