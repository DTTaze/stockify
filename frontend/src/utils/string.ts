export const formatPrice = (price: number) => {
  return (price * 1000).toLocaleString("vi-VN") + " ₫";
};

export const formatDateTime = (value: string) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN");
};
