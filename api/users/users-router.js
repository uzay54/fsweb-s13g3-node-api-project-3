const express = require('express');
const {
  logger,
  validatePost,
  validateUser,
  validateUserId
} = require("../middleware/middleware")

// `users-model.js` ve `posts-model.js` sayfalarına ihtiyacınız var
const User = require("./users-model");
const Post = require("../posts/posts-model");

// ara yazılım fonksiyonları da gereklidir

const router = express.Router();

router.get('/', (req, res, next) => {
  // TÜM KULLANICILARI İÇEREN DİZİYİ DÖNDÜRÜN
  User.get()
  .then(users => {
    res.json(users)
  })
  .catch(next)
});

router.get('/:id', validateUserId,(req, res, next) => {
  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir
  res.json(req.user)
  next()
});

router.post('/', validateUser, (req, res, next) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  User.insert({name: req.name})
  .then(newUser => {
    res.status(201).json(newUser)
  })
  .catch(next)
});

router.put('/:id', validateUserId, validateUser, async (req, res, next) => {
  // YENİ GÜNCELLENEN USER NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan ara yazılım gereklidir
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try{
    await User.update(req.params.id, { name: req.name})
    const updatedUser = await User.getById(req.params.id)
    res.json(updatedUser)
  } catch(err) {
    next(err)
  }
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // SON SİLİNEN USER NESNESİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try{
    await User.remove(req.params.id)
    res.json(req.user)
  } catch(err) {
    next(err)
  }
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // USER POSTLARINI İÇEREN BİR DİZİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try{
    const result = await User.getUserPosts(req.params.id)
    res.json(result)
  } catch(err) {
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  // YENİ OLUŞTURULAN KULLANICI NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try{
    const result = await Post.insert({
      user_id: req.params.id,
      text: req.text
    })
    res.json(result)
  } catch(err) {
    next(err);
  }
});

// routerı dışa aktarmayı unutmayın



router.use((err,req,res,next) => {
  res.status(err.status || 500).json({
    customMessage: "Yanlış giden bir şeyler var",
    message: err.message
  })
})

module.exports = router;