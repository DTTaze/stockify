export const formatPrice = (price: number) => {
  return (price * 1000).toLocaleString("vi-VN") + " ₫";
};
