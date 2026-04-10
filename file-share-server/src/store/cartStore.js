let cart = [];

export const getCart = () => cart;

export const addToCart = (file) => {
  const exists = cart.some((cartItem) => cartItem.path === file.path);
  if (!exists) {
    cart.push(file);
    return { added: true, file: file };
  }
  return { added: false };
};

export const removeFromCart = (path) => {
  const index = cart.findIndex((cartItem) => cartItem.path === path);
  if (index !== -1) {
    const removedItem = cart.splice(index, 1)[0];
    return { removed: true, file: removedItem };
  }
  return { removed: false };
};

export const clearCart = () => {
  cart = [];
};
