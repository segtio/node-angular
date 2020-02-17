import faker from 'faker';

export default [
  {
    name: "Quizz 1",
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
  {
    name: "Quizz 2",
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
  {
    name: "Quizz 3",
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
];
