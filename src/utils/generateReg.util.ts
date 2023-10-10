export const generateRegNo = (breed_id: number, count: number) => {
  return new Date().getFullYear() + "-" + breed_id + "-" + count;
};

export const getFiveDigitId = (id: number) => {
  const str = "" + id;
  const pad = "0000";
  const ans = pad.substring(0, pad.length - str.length) + str;
  return ans;
};
