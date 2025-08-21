package htmp.codien.quanlycodien.utils;

public class StringUtils {

    // Viết hoa chữ cái đầu mỗi từ, các chữ còn lại viết thường
    public static String capitalizeFirstLetterEachWord(String input) {
        if (input == null || input.trim().isEmpty()) {
            return null;
        }
        String[] words = input.trim().toLowerCase().split("\\s+");
        StringBuilder result = new StringBuilder();
        for (String word : words) {
            result.append(Character.toUpperCase(word.charAt(0)))
                    .append(word.substring(1))
                    .append(" ");
        }
        return result.toString().trim();
    }

    // Viết hoa toàn bộ
    public static String toUpperCase(String input) {
        return input != null ? input.trim().toUpperCase() : null;
    }
}
