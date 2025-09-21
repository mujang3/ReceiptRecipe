package org.receiptrecipe.backend.controller;

import org.receiptrecipe.backend.entity.Recipe;
import org.receiptrecipe.backend.service.RecipeService;
import org.receiptrecipe.backend.service.SpoonacularService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "*")
public class RecipeController {
    
    @Autowired
    private RecipeService recipeService;
    
    @Autowired
    private SpoonacularService spoonacularService;
    
    @GetMapping
    public ResponseEntity<Page<Recipe>> getAllRecipes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String difficultyLevel) {
        try {
            // name 파라미터가 있으면 search로 사용
            String searchTerm = (name != null && !name.trim().isEmpty()) ? name : search;
            Page<Recipe> recipes = recipeService.getAllRecipes(page, size, category, searchTerm, difficultyLevel);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getRecipeById(@PathVariable Long id) {
        try {
            Optional<Recipe> recipe = recipeService.getRecipeById(id);
            return recipe.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<Recipe> createRecipe(@RequestBody Recipe recipe) {
        try {
            Recipe savedRecipe = recipeService.saveRecipe(recipe);
            return ResponseEntity.ok(savedRecipe);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Recipe> updateRecipe(@PathVariable Long id, @RequestBody Recipe recipe) {
        try {
            Optional<Recipe> existingRecipe = recipeService.getRecipeById(id);
            if (existingRecipe.isPresent()) {
                recipe.setId(id);
                Recipe updatedRecipe = recipeService.updateRecipe(recipe);
                return ResponseEntity.ok(updatedRecipe);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        try {
            boolean deleted = recipeService.deleteRecipe(id);
            return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recipe>> getRecipesByUser(@PathVariable Long userId) {
        try {
            List<Recipe> recipes = recipeService.getRecipesByUserId(userId);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Recipe>> getRecipesByCategory(@PathVariable String category) {
        try {
            List<Recipe> recipes = recipeService.getRecipesByCategory(category);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Recipe>> searchRecipes(@RequestParam String keyword) {
        try {
            List<Recipe> recipes = recipeService.searchRecipes(keyword);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/rating")
    public ResponseEntity<Map<String, Object>> rateRecipe(
            @PathVariable Long id,
            @RequestParam Long userId,
            @RequestParam int rating,
            @RequestParam(required = false) String comment) {
        try {
            Map<String, Object> result = recipeService.rateRecipe(id, userId, rating, comment);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        try {
            List<String> categories = recipeService.getDistinctCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/difficulty-levels")
    public ResponseEntity<List<String>> getDifficultyLevels() {
        try {
            List<String> difficultyLevels = recipeService.getDistinctDifficultyLevels();
            return ResponseEntity.ok(difficultyLevels);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/external/korean")
    public ResponseEntity<List<SpoonacularService.RecipeData>> getKoreanRecipes(
            @RequestParam(defaultValue = "10") int number) {
        try {
            List<SpoonacularService.RecipeData> recipes = spoonacularService.searchKoreanRecipes(number);
            return ResponseEntity.ok(recipes);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/external/import")
    public ResponseEntity<Map<String, Object>> importKoreanRecipes(
            @RequestParam(defaultValue = "10") int number) {
        try {
            List<SpoonacularService.RecipeData> externalRecipes = spoonacularService.searchKoreanRecipes(number);
            int importedCount = 0;
            
            for (SpoonacularService.RecipeData externalRecipe : externalRecipes) {
                // 기존 레시피가 있는지 확인
                if (!recipeService.existsByExternalId(externalRecipe.getId().toString())) {
                    Recipe recipe = new Recipe();
                    recipe.setName(externalRecipe.getTitle());
                    recipe.setDescription(cleanHtml(externalRecipe.getSummary()));
                    recipe.setImageUrl(externalRecipe.getImage());
                    recipe.setCookingTime(externalRecipe.getReadyInMinutes());
                    recipe.setServings(externalRecipe.getServings());
                    recipe.setCategory("한국음식");
                    recipe.setDifficultyLevel("MEDIUM");
                    recipe.setInstructions(parseInstructions(externalRecipe.getInstructions()));
                    // ingredients는 별도 엔티티이므로 여기서는 설정하지 않음
                    recipe.setExternalId(externalRecipe.getId().toString());
                    
                    recipeService.saveRecipe(recipe);
                    importedCount++;
                }
            }
            
            Map<String, Object> result = Map.of(
                "importedCount", importedCount,
                "totalFound", externalRecipes.size(),
                "message", "한국 음식 레시피 " + importedCount + "개를 성공적으로 가져왔습니다."
            );
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> error = Map.of(
                "error", "레시피 가져오기 실패: " + e.getMessage()
            );
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    private String cleanHtml(String html) {
        if (html == null) return "";
        return html.replaceAll("<[^>]*>", "").trim();
    }
    
    private String parseInstructions(String instructionsJson) {
        // JSON에서 조리법 추출하는 간단한 로직
        if (instructionsJson == null || instructionsJson.trim().isEmpty()) {
            return "조리법 정보가 없습니다.";
        }
        return "외부 API에서 가져온 조리법입니다. 자세한 내용은 원본 사이트를 참조하세요.";
    }
    
}
