import mongoose from 'mongoose'
import {
  ActivityModel,
  LeaderboardModel,
  TeamModel,
  UserModel,
  WorkoutModel,
} from '../models/index.js'

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db'

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString)

    console.log('Connected to octofit_db')

    await Promise.all([
      UserModel.deleteMany({}),
      TeamModel.deleteMany({}),
      ActivityModel.deleteMany({}),
      LeaderboardModel.deleteMany({}),
      WorkoutModel.deleteMany({}),
    ])

    const users = await UserModel.insertMany([
      {
        username: 'alex_runner',
        email: 'alex.runner@mergington.edu',
        displayName: 'Alex Rivera',
        password: 'octofit-demo',
      },
      {
        username: 'sam_strength',
        email: 'sam.strength@mergington.edu',
        displayName: 'Sam Lee',
        password: 'octofit-demo',
      },
      {
        username: 'jordan_moves',
        email: 'jordan.moves@mergington.edu',
        displayName: 'Jordan Patel',
        password: 'octofit-demo',
      },
    ])

    const teams = await TeamModel.insertMany([
      {
        name: 'Trail Blazers',
        description: 'A team focused on outdoor cardio and consistent movement.',
        members: [users[0]._id, users[2]._id],
      },
      {
        name: 'Power Pack',
        description: 'Strength training with steady progress and good form.',
        members: [users[1]._id],
      },
    ])

    const activities = await ActivityModel.insertMany([
      {
        user: users[0]._id,
        type: 'running',
        durationMinutes: 32,
        distanceKilometers: 5.1,
        points: 51,
        completedAt: new Date('2026-09-10T16:30:00Z'),
      },
      {
        user: users[1]._id,
        type: 'strength',
        durationMinutes: 40,
        points: 60,
        completedAt: new Date('2026-09-10T17:00:00Z'),
      },
      {
        user: users[2]._id,
        type: 'walking',
        durationMinutes: 45,
        distanceKilometers: 3.4,
        points: 34,
        completedAt: new Date('2026-09-11T15:15:00Z'),
      },
    ])

    await LeaderboardModel.insertMany([
      { user: users[0]._id, points: 245, rank: 1, period: '2026-09' },
      { user: users[1]._id, points: 210, rank: 2, period: '2026-09' },
      { user: users[2]._id, points: 180, rank: 3, period: '2026-09' },
    ])

    const workouts = await WorkoutModel.insertMany([
      {
        title: 'Quick Cardio Builder',
        description: 'A short cardio session to build endurance without equipment.',
        category: 'cardio',
        difficulty: 'beginner',
        durationMinutes: 20,
        exercises: ['March in place', 'High knees', 'Step-ups', 'Cool down walk'],
      },
      {
        title: 'Full Body Foundations',
        description: 'A balanced strength session using bodyweight movements.',
        category: 'strength',
        difficulty: 'intermediate',
        durationMinutes: 30,
        exercises: ['Bodyweight squats', 'Push-ups', 'Reverse lunges', 'Plank'],
      },
      {
        title: 'Post-Workout Reset',
        description: 'Gentle mobility work for recovery and range of motion.',
        category: 'mobility',
        difficulty: 'beginner',
        durationMinutes: 15,
        exercises: ['Cat-cow', 'Worlds greatest stretch', 'Hamstring reach', 'Childs pose'],
      },
    ])

    console.log(
      `Seeded ${users.length} users, ${teams.length} teams, ${activities.length} activities, `
        + `${await LeaderboardModel.countDocuments()} leaderboard entries, and ${workouts.length} workouts`,
    )
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

seedDatabase()
