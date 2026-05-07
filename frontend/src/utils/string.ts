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

export const formatRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
