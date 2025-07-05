package htmp.codien.quanlycodien.utils;

import org.apache.poi.ss.usermodel.*;

public class ExcelUtils {

    public static String getCellString(Row row, int index) {
        Cell cell = row.getCell(index);
        if (cell == null) return "";

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try {
                    switch (cell.getCachedFormulaResultType()) {
                        case STRING:
                            return cell.getStringCellValue().trim();
                        case NUMERIC:
                            return String.valueOf(cell.getNumericCellValue());
                        case BOOLEAN:
                            return String.valueOf(cell.getBooleanCellValue());
                        default:
                            return "";
                    }
                } catch (Exception e) {
                    return "";
                }
            default:
                return "";
        }
    }

    public static Double getCellDouble(Row row, int index) {
        Cell cell = row.getCell(index);
        if (cell == null) return 0.0;

        try {
            switch (cell.getCellType()) {
                case NUMERIC:
                    return cell.getNumericCellValue();
                case STRING:
                    return Double.parseDouble(cell.getStringCellValue().trim());
                case FORMULA:
                    if (cell.getCachedFormulaResultType() == CellType.NUMERIC) {
                        return cell.getNumericCellValue();
                    } else if (cell.getCachedFormulaResultType() == CellType.STRING) {
                        return Double.parseDouble(cell.getStringCellValue().trim());
                    }
                    return 0.0;
                default:
                    return 0.0;
            }
        } catch (Exception e) {
            return 0.0;
        }
    }

    // Bạn có thể bổ sung thêm:
    public static Boolean getCellBoolean(Row row, int index) {
        Cell cell = row.getCell(index);
        if (cell == null) return false;

        if (cell.getCellType() == CellType.BOOLEAN) {
            return cell.getBooleanCellValue();
        } else if (cell.getCellType() == CellType.STRING) {
            return Boolean.parseBoolean(cell.getStringCellValue().trim());
        }
        return false;
    }

    public static String getTrimmedString(Cell cell) {
        if (cell == null) return "";
        return cell.toString().trim();
    }
}
