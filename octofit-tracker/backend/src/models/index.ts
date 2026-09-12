import mongoose, { type InferSchemaType } from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
)

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
)

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['running', 'walking', 'strength'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKilometers: { type: Number, min: 0 },
    points: { type: Number, required: true, min: 0 },
    completedAt: { type: Date, required: true },
  },
  { timestamps: true },
)

const leaderboardSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    points: { type: Number, required: true, min: 0 },
    rank: { type: Number, required: true, min: 1 },
    period: { type: String, required: true },
  },
  { timestamps: true },
)

const workoutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['cardio', 'strength', 'mobility'], required: true },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    exercises: [{ type: String, required: true }],
  },
  { timestamps: true },
)

export type User = InferSchemaType<typeof userSchema>
export type Team = InferSchemaType<typeof teamSchema>
export type Activity = InferSchemaType<typeof activitySchema>
export type LeaderboardEntry = InferSchemaType<typeof leaderboardSchema>
export type Workout = InferSchemaType<typeof workoutSchema>

export const UserModel = mongoose.models.User ?? mongoose.model('User', userSchema)
export const TeamModel = mongoose.models.Team ?? mongoose.model('Team', teamSchema)
export const ActivityModel = mongoose.models.Activity ?? mongoose.model('Activity', activitySchema)
export const LeaderboardModel = mongoose.models.Leaderboard ?? mongoose.model('Leaderboard', leaderboardSchema)
export const WorkoutModel = mongoose.models.Workout ?? mongoose.model('Workout', workoutSchema)