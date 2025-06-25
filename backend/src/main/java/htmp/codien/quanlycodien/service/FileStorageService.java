package htmp.codien.quanlycodien.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    // Lưu file và trả về tên file duy nhất
    public String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty())
            return null;

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filename;
    }

    // Trả về tài nguyên ảnh (dùng nếu bạn muốn show ảnh)
    public Resource loadFile(String filename) throws MalformedURLException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        return new UrlResource(filePath.toUri());
    }

    // Xóa file theo tên
    public void deleteFile(String fileName) {
        try {
            Path file = Paths.get(uploadDir).resolve(fileName).normalize();
            Files.deleteIfExists(file);
        } catch (IOException e) {
            System.err.println("Không thể xóa file: " + fileName + ". Lỗi: " + e.getMessage());
        }
    }
}
