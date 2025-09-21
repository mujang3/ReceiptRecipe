package org.receiptrecipe.backend.service;

import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class OcrService {

    public String extractTextFromImage(String imagePath) throws IOException {
        try {
            // Vision API 클라이언트 생성
            ImageAnnotatorClient vision = ImageAnnotatorClient.create();
            
            // 이미지 파일 읽기
            byte[] imageBytes = Files.readAllBytes(Paths.get(imagePath));
            ByteString imgBytes = ByteString.copyFrom(imageBytes);
            
            // 이미지 빌드
            Image img = Image.newBuilder().setContent(imgBytes).build();
            
            // 텍스트 감지 요청
            Feature feat = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feat)
                    .setImage(img)
                    .build();
            
            // 요청 실행
            List<AnnotateImageRequest> requests = new ArrayList<>();
            requests.add(request);
            BatchAnnotateImagesResponse response = vision.batchAnnotateImages(requests);
            
            List<AnnotateImageResponse> responses = response.getResponsesList();
            
            // 결과 처리
            StringBuilder extractedText = new StringBuilder();
            for (AnnotateImageResponse res : responses) {
                if (res.hasError()) {
                    System.err.println("Error: " + res.getError().getMessage());
                    continue;
                }
                
                // 텍스트 추출
                for (EntityAnnotation annotation : res.getTextAnnotationsList()) {
                    extractedText.append(annotation.getDescription()).append("\n");
                }
            }
            
            vision.close();
            return extractedText.toString().trim();
            
        } catch (Exception e) {
            System.err.println("OCR 처리 중 오류 발생: " + e.getMessage());
            // Google Cloud 인증이 없을 때 기본 텍스트 반환
            return "영수증 이미지가 업로드되었습니다.\n매장: Unknown Store\n총액: 0원\n구매일: " + java.time.LocalDate.now() + "\n상품: 영수증 이미지 파일";
        }
    }
    
    public String extractTextFromImageBytes(byte[] imageBytes) throws IOException {
        try {
            // Vision API 클라이언트 생성
            ImageAnnotatorClient vision = ImageAnnotatorClient.create();
            
            ByteString imgBytes = ByteString.copyFrom(imageBytes);
            
            // 이미지 빌드
            Image img = Image.newBuilder().setContent(imgBytes).build();
            
            // 텍스트 감지 요청
            Feature feat = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feat)
                    .setImage(img)
                    .build();
            
            // 요청 실행
            List<AnnotateImageRequest> requests = new ArrayList<>();
            requests.add(request);
            BatchAnnotateImagesResponse response = vision.batchAnnotateImages(requests);
            
            List<AnnotateImageResponse> responses = response.getResponsesList();
            
            // 결과 처리
            StringBuilder extractedText = new StringBuilder();
            for (AnnotateImageResponse res : responses) {
                if (res.hasError()) {
                    System.err.println("Error: " + res.getError().getMessage());
                    continue;
                }
                
                // 텍스트 추출
                for (EntityAnnotation annotation : res.getTextAnnotationsList()) {
                    extractedText.append(annotation.getDescription()).append("\n");
                }
            }
            
            vision.close();
            return extractedText.toString().trim();
            
        } catch (Exception e) {
            System.err.println("OCR 처리 중 오류 발생: " + e.getMessage());
            // Google Cloud 인증이 없을 때 기본 텍스트 반환
            return "영수증 이미지가 업로드되었습니다.\n매장: Unknown Store\n총액: 0원\n구매일: " + java.time.LocalDate.now() + "\n상품: 영수증 이미지 파일";
        }
    }
}
