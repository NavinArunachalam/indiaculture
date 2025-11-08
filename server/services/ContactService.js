const ContactRequest = require('../models/contactrequest');

const createRequest = async (data) => {
  const req = new ContactRequest(data);
  return req.save();
};

const getRequests = async ({ status, page = 1, limit = 20 }) => {
  const query = status ? { status } : {};
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    ContactRequest.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
    ContactRequest.countDocuments(query),
  ]);
  return {
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const updateRequest = async (id, updates) => {
  const allowed = ['status', 'adminNotes'];
  const payload = {};
  Object.keys(updates).forEach((k) => {
    if (allowed.includes(k)) payload[k] = updates[k];
  });
  const doc = await ContactRequest.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  if (!doc) throw new Error('Contact request not found');
  return doc;
};

const deleteRequest = async (id) => {
  const doc = await ContactRequest.findByIdAndDelete(id);
  if (!doc) throw new Error('Contact request not found');
  return doc;
};

const getPendingCount = async () => ContactRequest.countDocuments({ status: 'pending' });

module.exports = {
  createRequest,
  getRequests,
  updateRequest,
  deleteRequest,
  getPendingCount,
};
