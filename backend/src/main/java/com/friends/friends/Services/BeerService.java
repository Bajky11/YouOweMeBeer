package com.friends.friends.Services;

import com.friends.friends.Entity.Beer;
import com.friends.friends.Entity.User;
import com.friends.friends.Repository.BeerRepository;
import com.friends.friends.Repository.UserRepository;
import com.friends.friends.dto.BeerDebtDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class BeerService {
    @Autowired
    private BeerRepository beerRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Beer> getAllBeers() {
        return beerRepository.findAll();
    }

    public Optional<Beer> getBeerById(Long id) {
        return beerRepository.findById(id);
    }

    public Beer createBeer(Beer beer) {
        return beerRepository.save(beer);
    }

    public Optional<Beer> updateBeer(Long id, Beer beerDetails) {
        return beerRepository.findById(id).map(beer -> {
            beer.setGroup(beerDetails.getGroup());
            beer.setFromUser(beerDetails.getFromUser());
            beer.setToUser(beerDetails.getToUser());
            beer.setCount(beerDetails.getCount());
            beer.setCreatedAt(beerDetails.getCreatedAt());
            return beerRepository.save(beer);
        });
    }

    public boolean deleteBeer(Long id) {
        if (!beerRepository.existsById(id)) return false;
        beerRepository.deleteById(id);
        return true;
    }

    public List<BeerDebtDto> getDebtsByGroup(Long groupId) {
        List<Beer> beers = beerRepository.findByGroupId(groupId);
        Map<String, Integer> debtMap = new HashMap<>();
        Map<Long, User> userIdToUser = new HashMap<>();
        for (Beer beer : beers) {
            Long fromId = beer.getFromUser().getId();
            Long toId = beer.getToUser().getId();
            String key = fromId + ":" + toId;
            debtMap.put(key, debtMap.getOrDefault(key, 0) + beer.getCount());
            userIdToUser.put(fromId, beer.getFromUser());
            userIdToUser.put(toId, beer.getToUser());
        }
        Map<String, Integer> simplifiedDebts = new HashMap<>();
        for (String key : debtMap.keySet()) {
            String[] ids = key.split(":");
            String a = ids[0];
            String b = ids[1];
            String keyAB = a + ":" + b;
            String keyBA = b + ":" + a;
            if (simplifiedDebts.containsKey(keyAB) || simplifiedDebts.containsKey(keyBA)) continue;
            int ab = debtMap.getOrDefault(keyAB, 0);
            int ba = debtMap.getOrDefault(keyBA, 0);
            int net = ab - ba;
            if (net > 0) {
                // b dluzi a
                simplifiedDebts.put(keyBA, net);
            } else if (net < 0) {
                // a dluzi b
                simplifiedDebts.put(keyAB, -net);
            }
            // pokud net == 0, nedluží si nic
        }
        return simplifiedDebts.entrySet().stream()
            .map(e -> {
            String[] ids = e.getKey().split(":");
            Long fromId = Long.parseLong(ids[0]);
            Long toId = Long.parseLong(ids[1]);
            return new BeerDebtDto(
                userIdToUser.get(fromId),
                userIdToUser.get(toId),
                e.getValue()
            );
            })
            .sorted((d1, d2) -> d1.getFromUser().getUsername().compareToIgnoreCase(d2.getFromUser().getUsername()))
            .collect(Collectors.toList());
    }

    /**
     * Vrací mapu uživatelů a počtu piv, které dostali, ve formátu username → count.
     */
    public Map<String, Integer> getTotalBeersReceivedByUser(Long groupId) {
        List<Beer> beers = beerRepository.findByGroupId(groupId);
        Map<String, Integer> receivedMap = new HashMap<>();
        for (Beer beer : beers) {
            String username = beer.getToUser().getUsername();
            receivedMap.put(username, receivedMap.getOrDefault(username, 0) + beer.getCount());
        }
        return receivedMap;
    }

    public List<Beer> getBeersByGroupId(Long groupId) {
        return beerRepository.findByGroupId(groupId)
            .stream()
            .sorted((b1, b2) -> b2.getCreatedAt().compareTo(b1.getCreatedAt()))
            .collect(Collectors.toList());
    }
}
