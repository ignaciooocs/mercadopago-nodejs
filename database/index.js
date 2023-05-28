import mongoose from 'mongoose'

mongoose.connect(process.env.DATABASE_URI)
  .then(() => console.log('Database connected'))
  .catch((e) => console.log('Error database'))
