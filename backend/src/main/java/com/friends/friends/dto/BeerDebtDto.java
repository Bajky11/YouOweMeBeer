package com.friends.friends.dto;

import com.friends.friends.Entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BeerDebtDto {
    private User fromUser;
    private User toUser;
    private int debt;

    public BeerDebtDto(User fromUser, User toUser, int debt) {
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.debt = debt;
    }
}
