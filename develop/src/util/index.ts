import db from '../config/connection.js';
import { Thought, User } from '../model/index.js';
import cleanDB from './cleanDB.js';
import { getRandomName, getRandomThoughtText } from './data.js';


try {
  await db();
  await cleanDB();

  // Create empty arrays to hold users and thoughts
  const users = [];
  const thoughts = [];

  // Loop to create 20 users
  for (let i = 0; i < 20; i++) {
    const fullName = getRandomName();
    const username = fullName.split(' ')[0];
    const email = `${username.toLowerCase()}@example.com`;

    const user = {
      username,
      email,
      password: 'password123',
    };

    users.push(user);
  }

  // Add users to the collection
  const userData = await User.create(users);

  // Create thoughts for each user
  for (let i = 0; i < 20; i++) {
    const thoughtText = getRandomThoughtText();
    const username = userData[i].username;

    // Create a few reactions for each thought
    const reactions = [
      {
        reactionBody: 'I love this thought!',
        username: userData[i].username,
        createdAt: new Date(),
      },
      {
        reactionBody: 'Totally agree with you!',
        username: userData[(i + 1) % 20].username, // Random user for reaction
        createdAt: new Date(),
      },
    ];

    thoughts.push({
      thoughtText,
      username,
      userId: userData[i]._id,
      reactions,
    });
  }

  // Add thoughts to the collection
  const thoughtData = await Thought.create(thoughts);

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.table(thoughtData);
  console.info('Seeding complete! 🌱');
  process.exit(0);
} catch (error) {
  console.error('Error seeding database:', error);
  process.exit(1);
}
