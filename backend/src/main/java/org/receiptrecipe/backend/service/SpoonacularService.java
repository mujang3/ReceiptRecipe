package org.receiptrecipe.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class SpoonacularService {
    
    @Value("${spoonacular.api.key:}")
    private String apiKey;
    
    @Value("${spoonacular.api.base-url:https://api.spoonacular.com}")
    private String baseUrl;
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    public SpoonacularService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    public List<RecipeData> searchKoreanRecipes(int number) {
        // API 키가 없거나 에러가 발생한 경우 샘플 데이터 반환
        if (apiKey == null || apiKey.trim().isEmpty()) {
            return getSampleKoreanRecipes(number);
        }
        
        try {
            String url = baseUrl + "/recipes/complexSearch" +
                    "?cuisine=korean" +
                    "&number=" + number +
                    "&addRecipeInformation=true" +
                    "&apiKey=" + apiKey;
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "ReceiptRecipe/1.0");
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class);
            
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode results = root.get("results");
            
            List<RecipeData> recipes = new ArrayList<>();
            if (results != null && results.isArray()) {
                for (JsonNode recipe : results) {
                    RecipeData recipeData = new RecipeData();
                    recipeData.setId(recipe.get("id").asLong());
                    recipeData.setTitle(recipe.get("title").asText());
                    recipeData.setImage(recipe.get("image").asText());
                    recipeData.setReadyInMinutes(recipe.get("readyInMinutes").asInt());
                    recipeData.setServings(recipe.get("servings").asInt());
                    recipeData.setSummary(recipe.get("summary").asText());
                    recipeData.setInstructions(recipe.get("analyzedInstructions").toString());
                    recipeData.setExtendedIngredients(recipe.get("extendedIngredients").toString());
                    recipes.add(recipeData);
                }
            }
            
            return recipes;
        } catch (Exception e) {
            System.err.println("Error fetching Korean recipes: " + e.getMessage());
            return getSampleKoreanRecipes(number);
        }
    }
    
    private List<RecipeData> getSampleKoreanRecipes(int number) {
        List<RecipeData> recipes = new ArrayList<>();
        
        RecipeData kimchi = new RecipeData();
        kimchi.setId(1001L);
        kimchi.setTitle("김치찌개");
        kimchi.setImage("https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400");
        kimchi.setReadyInMinutes(30);
        kimchi.setServings(4);
        kimchi.setSummary("매콤하고 시원한 김치찌개입니다. 신선한 김치와 돼지고기로 끓여 만든 정통 한국 요리입니다.");
        kimchi.setInstructions("[{\"steps\":[{\"number\":1,\"step\":\"김치를 적당한 크기로 썰어주세요.\"},{\"number\":2,\"step\":\"돼지고기를 볶아주세요.\"},{\"number\":3,\"step\":\"김치와 고기를 함께 볶아주세요.\"},{\"number\":4,\"step\":\"물을 넣고 끓여주세요.\"}]}]");
        kimchi.setExtendedIngredients("[{\"name\":\"김치\",\"amount\":200,\"unit\":\"g\"},{\"name\":\"돼지고기\",\"amount\":150,\"unit\":\"g\"},{\"name\":\"두부\",\"amount\":100,\"unit\":\"g\"}]");
        recipes.add(kimchi);
        
        RecipeData bulgogi = new RecipeData();
        bulgogi.setId(1002L);
        bulgogi.setTitle("불고기");
        bulgogi.setImage("https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400");
        bulgogi.setReadyInMinutes(45);
        bulgogi.setServings(4);
        bulgogi.setSummary("달콤하고 부드러운 불고기입니다. 소고기를 양념에 재워 구워낸 한국의 대표적인 고기 요리입니다.");
        bulgogi.setInstructions("[{\"steps\":[{\"number\":1,\"step\":\"소고기를 얇게 썰어주세요.\"},{\"number\":2,\"step\":\"양념장을 만들어주세요.\"},{\"number\":3,\"step\":\"고기를 양념에 재워주세요.\"},{\"number\":4,\"step\":\"팬에 구워주세요.\"}]}]");
        bulgogi.setExtendedIngredients("[{\"name\":\"소고기\",\"amount\":300,\"unit\":\"g\"},{\"name\":\"간장\",\"amount\":3,\"unit\":\"큰술\"},{\"name\":\"설탕\",\"amount\":2,\"unit\":\"큰술\"}]");
        recipes.add(bulgogi);
        
        RecipeData bibimbap = new RecipeData();
        bibimbap.setId(1003L);
        bibimbap.setTitle("비빔밥");
        bibimbap.setImage("https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400");
        bibimbap.setReadyInMinutes(25);
        bibimbap.setServings(2);
        bibimbap.setSummary("다양한 나물과 고추장을 넣고 비빈 비빔밥입니다. 영양가 높고 맛있는 한국의 대표적인 한 끼 식사입니다.");
        bibimbap.setInstructions("[{\"steps\":[{\"number\":1,\"step\":\"밥을 준비해주세요.\"},{\"number\":2,\"step\":\"나물들을 준비해주세요.\"},{\"number\":3,\"step\":\"고추장 양념을 만들어주세요.\"},{\"number\":4,\"step\":\"모든 재료를 비벼주세요.\"}]}]");
        bibimbap.setExtendedIngredients("[{\"name\":\"밥\",\"amount\":2,\"unit\":\"공기\"},{\"name\":\"나물\",\"amount\":200,\"unit\":\"g\"},{\"name\":\"고추장\",\"amount\":2,\"unit\":\"큰술\"}]");
        recipes.add(bibimbap);
        
        RecipeData japchae = new RecipeData();
        japchae.setId(1004L);
        japchae.setTitle("잡채");
        japchae.setImage("https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400");
        japchae.setReadyInMinutes(40);
        japchae.setServings(4);
        japchae.setSummary("당면과 다양한 채소를 볶아 만든 잡채입니다. 한국의 대표적인 반찬으로 특별한 날에 자주 먹는 요리입니다.");
        japchae.setInstructions("[{\"steps\":[{\"number\":1,\"step\":\"당면을 삶아주세요.\"},{\"number\":2,\"step\":\"채소들을 썰어주세요.\"},{\"number\":3,\"step\":\"채소들을 볶아주세요.\"},{\"number\":4,\"step\":\"당면과 채소를 함께 볶아주세요.\"}]}]");
        japchae.setExtendedIngredients("[{\"name\":\"당면\",\"amount\":200,\"unit\":\"g\"},{\"name\":\"시금치\",\"amount\":100,\"unit\":\"g\"},{\"name\":\"당근\",\"amount\":1,\"unit\":\"개\"}]");
        recipes.add(japchae);
        
        RecipeData tteokbokki = new RecipeData();
        tteokbokki.setId(1005L);
        tteokbokki.setTitle("떡볶이");
        tteokbokki.setImage("https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400");
        tteokbokki.setReadyInMinutes(20);
        tteokbokki.setServings(2);
        tteokbokki.setSummary("매콤하고 쫄깃한 떡볶이입니다. 한국의 대표적인 길거리 음식으로 어린이부터 어른까지 모두 좋아하는 요리입니다.");
        tteokbokki.setInstructions("[{\"steps\":[{\"number\":1,\"step\":\"떡을 준비해주세요.\"},{\"number\":2,\"step\":\"고추장 양념을 만들어주세요.\"},{\"number\":3,\"step\":\"떡을 양념에 넣고 끓여주세요.\"},{\"number\":4,\"step\":\"어묵을 넣고 함께 끓여주세요.\"}]}]");
        tteokbokki.setExtendedIngredients("[{\"name\":\"떡\",\"amount\":300,\"unit\":\"g\"},{\"name\":\"고추장\",\"amount\":3,\"unit\":\"큰술\"},{\"name\":\"어묵\",\"amount\":100,\"unit\":\"g\"}]");
        recipes.add(tteokbokki);
        
        return recipes.stream().limit(number).collect(java.util.stream.Collectors.toList());
    }
    
    public RecipeData getRecipeById(Long id) {
        try {
            String url = baseUrl + "/recipes/" + id + "/information" +
                    "?includeNutrition=false" +
                    "&apiKey=" + apiKey;
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "ReceiptRecipe/1.0");
            HttpEntity<String> entity = new HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.GET, entity, String.class);
            
            JsonNode recipe = objectMapper.readTree(response.getBody());
            
            RecipeData recipeData = new RecipeData();
            recipeData.setId(recipe.get("id").asLong());
            recipeData.setTitle(recipe.get("title").asText());
            recipeData.setImage(recipe.get("image").asText());
            recipeData.setReadyInMinutes(recipe.get("readyInMinutes").asInt());
            recipeData.setServings(recipe.get("servings").asInt());
            recipeData.setSummary(recipe.get("summary").asText());
            recipeData.setInstructions(recipe.get("analyzedInstructions").toString());
            recipeData.setExtendedIngredients(recipe.get("extendedIngredients").toString());
            
            return recipeData;
        } catch (Exception e) {
            System.err.println("Error fetching recipe by ID: " + e.getMessage());
            return null;
        }
    }
    
    public static class RecipeData {
        private Long id;
        private String title;
        private String image;
        private Integer readyInMinutes;
        private Integer servings;
        private String summary;
        private String instructions;
        private String extendedIngredients;
        
        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        
        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }
        
        public Integer getReadyInMinutes() { return readyInMinutes; }
        public void setReadyInMinutes(Integer readyInMinutes) { this.readyInMinutes = readyInMinutes; }
        
        public Integer getServings() { return servings; }
        public void setServings(Integer servings) { this.servings = servings; }
        
        public String getSummary() { return summary; }
        public void setSummary(String summary) { this.summary = summary; }
        
        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }
        
        public String getExtendedIngredients() { return extendedIngredients; }
        public void setExtendedIngredients(String extendedIngredients) { this.extendedIngredients = extendedIngredients; }
    }
}
