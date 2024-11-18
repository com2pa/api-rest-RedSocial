const profileRouter=require('express').Router();
const User = require('../models/user');

// Ruta para obtener el perfil de un usuario
profileRouter.get('/:id', async (response, request) => {
// busca al usuario
  const id = request.params.id;
  const user = await User.findById(id);

  // Si el usuario no existe, devuelve un mensaje de error
  if (!user) return response.status(404).json({ error: 'Usuario no encontrado' });
  
  // Devuelve el usuario con la información personalizada
  return response.status(200).json(user);
});

module.exports = profileRouter;
