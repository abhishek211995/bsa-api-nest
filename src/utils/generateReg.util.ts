export const generateRegNo = (breed_id: number, count: number) => {
  return new Date().getFullYear() + "-" + breed_id + "-" + count;
};
