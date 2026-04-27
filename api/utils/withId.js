export const withId = (record) => {
  if (!record) return record;
  return { ...record, _id: record.id };
};

export const withIds = (records) => records.map(withId);
