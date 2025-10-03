const {
  createRequest,
  getRequests,
  updateRequest,
  deleteRequest,
  getPendingCount,
} = require('../services/ContactService');

// POST /api/contact-requests
const createContactRequest = async (req, res) => {
  try {
    const { name, phoneNumber, skinType, skinConcern ,type} = req.body;

    // Validation
    if (!name || !phoneNumber || !skinType || !skinConcern) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const requestData = { name, phoneNumber, skinType, skinConcern, status: 'pending',type };
    const request = await createRequest(requestData);

    res.status(201).json({
      success: true,
      message: 'Contact request created successfully',
      data: request,
    });
  } catch (error) {
    console.error('Error creating contact request:', error);
    res.status(500).json({ error: 'Failed to create contact request', message: error.message });
  }
};

// GET /api/contact-requests
const getContactRequests = async (req, res) => {
  try {
    const { status, page, limit } = req.query;
    const result = await getRequests({ status, page, limit });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Error fetching contact requests:', error);
    res.status(500).json({ error: 'Failed to fetch contact requests', message: error.message });
  }
};

// PUT /api/contact-requests/:id
const updateContactRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    if (!status || !['pending', 'contacted', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const request = await updateRequest(id, { status, adminNotes });

    res.json({
      success: true,
      message: 'Contact request updated successfully',
      data: request,
    });
  } catch (error) {
    console.error('Error updating contact request:', error);
    res.status(404).json({ error: 'Failed to update contact request', message: error.message });
  }
};

// DELETE /api/contact-requests/:id
const deleteContactRequest = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteRequest(id);

    res.json({
      success: true,
      message: 'Contact request deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting contact request:', error);
    res.status(404).json({ error: 'Failed to delete contact request', message: error.message });
  }
};

// GET /api/contact-requests/pending-count
const getPendingContactCount = async (req, res) => {
  try {
    const count = await getPendingCount();
    res.json({ success: true, count });
  } catch (error) {
    console.error('Error fetching pending count:', error);
    res.status(500).json({ error: 'Failed to fetch pending count', message: error.message });
  }
};

module.exports = {
  createContactRequest,
  getContactRequests,
  updateContactRequest,
  deleteContactRequest,
  getPendingContactCount,
};