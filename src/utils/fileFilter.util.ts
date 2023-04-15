export const fileFilter = (files, field) => {
  return files?.filter((file) => {
    if (file.fieldname === field) {
      return file;
    }
  });
};
