package htmp.codien.quanlycodien.service;

import htmp.codien.quanlycodien.dto.AuthResponseDTO;

public interface AuthService {
    AuthResponseDTO login(String code, String password);
    AuthResponseDTO refreshToken(String token) throws Exception;
    AuthResponseDTO getUserInfo(String token) throws Exception;
    void logout(String token) throws Exception;
}
