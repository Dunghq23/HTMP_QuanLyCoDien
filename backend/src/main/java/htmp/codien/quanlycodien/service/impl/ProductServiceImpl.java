package htmp.codien.quanlycodien.service.impl;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.lowagie.text.pdf.BaseFont;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import htmp.codien.quanlycodien.dto.HandoverMinutesRequest;
import htmp.codien.quanlycodien.model.Customer;
import htmp.codien.quanlycodien.model.Employee;
import htmp.codien.quanlycodien.model.Model;
import htmp.codien.quanlycodien.model.Product;
import htmp.codien.quanlycodien.repository.CustomerRepository;
import htmp.codien.quanlycodien.repository.EmployeeRepository;
import htmp.codien.quanlycodien.repository.ModelRepository;
import htmp.codien.quanlycodien.repository.ProductRepository;
import htmp.codien.quanlycodien.service.FileStorageService;
import htmp.codien.quanlycodien.service.ProductService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import com.lowagie.text.*;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final FileStorageService fileStorageService;
    private final EmployeeRepository employeeRepository;
    private final ModelRepository modelRepository;
    private final CustomerRepository customerRepository;

    @Override
    @Transactional
    public void updateProductImage(Long productId, MultipartFile file) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));

        try {
            String fileName = fileStorageService.storeFile(file);

            if (product.getImage() != null) {
                fileStorageService.deleteFile(product.getImage());
            }

            productRepository.updateProductImage(productId, fileName);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lưu trữ hình ảnh: " + e.getMessage(), e);
        }

    }

    @Override
    public byte[] generateHandoverPDF(HandoverMinutesRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new IllegalArgumentException("Nhân viên không tồn tại"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));

        Model model = modelRepository.findById(product.getModel().getId())
                .orElseThrow(() -> new IllegalArgumentException("Model không tồn tại"));

        Customer customer = customerRepository.findById(model.getCustomer().getId())
                .orElseThrow(() -> new IllegalArgumentException("Khách hàng không tồn tại"));

        String typeLabel = switch (request.getHandoverType()) {
            case "TAYGA" -> "Tay gá";
            case "BANCAT" -> "Bàn cắt";
            case "JIG" -> "JIG";
            default -> throw new IllegalArgumentException("Loại bàn giao không hợp lệ");
        };

        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            float cmToPt = 28.35f;
            float margin = 2 * cmToPt;

            Document document = new Document(PageSize.A4, margin, margin, margin, margin);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Font
            String fontPath = "src/main/resources/static/fonts/times-new-roman-14.ttf";
            BaseFont baseFont = BaseFont.createFont(fontPath, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            Font unicodeFont = new Font(baseFont, 12);
            Font titleFont = new Font(baseFont, 20, Font.BOLD);
            Font sectionFont = new Font(baseFont, 12, Font.BOLD);

            // Header
            PdfPTable headerTable = new PdfPTable(2);
            headerTable.setWidthPercentage(100);
            headerTable.setWidths(new float[] { 1f, 4f });

            Image img = Image.getInstance("src/main/resources/static/logo.png");
            img.scaleToFit(120, 80);
            PdfPCell logoCell = new PdfPCell(img, false);
            logoCell.setBorder(Rectangle.NO_BORDER);
            logoCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            logoCell.setVerticalAlignment(Element.ALIGN_MIDDLE);

            PdfPCell textCell = new PdfPCell();
            textCell.setBorder(Rectangle.NO_BORDER);
            textCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            textCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            Paragraph line1 = new Paragraph("CÔNG TY CỔ PHẦN HTMP VIỆT NAM", titleFont);
            line1.setAlignment(Element.ALIGN_CENTER);
            Paragraph line2 = new Paragraph("Địa chỉ: Số 38-2, KCN Quang Minh, Mê Linh, Hà Nội", unicodeFont);
            line2.setAlignment(Element.ALIGN_CENTER);
            Paragraph line3 = new Paragraph("Tel: +84 24 3599 0077/88    Fax: +84 24 3599 0066", unicodeFont);
            line3.setAlignment(Element.ALIGN_CENTER);
            textCell.addElement(line1);
            textCell.addElement(line2);
            textCell.addElement(line3);

            headerTable.addCell(logoCell);
            headerTable.addCell(textCell);
            document.add(headerTable);

            // Title
            Paragraph title = new Paragraph("BIÊN BẢN BÀN GIAO " + typeLabel.toUpperCase(), titleFont);
            title.setSpacingBefore(10f);
            title.setSpacingAfter(10f);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            // Thông tin 2 bên
            PdfPTable testTable = new PdfPTable(2);
            testTable.setWidthPercentage(100);
            testTable.setWidths(new float[] { 1f, 1f });
            testTable.setSpacingAfter(10f);

            PdfPCell benACell = new PdfPCell();
            benACell.setBorder(Rectangle.NO_BORDER);
            benACell.addElement(new Paragraph("BÊN A: PHÒNG CƠ ĐIỆN", sectionFont));
            benACell.addElement(new Paragraph("Họ và tên: " + employee.getName(), unicodeFont));
            benACell.addElement(new Paragraph("Mã nhân viên: " + employee.getCode(), unicodeFont));
            benACell.addElement(new Paragraph("Chức vụ: " + employee.getPosition(), unicodeFont));

            PdfPCell benBCell = new PdfPCell();
            benBCell.setBorder(Rectangle.NO_BORDER);
            benBCell.addElement(new Paragraph("BÊN B: " + request.getBenB().toUpperCase(), sectionFont));
            benBCell.addElement(new Paragraph("Họ và tên: " + request.getReceiver(), unicodeFont));
            benBCell.addElement(new Paragraph("Mã nhân viên: " + request.getEmployeeCode(), unicodeFont));
            benBCell.addElement(new Paragraph("Chức vụ: " + request.getPosition(), unicodeFont));

            testTable.addCell(benACell);
            testTable.addCell(benBCell);
            document.add(testTable);

            // Thông tin chung
            Paragraph chung = new Paragraph("Thông tin chung sản phẩm", sectionFont);
            chung.setSpacingBefore(10f);
            chung.setSpacingAfter(5f);
            document.add(chung);

            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[] { 1f, 3f });
            infoTable.setSpacingAfter(10f);

            String[][] thongTinChung = {
                    { "Khách hàng", customer.getName() },
                    { "Model", model.getCode() },
                    { "Mã sản phẩm", product.getCode() },
                    { "Tên sản phẩm", product.getName() },
                    { "Mã khuôn", product.getMoldCode() }
            };

            for (String[] row : thongTinChung) {
                PdfPCell left = new PdfPCell(new Phrase(row[0], unicodeFont));
                PdfPCell right = new PdfPCell(new Phrase(row[1], unicodeFont));
                left.setPadding(4f);
                right.setPadding(4f);
                infoTable.addCell(left);
                infoTable.addCell(right);
            }
            document.add(infoTable);

            // Nội dung bàn giao
            Paragraph giao = new Paragraph("Bên A bàn giao cho bên B", sectionFont);
            giao.setSpacingBefore(10f);
            giao.setSpacingAfter(5f);
            document.add(giao);

            if (typeLabel.equals("Tay gá")) {
                // document.add(new Paragraph("1. Tay gá", unicodeFont));
                PdfPTable tayGaTable = new PdfPTable(6);
                tayGaTable.setWidthPercentage(100);
                tayGaTable.setSpacingBefore(5f);
                tayGaTable.setSpacingAfter(10f);

                String[] tayGaHeaders = { "Cút loại 1", "Cút loại 2", "Núm loại 1", "Núm loại 2", "Kìm gắp gate",
                        "Kìm kẹp sản phẩm" };
                for (String header : tayGaHeaders) {
                    PdfPCell cell = new PdfPCell(new Phrase(header, unicodeFont));
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    tayGaTable.addCell(cell);
                }

                int[] tayGaSoLuong = { request.getCutLoai1(), request.getCutLoai2(), request.getNumLoai1(),
                        request.getNumLoai2(), request.getKimGapGate(), request.getKimKepSanPham() };
                for (int qty : tayGaSoLuong) {
                    PdfPCell cell = new PdfPCell(new Phrase(String.valueOf(qty), unicodeFont));
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    tayGaTable.addCell(cell);
                }
                document.add(tayGaTable);
            } else if (typeLabel.equals("Bàn cắt")) {
                // document.add(new Paragraph("2. Bàn cắt", unicodeFont));
                PdfPTable banCatTable = new PdfPTable(4);
                banCatTable.setWidthPercentage(100);
                banCatTable.setSpacingBefore(5f);
                banCatTable.setSpacingAfter(10f);

                String[] banCatHeaders = { "Thân kìm loại 1", "Thân kìm loại 2", "Lưỡi kìm loại 1", "Lưỡi kìm loại 2" };
                for (String header : banCatHeaders) {
                    PdfPCell cell = new PdfPCell(new Phrase(header, unicodeFont));
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    banCatTable.addCell(cell);
                }

                int[] banCatSoLuong = { request.getThanKimLoai1(), request.getThanKimLoai2(),
                        request.getLuoiKimLoai1(), request.getLuoiKimLoai2() };
                for (int qty : banCatSoLuong) {
                    PdfPCell cell = new PdfPCell(new Phrase(String.valueOf(qty), unicodeFont));
                    cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                    banCatTable.addCell(cell);
                }
                document.add(banCatTable);
            } else if (typeLabel.equals("JIG")) {
                PdfPTable jigTable = new PdfPTable(3); // 2 cột
                jigTable.setWidthPercentage(100);
                jigTable.setSpacingBefore(5f);
                jigTable.setSpacingAfter(10f);

                // Hàng tiêu đề
                PdfPCell headerName = new PdfPCell(new Phrase("Tên JIG", unicodeFont));
                headerName.setHorizontalAlignment(Element.ALIGN_CENTER);
                PdfPCell headerQty = new PdfPCell(new Phrase("Số lượng", unicodeFont));
                headerQty.setHorizontalAlignment(Element.ALIGN_CENTER);
                PdfPCell headerNote = new PdfPCell(new Phrase("Ghi chú", unicodeFont));
                headerQty.setHorizontalAlignment(Element.ALIGN_CENTER);
                jigTable.addCell(headerName);
                jigTable.addCell(headerQty);
                jigTable.addCell(headerNote);

                // Hàng dữ liệu
                PdfPCell valueName = new PdfPCell(new Phrase(request.getJigDetailName(), unicodeFont));
                valueName.setHorizontalAlignment(Element.ALIGN_LEFT);
                PdfPCell valueQty = new PdfPCell(new Phrase(String.valueOf(request.getNumberOfJigs()), unicodeFont));
                valueQty.setHorizontalAlignment(Element.ALIGN_CENTER);
                PdfPCell valueNote = new PdfPCell(new Phrase(String.valueOf(request.getNote()), unicodeFont));
                valueNote.setHorizontalAlignment(Element.ALIGN_LEFT);
                jigTable.addCell(valueName);
                jigTable.addCell(valueQty);
                jigTable.addCell(valueNote);

                document.add(jigTable);
            }

            // Ngày
            LocalDate currentDate = LocalDate.now();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("'Ngày' dd 'tháng' MM 'năm' yyyy");
            String formattedDate = currentDate.format(formatter);
            Paragraph date = new Paragraph(formattedDate, unicodeFont);
            date.setSpacingBefore(10f);
            date.setAlignment(Element.ALIGN_RIGHT);
            document.add(date);

            // Chữ ký
            PdfPTable footer = new PdfPTable(2);
            footer.setWidthPercentage(100);
            footer.setSpacingBefore(20f);

            PdfPCell cell1 = new PdfPCell(new Phrase("BÊN A - PHÒNG CƠ ĐIỆN", sectionFont));
            PdfPCell cell2 = new PdfPCell(new Phrase("BÊN B - " + request.getBenB().toUpperCase(), sectionFont));
            cell1.setBorder(Rectangle.NO_BORDER);
            cell2.setBorder(Rectangle.NO_BORDER);
            cell1.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell2.setHorizontalAlignment(Element.ALIGN_CENTER);
            footer.addCell(cell1);
            footer.addCell(cell2);
            document.add(footer);

            document.close();

            HttpHeaders headersHttp = new HttpHeaders();
            headersHttp.setContentType(MediaType.APPLICATION_PDF);
            headersHttp.setContentDispositionFormData("attachment", "bien_ban.pdf");
            return baos.toByteArray(); // ✅ TRẢ PDF VỀ ĐÚNG DẠNG
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo PDF bàn giao", e);
        }
    }

}
