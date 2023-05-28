import mercadopago from 'mercadopago'
import { Product } from '../models/Products.js'

const PORT = process.env.PORT
export const createOrder = async (req, res) => {
  const { title, unitprice } = req.body

  mercadopago.configure({
    access_token: process.env.TOKEN_KEY
  })

  try {
    const response = await mercadopago.preferences.create(
      {
        items: [
          {
            title,
            unit_price: unitprice,
            currency_id: 'CLP',
            quantity: 1
          }
        ],
        back_urls: {
          success: 'http://localhost:5173',
          failure: 'http://localhost:5173',
          pending: `http://localhost:${PORT}/pay/pending`
        },
        notification_url: 'https://da31-201-219-234-203.sa.ngrok.io/pay/webhook'
      })
    console.log(response)
    res.send(response.body)
  } catch (error) {
    console.log('ocurrio un error al crear la orden')
  }
}

export const receiveWebhook = async (req, res) => {
  const payment = req.query

  try {
    if (payment.type === 'payment') {
      const data = await mercadopago.payment.findById(payment['data.id'])
      console.log(data)
      if (data.response.status === 'approved') {
        const name = data.body.description

        const product = await Product.findOne({ nombre: name })
        product.stock = product.stock - 1
        await product.save()
        console.log(product)
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
