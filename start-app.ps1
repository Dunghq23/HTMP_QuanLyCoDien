# Đường dẫn
$backendPath = "D:\Documents\quanlycodien\backend"
$frontendPath = "D:\Documents\quanlycodien\frontend"
$javaPath = "C:\Program Files\Java\jdk-22\bin\java.exe"

# # ✅ Bước 1: Build backend
# Start-Process powershell -ArgumentList "cd '$backendPath'; mvn clean compile dependency:copy-dependencies" -Wait

# ✅ Bước 2: Chạy backend
Start-Process powershell -ArgumentList "cd '$backendPath'; & '$javaPath' '@C:\Users\cd07\AppData\Local\Temp\cp_6rch6vzrfmlpf9148s9i2rzqe.argfile' 'htmp.codien.quanlycodien.QuanlycodienApplication'"

Start-Process powershell -ArgumentList "cd '$frontendPath'; npm start"

#  ${env:MYSQL_ROOT_PASSWORD}='root'; ${env:MYSQL_DATABASE}='codien'; ${env:BACKEND_PORT}='8080'; ${env:FRONTEND_PORT}='3000'; & 'C:\Program Files\Java\jdk-22\bin\java.exe' '@C:\Users\cd07\AppData\Local\Temp\cp_6rch6vzrfmlpf9148s9i2rzqe.argfile' 'htmp.codien.quanlycodien.QuanlycodienApplication' 