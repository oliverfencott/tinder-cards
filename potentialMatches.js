const Chance = require('chance');

module.exports = () => {
  const chance = new Chance();

  const amountOfMatches = chance.integer({ min: 10, max: 25 });

  return Array(amountOfMatches).fill().map(match => {
    return {
      id: chance.guid(),
      name: chance.first({ gender: 'female' }),
      age: chance.age({ type: 'adult' }),
      sharedInterestsCount: chance.integer({ min: 0, max: 10 }),
      mutualFriendsCount: chance.integer({ min: 0, max: 25 }),
      profileImage: 'https://placehold.it/350x515',
      interestedInYou: chance.bool()
    };
  });
};
