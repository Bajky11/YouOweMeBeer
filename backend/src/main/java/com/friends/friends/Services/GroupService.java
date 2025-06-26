package com.friends.friends.Services;

import com.friends.friends.Entity.Group;
import com.friends.friends.Entity.User;
import com.friends.friends.Repository.GroupRepository;
import com.friends.friends.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class GroupService {
    @Autowired
    private GroupRepository groupRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Optional<Group> getGroupById(Long id) {
        return groupRepository.findById(id);
    }

    public Group createGroup(Group group) {
        return groupRepository.save(group);
    }

    public Optional<Group> updateGroup(Long id, Group groupDetails) {
        return groupRepository.findById(id).map(group -> {
            group.setName(groupDetails.getName());
            return groupRepository.save(group);
        });
    }

    public boolean deleteGroup(Long id) {
        if (!groupRepository.existsById(id)) return false;
        groupRepository.deleteById(id);
        return true;
    }

    public java.util.Optional<Group> addUserToGroup(Long groupId, Long userId) {
        java.util.Optional<Group> groupOpt = groupRepository.findById(groupId);
        java.util.Optional<User> userOpt = userRepository.findById(userId);
        if (groupOpt.isEmpty() || userOpt.isEmpty()) return java.util.Optional.empty();
        Group group = groupOpt.get();
        User user = userOpt.get();
        group.getUsers().add(user);
        groupRepository.save(group);
        return java.util.Optional.of(group);
    }

    public java.util.Optional<Group> removeUserFromGroup(Long groupId, Long userId) {
        java.util.Optional<Group> groupOpt = groupRepository.findById(groupId);
        java.util.Optional<User> userOpt = userRepository.findById(userId);
        if (groupOpt.isEmpty() || userOpt.isEmpty()) return java.util.Optional.empty();
        Group group = groupOpt.get();
        User user = userOpt.get();
        group.getUsers().remove(user);
        groupRepository.save(group);
        return java.util.Optional.of(group);
    }

    public List<Group> getGroupsForUser(Long userId) {
        return groupRepository.findGroupsByUserId(userId);
    }
}
