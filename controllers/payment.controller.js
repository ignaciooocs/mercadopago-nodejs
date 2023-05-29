import mercadopago from 'mercadopago'
import { Product } from '../models/Products.js'

const PORT = process.env.PORT
export const createOrder = async (req, res) => {
  const { products } = req.body // Array de productos

  mercadopago.configure({
    access_token: process.env.TOKEN_KEY
  })

  try {
    const items = products.map((product) => ({
      title: product.nombre,
      unit_price: product.precio,
      currency_id: 'CLP',
      quantity: product.quantity,
      description: product.descripcion,
      picture_url: product.imagen,
      id: product._id,
      category_id: product.categoria
    }))

    const response = await mercadopago.preferences.create({
      items,
      back_urls: {
        success: 'http://localhost:5173',
        failure: 'http://localhost:5173',
        pending: `http://localhost:${PORT}/pay/pending`
      },
      notification_url: 'https://7073-201-219-234-203.sa.ngrok.io/pay/webhook'
    })

    res.send(response.body)
  } catch (error) {
    console.log('Ocurrió un error al crear la orden:', error)
  }
}

export const receiveWebhook = async (req, res) => {
  const payment = req.query
  try {
    if (payment.type === 'payment') {
      const data = await mercadopago.payment.findById(payment['data.id'])
      console.log(data)
      if (data.response.status === 'approved') {
        // Se recoren todos los productos y se le descuante la cantidad comprada del stock
        const { items } = data.response.additional_info
        console.log(items)

        items.forEach(async prod => {
          const product = await Product.findOne({ nombre: prod.title })
          product.stock = product.stock - prod.quantity
          await product.save()
        })
        console.log('El pago se a realizado correctamente')
      } else {
        console.log('El pago a fallado')
      }
    }
    res.sendStatus(204)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500).json({ error: error.message })
  }
}
