import express from 'express'
import cors from 'cors'
import { errorHandler } from './middleware/errorHandler'
import usersRouter from './routes/users'
import dropsRouter from './routes/drops'
import reservationsRouter from './routes/reservations'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
app.use('/api/drops', dropsRouter)
app.use('/api/reservations', reservationsRouter)

app.use(errorHandler)

export default app
