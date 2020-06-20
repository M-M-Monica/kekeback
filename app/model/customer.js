const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const { Order, OrderList } = require('./order')
const { Cart, CartList } = require('./cart')
const Product = require('./product')

class Customer extends Model{
  /* WX */
  static async getUserByOpenid(openid){
    return await Customer.findOne({
      where:{
        openid
      }
    })
  }
  static async registerByOpenid(openid) {
    const customer = await Customer.create({
      openid
    })
    return customer.createCart()
  }
  static async getUserInfo(uid){
    return await Customer.findOne({
      attributes: {
        exclude: ['openid']
      },
      where:{
        id: uid
      }
    })
  }
  static async updateUserInfo(uid, userInfo){
    return await Customer.update({
      name: userInfo.name,
      tel: userInfo.tel,
      address: userInfo.address
    }, {
      where: {
        id: uid
      }
    })
  }
  /* CMS */
  static async getAll(pageNum){
    return await Customer.findAndCountAll({
      attributes: {
        exclude: ['openid']
      },
      offset: (pageNum-1)*10,
      limit: 10
    })
  }
}

Customer.init({
  id: {
    type: Sequelize.INTEGER(10),
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(25)
  },
  address: {
    type: Sequelize.STRING(50)
  },
  tel: {
    type: Sequelize.BIGINT(11)
  },
  openid: {
    type: Sequelize.STRING(64),
    unique: true
  }
}, { sequelize, tableName: 'customer' })

Customer.hasMany(Order)
Order.belongsTo(Customer)

Customer.hasOne(Cart)

Order.belongsToMany(Product, { through: 'OrderList' })
Product.belongsToMany(Order, { through: 'OrderList' })

Cart.belongsToMany(Product, { through: 'CartList' })
Product.belongsToMany(Cart, { through: 'CartList' })

module.exports = Customer