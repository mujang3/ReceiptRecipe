package org.receiptrecipe.backend.controller;

import org.receiptrecipe.backend.entity.Tag;
import org.receiptrecipe.backend.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "*")
public class TagController {
    
    @Autowired
    private TagRepository tagRepository;
    
    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        List<Tag> tags = tagRepository.findAllOrderByCreatedAtDesc();
        return ResponseEntity.ok(tags);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable Long id) {
        Optional<Tag> tag = tagRepository.findByIdWithRelations(id);
        return tag.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody Tag tag) {
        Tag savedTag = tagRepository.save(tag);
        return ResponseEntity.ok(savedTag);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Tag> updateTag(@PathVariable Long id, @RequestBody Tag tagDetails) {
        Optional<Tag> optionalTag = tagRepository.findById(id);
        if (optionalTag.isPresent()) {
            Tag tag = optionalTag.get();
            tag.setName(tagDetails.getName());
            tag.setColor(tagDetails.getColor());
            tag.setDescription(tagDetails.getDescription());
            
            Tag updatedTag = tagRepository.save(tag);
            return ResponseEntity.ok(updatedTag);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        if (tagRepository.existsById(id)) {
            tagRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Tag>> searchTags(@RequestParam String name) {
        List<Tag> tags = tagRepository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(tags);
    }
}
