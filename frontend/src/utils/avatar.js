export const getAvatarSrc = (avatar) => {
  if (!avatar) return "";
  if (avatar.startsWith("data:image/") || avatar.startsWith("http")) return avatar;
  return avatar.startsWith("/") ? avatar : `/${avatar}`;
};

export const validateAvatarFile = (file) => {
  if (!file) return "";
  const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowedTypes.includes(file.type)) return "Avatar chi chap nhan PNG, JPG, JPEG hoac WEBP";
  if (file.size > 700 * 1024) return "Avatar toi da 700KB";
  return "";
};

export const readAvatarFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
