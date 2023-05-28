import 'dotenv/config'
import './database/index.js'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { router } from './routes/payment.routes.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use('/pay', router)

app.listen(process.env.PORT, () => console.log(`Running in port ${process.env.PORT}`))
