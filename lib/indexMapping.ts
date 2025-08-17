export const indexMapping: Record<string, any> = {
  Member_now: {
    id: 0,
    children: { index: 2 },
    general: {
      index: 4,
      name: 0,
      generation: 1,
      talent: 2,
      talentPotential: 3,
      gender: 4,
      lifeSpan: 5,
      skill: 6,
      luck: 7,
      unknown: 8,
      hobby: 9,
    },
    potential: {
      writing: 7,
      might: 8,
      business: 9,
      art: 10
    },
    age: 6,
    renown: 16,
    charisma: 20,
    clan_elder: 22,
    cunning: 27,
    skillLv: 33,
  },

  Member_qu: {
    id: 0,
    general: {
      index: 2,
      name: 0,
      clan: 1,
      talent: 2,
      talentPotential: 3,
      gender: 4,
      lifeSpan: 5,
      skill: 6,
      luck: 7,
      trait: 8,
      marryTo: 9,
      hobby: 10,
      unknown: 11,
    },
    potential: {
      writing: 6,
      might: 7,
      business: 8,
      art: 9
    },
    age: 5,
    renown: 12,
    charisma: 15,
    cunning: 19,
    skillLv: 23,
  },

  MenKe_Now: {
    general: {
      index: 2,
      name: 0,
      unknown: 1,
      talent: 2,
      talentPotential: 3,
      gender: 4,
      lifeSpan: 5,
      skill: 6,
      luck: 7,
      trait: 8,
      unknown_: 9,
    },
    potential: {
      writing: 4,
      might: 5,
      business: 6,
      art: 7
    },
    
    age: 3,
    renown: 11,
    charisma: 13,
    cunning: 15,
    skillLv: 16,
    monthlyPay: 18
  },

  CGNum: {
    coin: 0,
    gold: 1
  }
};