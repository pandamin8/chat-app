import * as dotenv from 'dotenv'
dotenv.config({ path: process.cwd() + '/.env' })

import express from 'express'
import path from 'path'

const app = express()

const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})