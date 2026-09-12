import express from 'express'
import { connectDatabase } from './config/database.js'
import { ActivityModel, UserModel } from './models/index.js'

const app = express()
const port = 8000
const codespaceName = process.env.CODESPACE_NAME
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`

app.use(express.json())

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', apiBaseUrl })
})

app.get('/api/users', async (_request, response, next) => {
  try {
    const users = await UserModel.find().select('-password').sort({ displayName: 1 }).lean()
    response.json(users)
  } catch (error) {
    next(error)
  }
})

app.get('/api/activities', async (_request, response, next) => {
  try {
    const activities = await ActivityModel.find()
      .populate('user', 'username displayName')
      .sort({ completedAt: -1 })
      .lean()
    response.json(activities)
  } catch (error) {
    next(error)
  }
})

app.use((error: unknown, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  console.error('API request failed:', error)
  response.status(500).json({ error: 'Internal server error' })
})

async function startServer() {
  try {
    await connectDatabase()
    app.listen(port, () => {
      console.log(`OctoFit API listening at ${apiBaseUrl}`)
    })
  } catch (error) {
    console.error('Unable to start OctoFit API:', error)
    process.exitCode = 1
  }
}

startServer()