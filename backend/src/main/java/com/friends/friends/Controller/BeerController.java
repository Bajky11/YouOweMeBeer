package com.friends.friends.Controller;

import com.friends.friends.Entity.Beer;
import com.friends.friends.Services.BeerService;
import com.friends.friends.dto.BeerDebtDto;
import java.util.List;
import java.util.Map;
import com.friends.friends.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/beers")
public class BeerController {
    @Autowired
    private BeerService beerService;

    /**
     * GET /api/beers
     * Vrátí všechny záznamy o pivech.
     * Příklad: GET /api/beers
     */
    @GetMapping
    public List<Beer> getAllBeers() {
        return beerService.getAllBeers();
    }

    /**
     * GET /api/beers/{id}
     * Vrátí záznam o pivu podle ID.
     * Příklad: GET /api/beers/1
     */
    @GetMapping("/{id}")
    public ResponseEntity<Beer> getBeerById(@PathVariable Long id) {
        return beerService.getBeerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/beers
     * Přidá záznam o pivu.
     * Příklad: POST /api/beers
     * Body:
     * {
     *   "group": { "id": 1 },
     *   "fromUser": { "id": 2 },
     *   "toUser": { "id": 3 },
     *   "count": 1,
     *   "createdAt": "2025-06-24T12:00:00"
     * }
     */
    @PostMapping
    public Beer createBeer(@RequestBody Beer beer) {
        return beerService.createBeer(beer);
    }

    /**
     * PUT /api/beers/{id}
     * Aktualizuje záznam o pivu podle ID.
     * Příklad: PUT /api/beers/1
     * Body:
     * {
     *   "group": { "id": 1 },
     *   "fromUser": { "id": 2 },
     *   "toUser": { "id": 3 },
     *   "count": 2,
     *   "createdAt": "2025-06-24T13:00:00"
     * }
     */
    @PutMapping("/{id}")
    public ResponseEntity<Beer> updateBeer(@PathVariable Long id, @RequestBody Beer beerDetails) {
        return beerService.updateBeer(id, beerDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * DELETE /api/beers/{id}
     * Smaže záznam o pivu podle ID.
     * Příklad: DELETE /api/beers/1
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBeer(@PathVariable Long id) {
        if (!beerService.deleteBeer(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/beers/debts/{groupId}
     * Vrátí souhrnné dluhy mezi uživateli ve skupině.
     * Příklad: GET /api/beers/debts/1
     */
    @GetMapping("/debts/{groupId}")
    public List<BeerDebtDto> getDebtsByGroup(@PathVariable Long groupId) {
        return beerService.getDebtsByGroup(groupId);
    }

    /**
     * GET /api/beers/received/{groupId}
     * Vrátí kolik který uživatel celkem dostal piv ve skupině (username → count).
     * Příklad: GET /api/beers/received/1
     */
    @GetMapping("/received/{groupId}")
    public Map<String, Integer> getTotalBeersReceivedByUser(@PathVariable Long groupId) {
        return beerService.getTotalBeersReceivedByUser(groupId);
    }

    /**
     * GET /api/beers/group/{groupId}
     * Vrátí všechna piva pro danou skupinu podle ID.
     * Příklad: GET /api/beers/group/1
     */
    @GetMapping("/group/{groupId}")
    public List<Beer> getBeersByGroupId(@PathVariable Long groupId) {
        return beerService.getBeersByGroupId(groupId);
    }
}
