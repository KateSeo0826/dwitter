import { db, sequelize } from '../db/database.js';
import SQ from 'sequelize';
import { User } from './auth.js'
// const SELECT_JOIN = 'SELECT tw.id, tw.text, tw.userId, tw.createAt, us.username, us.name, us.url From tweets as tw JOIN users as us ON tw.userId = us.id'
// const ORDER_DESC = 'ORDER BY tw.createAt DESC'
const Sequelize = SQ.Sequelize;
const DataTypes = SQ.DataTypes;

const Tweet = sequelize.define('tweet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
})
Tweet.belongsTo(User);
const INCLUDE_USER = {
  attributes: [
    'id',
    'text',
    'createdAt',
    'userId',
    [Sequelize.col('user.name'), 'name'],
    [Sequelize.col('user.username'), 'username'],
    [Sequelize.col('user.url'), 'url']],
  include: {
    model: User,
    attributes: []
  },

}
const ORDER_DESC = {
  order: [['createdAt', 'DESC']],
}
export async function getAll() {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
  }).then(data => {
    console.log(data); return data;
  })

  // return db.execute(
  //   `${SELECT_JOIN} ${ORDER_DESC}`
  // ).then(result => result[0])
}

export async function getAllByUsername(username) {

  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: { username }
    }
  }).then(data => {
    console.log(data); return data;
  })

  // return db.execute(
  //   `${SELECT_JOIN} WHERE username=?  ${ORDER_DESC}`, [username]
  // ).then(result => result[0])
}

export async function getById(id) {
  return Tweet.findOne({
    where: { id },
    ...INCLUDE_USER,
  })
  // return db.execute(
  //   `${SELECT_JOIN} WHERE tw.id=?  ${ORDER_DESC}`, [id]
  // ).then(result => result[0][0])
}

export async function create(text, userId) {
  return Tweet.create({ text, userId })
    .then((data) =>
      this.getById(data.dataValues.id)
    )
  // db.execute(
  //   'INSERT INTO tweets (text, createAt, userId) VALUES(?,?,?) ',
  //   [text, new Date(), userId]
  // ).then(result => getById(result[0].insertId))
}

export async function update(id, text) {

  return Tweet.findByPk(id, INCLUDE_USER)
    .then(tweet => {
      tweet.text = text;
      return tweet.save();
    })
  // db.execute(
  //   'UPDATE tweets SET text=? WHERE id=?',
  //   [text, id]
  // ).then(() => getById(id))
}

export async function remove(id) {
  return Tweet.findByPk(id)
    .then(tweet => {
      tweet.destroy();
    })
  // return db.execute('DELETE FROM tweets WHERE id=?', [id])
}

