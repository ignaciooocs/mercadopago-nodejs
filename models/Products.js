import { Schema, model } from 'mongoose'

const ProductSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  precio: {
    type: Number,
    required: true
  },
  marca: {
    type: String,
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  imagen: String,
  valoracion: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  caracteristicas: [String],
  opiniones: [{
    usuario: String,
    comentario: String,
    valoracion: {
      type: Number,
      min: 0,
      max: 5
    }
  }],
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
},
{
  timestamps: true
})

export const Product = model('Product', ProductSchema)
