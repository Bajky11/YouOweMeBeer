package com.friends.friends.Controller;

import com.friends.friends.Entity.Group;
import com.friends.friends.Services.GroupService;
import com.friends.friends.Entity.User;
import com.friends.friends.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class GroupController {
    @Autowired
    private GroupService groupService;

    @Autowired
    private UserService userService;

    /**
     * GET /api/groups
     * Vrátí všechny skupiny.
     * Příklad: GET /api/groups
     */
    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    /**
     * GET /api/groups/{id}
     * Vrátí skupinu podle ID.
     * Příklad: GET /api/groups/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<Group> getGroupById(@PathVariable Long id) {
        return groupService.getGroupById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/groups
     * Vytvoří novou skupinu.
     * Příklad: POST /api/groups
     * Body:
     * {
     *   "name": "Pivní parta"
     * }
     */
    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody Group group, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        Group newGroup = groupService.createGroup(group);
        groupService.addUserToGroup(newGroup.getId(), user.getId());
        return ResponseEntity.ok(newGroup);
    }

    /**
     * PUT /api/groups/{id}
     * Aktualizuje skupinu podle ID.
     * Příklad: PUT /api/groups/1
     * Body:
     * {
     *   "name": "Nový název"
     * }
     */
    @PutMapping("/{id}")
    public ResponseEntity<Group> updateGroup(@PathVariable Long id, @RequestBody Group groupDetails) {
        return groupService.updateGroup(id, groupDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/groups/{id}
     * Smaže skupinu podle ID.
     * Příklad: DELETE /api/groups/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable Long id) {
        if (!groupService.deleteGroup(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/groups/{groupId}/add-user
     * Přidá aktuálně přihlášeného uživatele do skupiny.
     * Příklad: POST /api/groups/1/add-user
     * (uživatel posílá své ID v hlavičce X-USER-ID)
     */
    @PostMapping("/{groupId}/add-user")
    public ResponseEntity<Group> addUserToGroup(@PathVariable Long groupId, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }
        return groupService.addUserToGroup(groupId, user.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/groups/{groupId}/remove-user
     * Odebere uživatele se zadaným userId ze skupiny.
     * Příklad: DELETE /api/groups/1/remove-user?userId=2
     */
    @DeleteMapping("/{groupId}/remove-user")
    public ResponseEntity<Group> removeUserFromGroup(@PathVariable Long groupId, @RequestParam Long userId) {
        return groupService.removeUserFromGroup(groupId, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/groups/my
     * Vrátí všechny skupiny, ve kterých je aktuálně přihlášený uživatel.
     * Příklad: GET /api/groups/my
     */
    @GetMapping("/my")
    public List<Group> getMyGroups(@AuthenticationPrincipal User user) {
        return groupService.getGroupsForUser(user.getId());
    }
}
